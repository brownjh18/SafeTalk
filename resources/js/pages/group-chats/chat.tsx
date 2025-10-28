import React, { useState, useEffect, useRef } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type GroupChatMessage } from '@/types';
import { Send, Mic, MicOff, Play, Pause, ArrowLeft, Users, Phone, PhoneOff, Volume2, VolumeX } from 'lucide-react';
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
                    <CardHeader>
                        <CardTitle>Chat</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col p-0">
                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex gap-3 ${message.user_id === auth.user.id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {message.user_id !== auth.user.id && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>
                                                    {message.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={`max-w-[70%] ${message.user_id === auth.user.id ? 'order-first' : ''}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-medium">{message.user.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatTime(message.created_at)}
                                                </span>
                                            </div>
                                            <div
                                                className={`rounded-lg p-3 ${
                                                    message.user_id === auth.user.id
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted'
                                                }`}
                                            >
                                                {message.type === 'text' ? (
                                                    <p className="text-sm">{message.message}</p>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => playAudio(message.id, message.message)}
                                                        >
                                                            {playingAudio === message.id ? (
                                                                <Pause className="h-4 w-4" />
                                                            ) : (
                                                                <Play className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                        <span className="text-sm">Audio message</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {message.user_id === auth.user.id && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>
                                                    {auth.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Audio Controls for Audio Mode */}
                        {session.mode === 'audio' && (
                            <div className="border-t p-4 bg-muted/50">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">Audio Call</span>
                                        {connectedParticipants.length > 0 && (
                                            <Badge variant="secondary" className="text-xs">
                                                {connectedParticipants.length} connected
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isInAudioCall && (
                                            <Button
                                                onClick={toggleAudioMute}
                                                variant={isAudioMuted ? "destructive" : "outline"}
                                                size="sm"
                                            >
                                                {isAudioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                                {isAudioMuted ? 'Unmute' : 'Mute'}
                                            </Button>
                                        )}
                                        <Button
                                            onClick={isInAudioCall ? leaveAudioCall : joinAudioCall}
                                            variant={isInAudioCall ? "destructive" : "default"}
                                            size="sm"
                                        >
                                            {isInAudioCall ? <PhoneOff className="h-4 w-4 mr-2" /> : <Phone className="h-4 w-4 mr-2" />}
                                            {isInAudioCall ? 'Leave Call' : 'Join Call'}
                                        </Button>
                                    </div>
                                </div>

                                {/* Connected Participants Status */}
                                {isInAudioCall && connectedParticipants.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {connectedParticipants.map(participantId => {
                                            const participant = session.participants.find(p => p.id === participantId);
                                            if (!participant) return null;

                                            const isMuted = participantMutedStates[participantId] || false;
                                            return (
                                                <div key={participantId} className="flex items-center gap-1 text-xs">
                                                    <Avatar className="h-5 w-5">
                                                        <AvatarFallback className="text-xs">
                                                            {participant.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span>{participant.name}</span>
                                                    {isMuted && <VolumeX className="h-3 w-3 text-muted-foreground" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Message Input */}
                        <div className="border-t p-4">
                            {audioBlob ? (
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-sm text-muted-foreground">Audio recorded</span>
                                    <Button size="sm" onClick={() => playAudio(-1, URL.createObjectURL(audioBlob))}>
                                        {playingAudio === -1 ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setAudioBlob(null)}>
                                        Cancel
                                    </Button>
                                    <Button size="sm" onClick={() => handleSendMessage('audio')}>
                                        <Send className="h-4 w-4 mr-2" />
                                        Send Audio
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage('text')}
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={isRecording ? stopRecording : startRecording}
                                        variant={isRecording ? "destructive" : "outline"}
                                        size="icon"
                                    >
                                        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                    </Button>
                                    <Button onClick={() => handleSendMessage('text')} disabled={!newMessage.trim()}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}