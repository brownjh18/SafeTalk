import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    MessageCircle,
    Phone,
    Send,
    Mic,
    MicOff,
    Video,
    VideoOff,
    PhoneOff,
    Heart,
    Clock,
    User,
    ArrowLeft
} from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Chat {
    id: number;
    message: string;
    sent_at: string;
    is_from_counselor: boolean;
    sender_name: string;
}

interface Session {
    id: number;
    client: {
        id: number;
        name: string;
        email: string;
    };
    counselor: {
        id: number;
        name: string;
        email: string;
    };
    scheduled_at: string;
    status: string;
    notes: string;
    session_type: 'message' | 'audio';
    created_at: string;
}

interface Props {
    session: Session;
    chats: Chat[];
    currentUser: {
        id: number;
        name: string;
        email: string;
    };
}

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/client/dashboard',
    },
    {
        title: 'Book Session',
        href: '/client/book-session',
    },
    {
        title: 'Active Session',
        href: '#',
    },
];

export default function ActiveSession({ session, chats: initialChats, currentUser }: Props) {
    const [chats, setChats] = useState<Chat[]>(initialChats);
    const [isAudioMode, setIsAudioMode] = useState(session.session_type === 'audio');
    const [isRecording, setIsRecording] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [isAudioOn, setIsAudioOn] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { data, setData, post, processing, reset } = useForm({
        message: '',
        session_id: session.id,
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chats]);

    const submitMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.message.trim()) return;

        post('/client/messages/' + session.id, {
            onSuccess: (response: any) => {
                // Add the new message to the chat list
                if (response.props?.newMessage) {
                    setChats(prev => [...prev, response.props.newMessage]);
                }
                reset();
            },
        });
    };

    const toggleMode = () => {
        setIsAudioMode(!isAudioMode);
    };

    const startAudioCall = () => {
        setIsAudioOn(true);
        // TODO: Implement actual audio call functionality
        console.log('Starting audio call...');
    };

    const endAudioCall = () => {
        setIsAudioOn(false);
        setIsVideoOn(false);
        // TODO: Implement call ending functionality
        console.log('Ending audio call...');
    };

    const toggleVideo = () => {
        setIsVideoOn(!isVideoOn);
        // TODO: Implement video toggle functionality
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        // TODO: Implement recording functionality
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Active Session - ${session.counselor.name}`} />

            <div className="flex h-full flex-col bg-background">
                {/* Header */}
                <div className="flex items-center justify-between border-b bg-card p-4">
                    <div className="flex items-center space-x-4">
                        <Link href="/client/book-session" className="p-2 hover:bg-muted rounded-lg">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-semibold">Session with {session.counselor.name}</h1>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{new Date(session.scheduled_at).toLocaleString()}</span>
                                <Badge variant="secondary" className={
                                    session.session_type === 'audio'
                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                }>
                                    {session.session_type === 'audio' ? 'Audio Call' : 'Message Chat'}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex items-center space-x-2">
                        <Button
                            variant={isAudioMode ? "default" : "outline"}
                            size="sm"
                            onClick={toggleMode}
                            className="flex items-center space-x-2"
                        >
                            {isAudioMode ? <Phone className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
                            <span>{isAudioMode ? 'Audio Mode' : 'Chat Mode'}</span>
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden">
                    {isAudioMode ? (
                        /* Audio/Video Call Interface */
                        <div className="flex-1 flex flex-col items-center justify-center bg-muted/30">
                            <div className="text-center space-y-6">
                                {/* Participant Info */}
                                <div className="space-y-4">
                                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                                        <User className="h-12 w-12 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-semibold">{session.counselor.name}</h2>
                                        <p className="text-muted-foreground">Counselor</p>
                                    </div>
                                </div>

                                {/* Call Status */}
                                {isAudioOn ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-green-600 font-medium">Call in progress</span>
                                        </div>

                                        {/* Call Controls */}
                                        <div className="flex items-center justify-center space-x-4">
                                            <Button
                                                variant={isAudioOn ? "default" : "outline"}
                                                size="lg"
                                                onClick={isAudioOn ? () => setIsAudioOn(false) : startAudioCall}
                                                className="rounded-full w-16 h-16"
                                            >
                                                {isAudioOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                                            </Button>

                                            <Button
                                                variant={isVideoOn ? "default" : "outline"}
                                                size="lg"
                                                onClick={toggleVideo}
                                                className="rounded-full w-16 h-16"
                                            >
                                                {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                                            </Button>

                                            <Button
                                                variant={isRecording ? "destructive" : "outline"}
                                                size="lg"
                                                onClick={toggleRecording}
                                                className="rounded-full w-16 h-16"
                                            >
                                                <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                            </Button>

                                            <Button
                                                variant="destructive"
                                                size="lg"
                                                onClick={endAudioCall}
                                                className="rounded-full w-16 h-16"
                                            >
                                                <PhoneOff className="h-6 w-6" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Call Not Started */
                                    <div className="space-y-4">
                                        <p className="text-muted-foreground">Ready to start your audio session</p>
                                        <Button
                                            onClick={startAudioCall}
                                            size="lg"
                                            className="flex items-center space-x-2"
                                        >
                                            <Phone className="h-5 w-5" />
                                            <span>Start Audio Call</span>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Message Chat Interface */
                        <div className="flex-1 flex flex-col">
                            {/* Chat Messages */}
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    {chats.length === 0 ? (
                                        <div className="text-center py-8">
                                            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                                        </div>
                                    ) : (
                                        chats.map((chat) => (
                                            <div
                                                key={chat.id}
                                                className={`flex ${chat.is_from_counselor ? 'justify-start' : 'justify-end'}`}
                                            >
                                                <div
                                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                        chat.is_from_counselor
                                                            ? 'bg-muted text-muted-foreground'
                                                            : 'bg-blue-600 text-white'
                                                    }`}
                                                >
                                                    <p className="text-sm">{chat.message}</p>
                                                    <p className={`text-xs mt-1 ${
                                                        chat.is_from_counselor ? 'text-muted-foreground' : 'text-blue-200'
                                                    }`}>
                                                        {new Date(chat.sent_at).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>

                            {/* Message Input */}
                            <div className="border-t bg-card p-4">
                                <form onSubmit={submitMessage} className="flex space-x-2">
                                    <Input
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1"
                                        disabled={processing}
                                    />
                                    <Button type="submit" disabled={processing || !data.message.trim()}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}