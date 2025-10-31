import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Download, FileText, Image, File } from 'lucide-react';
import { type GroupChatMessage } from '@/types';

interface GroupChatMessageListProps {
    messages: GroupChatMessage[];
    currentUserId: number;
    onMessageSent?: (message: GroupChatMessage) => void;
    autoScroll?: boolean;
}

export default function GroupChatMessageList({
    messages,
    currentUserId,
    onMessageSent,
    autoScroll = true
}: GroupChatMessageListProps) {
    const [playingAudio, setPlayingAudio] = useState<number | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (autoScroll && scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages, autoScroll]);

    useEffect(() => {
        if (onMessageSent) {
            // Listen for new messages if provided
            const handleNewMessage = (message: GroupChatMessage) => {
                onMessageSent(message);
            };

            // This would be connected to real-time updates
            // For now, we'll handle it through props
        }
    }, [onMessageSent]);

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const playAudio = (messageId: number, audioUrl: string) => {
        if (playingAudio === messageId) {
            setPlayingAudio(null);
            return;
        }

        setPlayingAudio(messageId);
        const audio = new Audio(audioUrl);
        audio.onended = () => setPlayingAudio(null);
        audio.play().catch(() => setPlayingAudio(null));
    };

    const downloadFile = (fileUrl: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getFileIcon = (fileType?: string) => {
        if (!fileType) return <File className="h-4 w-4" />;

        if (fileType.startsWith('image/')) return <Image className="h-4 w-4" />;
        if (fileType.startsWith('text/')) return <FileText className="h-4 w-4" />;
        return <File className="h-4 w-4" />;
    };

    const renderMessageContent = (message: GroupChatMessage) => {
        if (message.type === 'text') {
            return <p className="text-sm">{message.message}</p>;
        }

        if (message.type === 'audio') {
            return (
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => playAudio(message.id, message.message)}
                        className="h-8 px-2"
                    >
                        {playingAudio === message.id ? (
                            <Pause className="h-4 w-4" />
                        ) : (
                            <Play className="h-4 w-4" />
                        )}
                    </Button>
                    <span className="text-sm">Audio message</span>
                </div>
            );
        }

        // Handle file messages (if supported in the future)
        return (
            <div className="flex items-center gap-2">
                {getFileIcon(message.file_type)}
                <span className="text-sm">{message.file_name || 'File'}</span>
                {message.file_path && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => downloadFile(message.file_path!, message.file_name || 'file')}
                        className="h-6 px-2"
                    >
                        <Download className="h-3 w-3" />
                    </Button>
                )}
            </div>
        );
    };

    return (
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${
                                message.user_id === currentUserId ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            {message.user_id !== currentUserId && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                        {message.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            <div className={`max-w-[70%] ${message.user_id === currentUserId ? 'order-first' : ''}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium">{message.user.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatTime(message.created_at)}
                                    </span>
                                    {message.user_id === currentUserId && (
                                        <Badge variant="secondary" className="text-xs">You</Badge>
                                    )}
                                </div>
                                <div
                                    className={`rounded-lg p-3 ${
                                        message.user_id === currentUserId
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted'
                                    }`}
                                >
                                    {renderMessageContent(message)}
                                </div>
                            </div>
                            {message.user_id === currentUserId && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                        {message.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))
                )}
            </div>
        </ScrollArea>
    );
}