import { useState, useCallback } from 'react';

interface ParticipantAudioState {
    participantId: number;
    isMuted: boolean;
    isConnected: boolean;
}

export function useParticipantAudioStates() {
    const [participantStates, setParticipantStates] = useState<Map<number, ParticipantAudioState>>(new Map());

    const updateParticipantState = useCallback((participantId: number, updates: Partial<ParticipantAudioState>) => {
        setParticipantStates(prev => {
            const newMap = new Map(prev);
            const currentState = newMap.get(participantId) || {
                participantId,
                isMuted: false,
                isConnected: false
            };
            newMap.set(participantId, { ...currentState, ...updates });
            return newMap;
        });
    }, []);

    const setParticipantMuted = useCallback((participantId: number, muted: boolean) => {
        updateParticipantState(participantId, { isMuted: muted });
    }, [updateParticipantState]);

    const setParticipantConnected = useCallback((participantId: number, connected: boolean) => {
        updateParticipantState(participantId, { isConnected: connected });
    }, [updateParticipantState]);

    const removeParticipant = useCallback((participantId: number) => {
        setParticipantStates(prev => {
            const newMap = new Map(prev);
            newMap.delete(participantId);
            return newMap;
        });
    }, []);

    const getParticipantState = useCallback((participantId: number): ParticipantAudioState | undefined => {
        return participantStates.get(participantId);
    }, [participantStates]);

    const getAllParticipantStates = useCallback((): ParticipantAudioState[] => {
        return Array.from(participantStates.values());
    }, [participantStates]);

    const getConnectedParticipants = useCallback((): number[] => {
        return Array.from(participantStates.values())
            .filter(state => state.isConnected)
            .map(state => state.participantId);
    }, [participantStates]);

    const getMutedParticipants = useCallback((): number[] => {
        return Array.from(participantStates.values())
            .filter(state => state.isMuted)
            .map(state => state.participantId);
    }, [participantStates]);

    return {
        participantStates,
        updateParticipantState,
        setParticipantMuted,
        setParticipantConnected,
        removeParticipant,
        getParticipantState,
        getAllParticipantStates,
        getConnectedParticipants,
        getMutedParticipants
    };
}