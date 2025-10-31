import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Phone, PhoneOff, Loader2 } from 'lucide-react';

interface AudioControlsProps {
    isJoined: boolean;
    isMuted: boolean;
    isConnecting: boolean;
    onJoinAudio: () => void;
    onLeaveAudio: () => void;
    onToggleMute: () => void;
    disabled?: boolean;
}

export function AudioControls({
    isJoined,
    isMuted,
    isConnecting,
    onJoinAudio,
    onLeaveAudio,
    onToggleMute,
    disabled = false
}: AudioControlsProps) {
    return (
        <div className="flex items-center gap-2">
            {!isJoined ? (
                <Button
                    onClick={onJoinAudio}
                    disabled={disabled || isConnecting}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                >
                    {isConnecting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Phone className="h-4 w-4" />
                    )}
                    {isConnecting ? 'Connecting...' : 'Join Audio'}
                </Button>
            ) : (
                <>
                    <Button
                        onClick={onToggleMute}
                        disabled={disabled}
                        variant={isMuted ? "destructive" : "outline"}
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        {isMuted ? (
                            <MicOff className="h-4 w-4" />
                        ) : (
                            <Mic className="h-4 w-4" />
                        )}
                        {isMuted ? 'Unmute' : 'Mute'}
                    </Button>

                    <Button
                        onClick={onLeaveAudio}
                        disabled={disabled}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <PhoneOff className="h-4 w-4" />
                        Leave Audio
                    </Button>
                </>
            )}
        </div>
    );
}