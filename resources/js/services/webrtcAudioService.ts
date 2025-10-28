interface PeerConnection {
    id: number;
    connection: RTCPeerConnection;
    stream?: MediaStream;
    audioElement?: HTMLAudioElement;
}

interface SignalingMessage {
    type: 'offer' | 'answer' | 'ice-candidate' | 'join' | 'leave' | 'mute' | 'unmute';
    from: number;
    to?: number;
    data?: any;
    sessionId: number;
}

class WebRTCAudioService {
    private peerConnections: Map<number, PeerConnection> = new Map();
    private localStream: MediaStream | null = null;
    private isMuted = false;
    private sessionId: number | null = null;
    private userId: number | null = null;
    private echo: any = null;
    private onParticipantJoined?: (participantId: number) => void;
    private onParticipantLeft?: (participantId: number) => void;
    private onParticipantMuted?: (participantId: number, muted: boolean) => void;

    constructor() {
        this.setupEchoListeners();
    }

    private setupEchoListeners() {
        // This will be called when Echo is initialized
    }

    async initialize(sessionId: number, userId: number, echo: any) {
        this.sessionId = sessionId;
        this.userId = userId;
        this.echo = echo;

        // Listen for signaling messages
        this.echo.private(`group-chat.${sessionId}`)
            .listen('.webrtc.signaling', (event: { message: SignalingMessage }) => {
                this.handleSignalingMessage(event.message);
            });

        // Listen for participant changes
        this.echo.private(`group-chat.${sessionId}`)
            .listen('.participant.joined', (event: { participantId: number }) => {
                if (event.participantId !== this.userId) {
                    this.onParticipantJoined?.(event.participantId);
                }
            })
            .listen('.participant.left', (event: { participantId: number }) => {
                this.removePeerConnection(event.participantId);
                this.onParticipantLeft?.(event.participantId);
            });
    }

    async joinAudioSession(): Promise<void> {
        try {
            // Get user media
            this.localStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            // Send join message to other participants
            this.broadcastSignalingMessage({
                type: 'join',
                from: this.userId!,
                sessionId: this.sessionId!
            });

        } catch (error) {
            console.error('Failed to join audio session:', error);
            throw error;
        }
    }

    async leaveAudioSession(): Promise<void> {
        // Stop local stream
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }

        // Close all peer connections
        this.peerConnections.forEach(peer => {
            peer.connection.close();
            if (peer.audioElement) {
                peer.audioElement.remove();
            }
        });
        this.peerConnections.clear();

        // Send leave message
        this.broadcastSignalingMessage({
            type: 'leave',
            from: this.userId!,
            sessionId: this.sessionId!
        });
    }

    async connectToParticipant(participantId: number): Promise<void> {
        if (this.peerConnections.has(participantId)) {
            return; // Already connected
        }

        const peerConnection = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        });

        const peer: PeerConnection = {
            id: participantId,
            connection: peerConnection
        };

        this.peerConnections.set(participantId, peer);

        // Add local stream tracks
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, this.localStream!);
            });
        }

        // Handle remote stream
        peerConnection.ontrack = (event) => {
            const remoteStream = event.streams[0];
            peer.stream = remoteStream;

            // Create audio element for remote audio
            const audioElement = new Audio();
            audioElement.srcObject = remoteStream;
            audioElement.autoplay = true;
            audioElement.volume = 1;
            peer.audioElement = audioElement;

            document.body.appendChild(audioElement);
        };

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this.sendSignalingMessage(participantId, {
                    type: 'ice-candidate',
                    from: this.userId!,
                    to: participantId,
                    data: event.candidate,
                    sessionId: this.sessionId!
                });
            }
        };

        // Create offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        this.sendSignalingMessage(participantId, {
            type: 'offer',
            from: this.userId!,
            to: participantId,
            data: offer,
            sessionId: this.sessionId!
        });
    }

    private async handleSignalingMessage(message: SignalingMessage): Promise<void> {
        const { type, from, data } = message;

        switch (type) {
            case 'join':
                // New participant joined, connect to them
                await this.connectToParticipant(from);
                break;

            case 'leave':
                // Participant left, remove connection
                this.removePeerConnection(from);
                break;

            case 'offer':
                await this.handleOffer(from, data);
                break;

            case 'answer':
                await this.handleAnswer(from, data);
                break;

            case 'ice-candidate':
                await this.handleIceCandidate(from, data);
                break;

            case 'mute':
            case 'unmute':
                this.onParticipantMuted?.(from, type === 'mute');
                break;
        }
    }

    private async handleOffer(from: number, offer: RTCSessionDescriptionInit): Promise<void> {
        let peer = this.peerConnections.get(from);

        if (!peer) {
            const peerConnection = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            });

            peer = {
                id: from,
                connection: peerConnection
            };

            this.peerConnections.set(from, peer);

            // Add local stream tracks
            if (this.localStream) {
                this.localStream.getTracks().forEach(track => {
                    peerConnection.addTrack(track, this.localStream!);
                });
            }

            // Handle remote stream
            peerConnection.ontrack = (event) => {
                const remoteStream = event.streams[0];
                peer!.stream = remoteStream;

                const audioElement = new Audio();
                audioElement.srcObject = remoteStream;
                audioElement.autoplay = true;
                audioElement.volume = 1;
                peer!.audioElement = audioElement;

                document.body.appendChild(audioElement);
            };

            // Handle ICE candidates
            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    this.sendSignalingMessage(from, {
                        type: 'ice-candidate',
                        from: this.userId!,
                        to: from,
                        data: event.candidate,
                        sessionId: this.sessionId!
                    });
                }
            };
        }

        await peer.connection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.connection.createAnswer();
        await peer.connection.setLocalDescription(answer);

        this.sendSignalingMessage(from, {
            type: 'answer',
            from: this.userId!,
            to: from,
            data: answer,
            sessionId: this.sessionId!
        });
    }

    private async handleAnswer(from: number, answer: RTCSessionDescriptionInit): Promise<void> {
        const peer = this.peerConnections.get(from);
        if (peer) {
            await peer.connection.setRemoteDescription(new RTCSessionDescription(answer));
        }
    }

    private async handleIceCandidate(from: number, candidate: RTCIceCandidateInit): Promise<void> {
        const peer = this.peerConnections.get(from);
        if (peer) {
            await peer.connection.addIceCandidate(new RTCIceCandidate(candidate));
        }
    }

    private removePeerConnection(participantId: number): void {
        const peer = this.peerConnections.get(participantId);
        if (peer) {
            peer.connection.close();
            if (peer.audioElement) {
                peer.audioElement.remove();
            }
            this.peerConnections.delete(participantId);
        }
    }

    toggleMute(): boolean {
        if (!this.localStream) return false;

        this.isMuted = !this.isMuted;
        this.localStream.getAudioTracks().forEach(track => {
            track.enabled = !this.isMuted;
        });

        // Broadcast mute status
        this.broadcastSignalingMessage({
            type: this.isMuted ? 'mute' : 'unmute',
            from: this.userId!,
            sessionId: this.sessionId!
        });

        return this.isMuted;
    }

    isAudioMuted(): boolean {
        return this.isMuted;
    }

    getConnectedParticipants(): number[] {
        return Array.from(this.peerConnections.keys());
    }

    setParticipantCallbacks(callbacks: {
        onParticipantJoined?: (participantId: number) => void;
        onParticipantLeft?: (participantId: number) => void;
        onParticipantMuted?: (participantId: number, muted: boolean) => void;
    }) {
        this.onParticipantJoined = callbacks.onParticipantJoined;
        this.onParticipantLeft = callbacks.onParticipantLeft;
        this.onParticipantMuted = callbacks.onParticipantMuted;
    }

    private sendSignalingMessage(to: number, message: SignalingMessage): void {
        // Send via HTTP POST to backend for proper broadcasting
        fetch(`/group-chats/${this.sessionId}/webrtc-signaling`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify(message),
        }).catch(error => {
            console.error('Failed to send signaling message:', error);
        });
    }

    private broadcastSignalingMessage(message: SignalingMessage): void {
        // Broadcast to all participants via HTTP POST
        fetch(`/group-chats/${this.sessionId}/webrtc-signaling`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify(message),
        }).catch(error => {
            console.error('Failed to broadcast signaling message:', error);
        });
    }

    destroy(): void {
        this.leaveAudioSession();
        this.echo = null;
    }
}

export default WebRTCAudioService;