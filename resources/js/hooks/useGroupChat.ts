import { useState, useEffect, useRef, useCallback } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { type GroupChatMessage } from '@/types';
import { useWebRTCAudio } from './useWebRTCAudio';
import { useParticipantAudioStates } from './useParticipantAudioStates';

// Make Pusher globally available
(window as any).Pusher = Pusher;

interface UseGroupChatOptions {
    sessionId: number;
    currentUserId: number;
    initialMessages?: GroupChatMessage[];
    onMessageReceived?: (message: GroupChatMessage) => void;
    onParticipantJoined?: (participantId: number) => void;
    onParticipantLeft?: (participantId: number) => void;
}

interface UseGroupChatReturn {
    messages: GroupChatMessage[];
    isConnected: boolean;
    sendMessage: (content: string, type?: 'text' | 'audio' | 'file', file?: File) => Promise<void>;
    joinSession: () => Promise<void>;
    leaveSession: () => Promise<void>;
    // WebRTC Audio properties
    isAudioJoined: boolean;
    isAudioMuted: boolean;
    isAudioConnecting: boolean;
    connectedParticipants: number[];
    joinAudio: () => Promise<void>;
    leaveAudio: () => Promise<void>;
    toggleAudioMute: () => boolean;
    audioError: string | null;
    // Participant audio states
    participantAudioStates: ReturnType<typeof useParticipantAudioStates>;
    error: string | null;
}

export function useGroupChat({
    sessionId,
    currentUserId,
    initialMessages = [],
    onMessageReceived,
    onParticipantJoined,
    onParticipantLeft
}: UseGroupChatOptions): UseGroupChatReturn {
    const [messages, setMessages] = useState<GroupChatMessage[]>(initialMessages);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const echoRef = useRef<any>(null);
    const channelRef = useRef<any>(null);

    // Participant audio state management
    const participantAudioStates = useParticipantAudioStates();

    // WebRTC Audio functionality
    const webrtcAudio = useWebRTCAudio({
        sessionId,
        currentUserId,
        echo: echoRef.current,
        onParticipantJoined: (participantId) => {
            participantAudioStates.setParticipantConnected(participantId, true);
            onParticipantJoined?.(participantId);
        },
        onParticipantLeft: (participantId) => {
            participantAudioStates.removeParticipant(participantId);
            onParticipantLeft?.(participantId);
        },
        onParticipantMuted: (participantId, muted) => {
            participantAudioStates.setParticipantMuted(participantId, muted);
        }
    });

    // Initialize real-time connection
    useEffect(() => {
        const initializeEcho = async () => {
            try {
                // Initialize Laravel Echo for real-time updates
                echoRef.current = new Echo({
                    broadcaster: 'pusher',
                    key: process.env.MIX_PUSHER_APP_KEY || 'local',
                    cluster: process.env.MIX_PUSHER_APP_CLUSTER || 'mt1',
                    wsHost: window.location.hostname,
                    wsPort: 6001,
                    wssPort: 6001,
                    forceTLS: false,
                    disableStats: true,
                    enabledTransports: ['ws', 'wss'],
                });

                // Join the group chat channel
                channelRef.current = echoRef.current.private(`group-chat.${sessionId}`)
                    .listen('.message.sent', (e: { message: GroupChatMessage }) => {
                        setMessages(prev => [...prev, e.message]);
                        onMessageReceived?.(e.message);
                    })
                    .listen('.participant.joined', (e: { participantId: number }) => {
                        onParticipantJoined?.(e.participantId);
                    })
                    .listen('.participant.left', (e: { participantId: number }) => {
                        onParticipantLeft?.(e.participantId);
                    })
                    .listen('.webrtc.signaling', (e: { message: any }) => {
                        // Handle WebRTC signaling
                        console.log('WebRTC signaling:', e.message);
                    });

                setIsConnected(true);
                setError(null);
            } catch (err) {
                console.warn('Failed to initialize real-time connection:', err);
                setError('Real-time connection failed. Messages may not update automatically.');
                setIsConnected(false);
            }
        };

        initializeEcho();

        return () => {
            if (echoRef.current) {
                echoRef.current.leave(`group-chat.${sessionId}`);
                echoRef.current = null;
            }
            channelRef.current = null;
            setIsConnected(false);
        };
    }, [sessionId, onMessageReceived, onParticipantJoined, onParticipantLeft]);

    // Send message function
    const sendMessage = useCallback(async (
        content: string,
        type: 'text' | 'audio' | 'file' = 'text',
        file?: File
    ) => {
        const formData = new FormData();
        formData.append('type', type);

        if (type === 'text') {
            formData.append('message', content);
        } else if (type === 'audio' && file) {
            formData.append('message', file, 'audio.webm');
        } else if (type === 'file' && file) {
            formData.append('message', file, file.name);
        }

        try {
            const response = await fetch(`/group-chats/${sessionId}/messages`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }
        } catch (err) {
            setError('Failed to send message. Please try again.');
            throw err;
        }
    }, [sessionId]);

    // Join session
    const joinSession = useCallback(async () => {
        try {
            const response = await fetch(`/group-chats/${sessionId}/join`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to join session');
            }
        } catch (err) {
            setError('Failed to join session. Please try again.');
            throw err;
        }
    }, [sessionId]);

    // Leave session
    const leaveSession = useCallback(async () => {
        try {
            const response = await fetch(`/group-chats/${sessionId}/leave`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to leave session');
            }
        } catch (err) {
            setError('Failed to leave session. Please try again.');
            throw err;
        }
    }, [sessionId]);

    return {
        messages,
        isConnected,
        sendMessage,
        joinSession,
        leaveSession,
        // WebRTC Audio properties
        isAudioJoined: webrtcAudio.isJoined,
        isAudioMuted: webrtcAudio.isMuted,
        isAudioConnecting: webrtcAudio.isConnecting,
        connectedParticipants: webrtcAudio.connectedParticipants,
        joinAudio: webrtcAudio.joinAudio,
        leaveAudio: webrtcAudio.leaveAudio,
        toggleAudioMute: webrtcAudio.toggleMute,
        audioError: webrtcAudio.error,
        // Participant audio states
        participantAudioStates,
        error
    };
}