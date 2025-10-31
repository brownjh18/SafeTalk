import React, { useState, useEffect, useRef } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type GroupChatMessage } from '@/types';
import { Send, Mic, MicOff, Play, Pause, ArrowLeft, Users, Phone, PhoneOff, Volume2, VolumeX, Settings, MoreVertical, Smile } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import GroupChatMessageList from '@/components/group-chat-message-list';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher globally available
(window as any).Pusher = Pusher;
import WebRTCAudioService from '@/services/webrtcAudioService';

interface Session {
    id: number;
    title: string;
    description: string;
    mode: string;
    max_participants: number;
    is_active: boolean;
    creator: {
        id: number;
        name: string;
    };
    participants: Array<{
        id: number;
        name: string;
        email: string;
        role: string;
        joined_at: string;
    }>;
    participant_count: number;
    is_creator: boolean;
    is_participant: boolean;
    created_at: string;
}

interface GroupChatsChatProps {
    session: Session;
    messages: GroupChatMessage[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Group Chats',
        href: '/group-chats',
    },
];

export default function GroupChatsChat({ session, messages: initialMessages }: GroupChatsChatProps) {
    const { auth } = usePage().props as any;
    const [messages, setMessages] = useState<GroupChatMessage[]>(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [playingAudio, setPlayingAudio] = useState<number | null>(null);
    const [isInAudioCall, setIsInAudioCall] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [connectedParticipants, setConnectedParticipants] = useState<number[]>([]);
    const [participantMutedStates, setParticipantMutedStates] = useState<Record<number, boolean>>({});
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const echoRef = useRef<any>(null);
    const webrtcServiceRef = useRef<WebRTCAudioService | null>(null);

    useEffect(() => {
        // Initialize Laravel Echo
        if (!echoRef.current) {
            try {
                // For local development without WebSocket server, disable real-time features
                console.warn('WebSocket server not running. Real-time features will be disabled.');
                echoRef.current = null;
            } catch (error) {
                console.warn('Failed to initialize Echo, real-time features will be disabled:', error);
                echoRef.current = null;
            }
        }

        // Initialize WebRTC service for audio sessions
        if (session.mode === 'audio' && !webrtcServiceRef.current) {
            webrtcServiceRef.current = new WebRTCAudioService();
            webrtcServiceRef.current.initialize(session.id, auth.user.id, echoRef.current);
            webrtcServiceRef.current.setParticipantCallbacks({
                onParticipantJoined: (participantId: number) => {
                    setConnectedParticipants(prev => [...prev, participantId]);
                },
                onParticipantLeft: (participantId: number) => {
                    setConnectedParticipants(prev => prev.filter(id => id !== participantId));
                    setParticipantMutedStates(prev => {
                        const newState = { ...prev };
                        delete newState[participantId];
                        return newState;
                    });
                },
                onParticipantMuted: (participantId: number, muted: boolean) => {
                    setParticipantMutedStates(prev => ({
                        ...prev,
                        [participantId]: muted
                    }));
                }
            });
        }

        // Listen for new messages
        let channel = null;
        if (echoRef.current) {
            channel = echoRef.current.private(`group-chat.${session.id}`)
                .listen('.message.sent', (e: { message: GroupChatMessage }) => {
                    setMessages(prev => [...prev, e.message]);
                })
                .listen('.webrtc.signaling', (e: { message: any }) => {
                    // WebRTC signaling is handled by the service
                });
        }

        return () => {
            if (echoRef.current) {
                echoRef.current.leave(`group-chat.${session.id}`);
            }
            if (webrtcServiceRef.current) {
                webrtcServiceRef.current.destroy();
            }
        };
    }, [session.id, session.mode, auth.user.id]);

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (type: 'text' | 'audio' = 'text') => {
        if (type === 'text' && !newMessage.trim()) return;
        if (type === 'audio' && !audioBlob) return;

        const formData = new FormData();
        formData.append('type', type);

        if (type === 'text') {
            formData.append('message', newMessage.trim());
        } else if (type === 'audio' && audioBlob) {
            formData.append('message', audioBlob, 'audio.webm');
        }

        try {
            const response = await fetch(`/group-chats/${session.id}/messages`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                setNewMessage('');
                setAudioBlob(null);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Failed to start recording:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const playAudio = (messageId: number, audioUrl: string) => {
        if (playingAudio === messageId) {
            setPlayingAudio(null);
            return;
        }

        setPlayingAudio(messageId);
        const audio = new Audio(audioUrl);
        audio.onended = () => setPlayingAudio(null);
        audio.play();
    };

    const joinAudioCall = async () => {
        if (!webrtcServiceRef.current) return;

        try {
            await webrtcServiceRef.current.joinAudioSession();
            setIsInAudioCall(true);
            setIsAudioMuted(false);
        } catch (error) {
            console.error('Failed to join audio call:', error);
        }
    };

    const leaveAudioCall = async () => {
        if (!webrtcServiceRef.current) return;

        try {
            await webrtcServiceRef.current.leaveAudioSession();
            setIsInAudioCall(false);
            setIsAudioMuted(false);
            setConnectedParticipants([]);
            setParticipantMutedStates({});
        } catch (error) {
            console.error('Failed to leave audio call:', error);
        }
    };

    const toggleAudioMute = () => {
        if (!webrtcServiceRef.current) return;

        const muted = webrtcServiceRef.current.toggleMute();
        setIsAudioMuted(muted);
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: session.title, href: `/group-chats/${session.id}` }]}>
            <Head title={`${session.title} - Chat`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <a href={`/group-chats/${session.id}`}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Session
                            </a>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">{session.title}</h1>
                            <p className="text-muted-foreground">
                                {session.participant_count} participants • {session.mode === 'audio' ? 'Audio' : 'Text'} mode
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={session.is_active ? "default" : "secondary"}>
                            {session.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {session.participant_count}/{session.max_participants}
                        </Badge>
                        {session.mode === 'audio' && (
                            <Badge variant={isInAudioCall ? "default" : "outline"} className="flex items-center gap-1">
                                {isInAudioCall ? <Phone className="h-3 w-3" /> : <PhoneOff className="h-3 w-3" />}
                                {isInAudioCall ? 'In Call' : 'Audio Available'}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <Card className="flex-1 flex flex-col">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                {session.title}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Badge variant={session.is_active ? "default" : "secondary"}>
                                    {session.is_active ? 'Live' : 'Ended'}
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {session.participant_count}/{session.max_participants}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col p-0">
                        {/* Messages Area */}
                        <ScrollArea className="flex-1 px-4">
                            <GroupChatMessageList
                                messages={messages}
                                currentUserId={auth.user.id}
                                autoScroll={true}
                            />
                        </ScrollArea>

                        <Separator />

                        {/* Audio Controls for Audio Mode */}
                        {session.mode === 'audio' && (
                            <div className="p-4 bg-muted/30 border-b">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <Phone className={`h-4 w-4 ${isInAudioCall ? 'text-green-600' : 'text-muted-foreground'}`} />
                                            <span className="text-sm font-medium">
                                                {isInAudioCall ? 'Connected to Audio Call' : 'Audio Call Available'}
                                            </span>
                                        </div>
                                        {connectedParticipants.length > 0 && (
                                            <Badge variant="secondary" className="text-xs">
                                                {connectedParticipants.length + 1} in call
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isInAudioCall && (
                                            <Button
                                                onClick={toggleAudioMute}
                                                variant={isAudioMuted ? "destructive" : "outline"}
                                                size="sm"
                                                className="h-8"
                                            >
                                                {isAudioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                            </Button>
                                        )}
                                        <Button
                                            onClick={isInAudioCall ? leaveAudioCall : joinAudioCall}
                                            variant={isInAudioCall ? "destructive" : "default"}
                                            size="sm"
                                            className="h-8"
                                        >
                                            {isInAudioCall ? <PhoneOff className="h-4 w-4 mr-1" /> : <Phone className="h-4 w-4 mr-1" />}
                                            {isInAudioCall ? 'Leave' : 'Join'}
                                        </Button>
                                    </div>
                                </div>

                                {/* Connected Participants Status */}
                                {isInAudioCall && connectedParticipants.length > 0 && (
                                    <div className="flex items-center gap-2 mt-3">
                                        <span className="text-xs text-muted-foreground">Connected:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {connectedParticipants.map(participantId => {
                                                const participant = session.participants.find(p => p.id === participantId);
                                                if (!participant) return null;

                                                const isMuted = participantMutedStates[participantId] || false;
                                                return (
                                                    <div key={participantId} className="flex items-center gap-1 bg-background rounded-full px-2 py-1 text-xs">
                                                        <Avatar className="h-4 w-4">
                                                            <AvatarFallback className="text-xs">
                                                                {participant.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="max-w-16 truncate">{participant.name}</span>
                                                        {isMuted && <VolumeX className="h-3 w-3 text-muted-foreground" />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Message Input Area */}
                        <div className="p-4">
                            {audioBlob ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                        <div className="flex items-center gap-2 flex-1">
                                            <Mic className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">Audio message recorded</span>
                                            <Badge variant="secondary" className="text-xs">
                                                {(audioBlob.size / 1024).toFixed(1)} KB
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => playAudio(-1, URL.createObjectURL(audioBlob))}
                                                className="h-8"
                                            >
                                                {playingAudio === -1 ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setAudioBlob(null)}
                                                className="h-8"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => handleSendMessage('audio')}
                                                className="h-8"
                                            >
                                                <Send className="h-3 w-3 mr-1" />
                                                Send
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-end gap-2">
                                    <div className="flex-1 relative">
                                        <Input
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage('text');
                                                }
                                            }}
                                            className="pr-12 min-h-10 resize-none"
                                            disabled={isRecording}
                                        />
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="absolute right-1 top-1 h-8 w-8 p-0"
                                            disabled
                                        >
                                            <Smile className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Button
                                        onClick={isRecording ? stopRecording : startRecording}
                                        variant={isRecording ? "destructive" : "outline"}
                                        size="icon"
                                        className="h-10 w-10 shrink-0"
                                        title={isRecording ? "Stop recording" : "Record audio message"}
                                    >
                                        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                    </Button>
                                    <Button
                                        onClick={() => handleSendMessage('text')}
                                        disabled={!newMessage.trim() || isRecording}
                                        size="icon"
                                        className="h-10 w-10 shrink-0"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            {isRecording && (
                                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    Recording audio message... Click the microphone to stop.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
