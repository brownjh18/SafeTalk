import { useState, useEffect, useRef, useCallback } from 'react';
import WebRTCAudioService from '@/services/webrtcAudioService';
import { requestAudioPermissions, checkWebRTCAudioSupport } from '@/utils/audioCompatibility';

interface UseWebRTCAudioOptions {
    sessionId: number;
    currentUserId: number;
    echo: any;
    onParticipantJoined?: (participantId: number) => void;
    onParticipantLeft?: (participantId: number) => void;
    onParticipantMuted?: (participantId: number, muted: boolean) => void;
}

interface UseWebRTCAudioReturn {
    isJoined: boolean;
    isMuted: boolean;
    isConnecting: boolean;
    connectedParticipants: number[];
    joinAudio: () => Promise<void>;
    leaveAudio: () => Promise<void>;
    toggleMute: () => boolean;
    error: string | null;
}

export function useWebRTCAudio({
    sessionId,
    currentUserId,
    echo,
    onParticipantJoined,
    onParticipantLeft,
    onParticipantMuted
}: UseWebRTCAudioOptions): UseWebRTCAudioReturn {
    const [isJoined, setIsJoined] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectedParticipants, setConnectedParticipants] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const webrtcServiceRef = useRef<WebRTCAudioService | null>(null);

    // Initialize WebRTC service
    useEffect(() => {
        if (echo && sessionId && currentUserId) {
            webrtcServiceRef.current = new WebRTCAudioService();
            webrtcServiceRef.current.initialize(sessionId, currentUserId, echo);

            webrtcServiceRef.current.setParticipantCallbacks({
                onParticipantJoined: (participantId) => {
                    setConnectedParticipants(prev => [...prev, participantId]);
                    onParticipantJoined?.(participantId);
                },
                onParticipantLeft: (participantId) => {
                    setConnectedParticipants(prev => prev.filter(id => id !== participantId));
                    onParticipantLeft?.(participantId);
                },
                onParticipantMuted: (participantId, muted) => {
                    onParticipantMuted?.(participantId, muted);
                }
            });
        }

        return () => {
            if (webrtcServiceRef.current) {
                webrtcServiceRef.current.destroy();
                webrtcServiceRef.current = null;
            }
        };
    }, [sessionId, currentUserId, echo, onParticipantJoined, onParticipantLeft, onParticipantMuted]);

    // Update connected participants periodically
    useEffect(() => {
        if (isJoined && webrtcServiceRef.current) {
            const interval = setInterval(() => {
                const participants = webrtcServiceRef.current!.getConnectedParticipants();
                setConnectedParticipants(participants);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isJoined]);

    const joinAudio = useCallback(async () => {
        if (!webrtcServiceRef.current) {
            setError('WebRTC service not initialized');
            return;
        }

        try {
            setIsConnecting(true);
            setError(null);

            // Check browser compatibility
            const compatibility = checkWebRTCAudioSupport();
            if (!compatibility.isSupported) {
                throw new Error(compatibility.errors.join(', '));
            }

            // Request audio permissions
            const permissions = await requestAudioPermissions();
            if (!permissions.hasPermissions) {
                throw new Error(permissions.errors.join(', '));
            }

            if (!permissions.hasMicrophone) {
                throw new Error('No microphone available');
            }

            await webrtcServiceRef.current.joinAudioSession();
            setIsJoined(true);
            setIsMuted(webrtcServiceRef.current.isAudioMuted());
        } catch (err) {
            console.error('Failed to join audio session:', err);
            setError(err instanceof Error ? err.message : 'Failed to join audio session');
            throw err;
        } finally {
            setIsConnecting(false);
        }
    }, []);

    const leaveAudio = useCallback(async () => {
        if (!webrtcServiceRef.current) return;

        try {
            await webrtcServiceRef.current.leaveAudioSession();
            setIsJoined(false);
            setIsMuted(false);
            setConnectedParticipants([]);
            setError(null);
        } catch (err) {
            console.error('Failed to leave audio session:', err);
            setError('Failed to leave audio session');
            throw err;
        }
    }, []);

    const toggleMute = useCallback(() => {
        if (!webrtcServiceRef.current) return false;

        const muted = webrtcServiceRef.current.toggleMute();
        setIsMuted(muted);
        return muted;
    }, []);

    return {
        isJoined,
        isMuted,
        isConnecting,
        connectedParticipants,
        joinAudio,
        leaveAudio,
        toggleMute,
        error
    };
}