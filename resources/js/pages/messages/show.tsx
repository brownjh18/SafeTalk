import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Message as MessageType, type User as UserType } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import {
    MessageCircle,
    Send,
    Clock,
    User,
    Mail,
    Eye,
    Search,
    MoreVertical,
    Phone,
    Video,
    Plus,
    ArrowLeft,
    MessageSquare,
    Paperclip,
    Smile,
    X,
    Users as UsersIcon,
    Shield
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Messages',
        href: '/messages',
    },
];

interface MessagesShowProps {
    messages: MessageType[];
    otherUser: UserType;
}

export default function Show({ messages = [], otherUser }: MessagesShowProps) {
    const { auth } = usePage().props as any;
    const echoRef = useRef<any>(null);
    const [messagesState, setMessages] = useState<MessageType[]>(messages);
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);

    const handleSendMessage = () => {
        if ((newMessage.trim() || selectedFile) && otherUser) {
            const formData = new FormData();

            if (newMessage.trim()) {
                formData.append('message', newMessage.trim());
            }

            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            router.post(`/messages/${otherUser.id}`, formData, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setNewMessage('');
                    setSelectedFile(null);
                    setFilePreview(null);
                },
            });
        }
    };

    const handleFileAttach = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,audio/*,video/*,application/pdf,text/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                setSelectedFile(file);

                // Create preview for images
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setFilePreview(e.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                } else {
                    // For non-image files, show file icon
                    setFilePreview(null);
                }
            }
        };
        input.click();
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
    };

    const handleEmojiSelect = (emoji: string) => {
        setNewMessage(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    useEffect(() => {
        // Subscribe to private user channel to receive incoming private messages in real-time
        const echo = (window as any).Echo || null;
        echoRef.current = echo;

        let listener: any = null;
        if (echo) {
            try {
                echo.private(`private-user.${auth.user.id}`)
                    .listen('.message.sent', (e: any) => {
                        const incoming = e.message;

                        // Only append messages that belong to this conversation (sender/receiver pair)
                        const isRelevant = (incoming.sender_id === otherUser.id && incoming.receiver_id === auth.user.id) ||
                                           (incoming.sender_id === auth.user.id && incoming.receiver_id === otherUser.id);

                        if (!isRelevant) return;

                        const formatted = {
                            id: incoming.id,
                            message: incoming.message,
                            file_path: incoming.file_path,
                            file_name: incoming.file_name,
                            file_size: incoming.file_size,
                            file_type: incoming.file_type,
                            sent_at: incoming.sent_at,
                            is_from_user: incoming.sender_id === auth.user.id,
                            sender_name: incoming.sender?.name || ''
                        };

                        setMessages((prev) => [...prev, formatted]);
                    });
            } catch (err) {
                console.warn('Failed to subscribe to private message channel', err);
            }
        }

        return () => {
            if (echoRef.current) {
                try {
                    echoRef.current.leave(`private-user.${auth.user.id}`);
                } catch (err) {
                    // ignore
                }
            }
        };
    }, [auth.user.id, otherUser.id]);

    const emojis = ['😊', '😂', '❤️', '👍', '🙏', '👋', '😢', '😮', '🎉', '🤔', '😴', '💪', '🙌', '👏', '🤝', '😍', '🥰', '😘', '😉', '😎', '🤗', '🤩', '🥳', '😇', '🙃', '😜', '😝', '🤪', '🥺', '😭', '😤', '😡', '🤬', '🤯', '🥴', '😵', '🤐', '🤫', '🤭', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Chat with ${otherUser.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/messages"
                            className="p-2 hover:bg-muted rounded-full transition-colors"
                            title="Back to messages"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Chat with {otherUser.name}</h1>
                            <p className="text-muted-foreground">{otherUser.email}</p>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex h-[calc(100vh-18rem)] bg-card rounded-xl border overflow-hidden">
                    <div className="flex-1 flex flex-col min-w-0">
                        <>
                            {/* Chat Header */}
                            <div className="p-4 bg-background border-b border-border flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                        <User className="h-5 w-5 text-primary-foreground" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-foreground">
                                            {otherUser.name}
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            {otherUser.email}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                otherUser.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                                otherUser.role === 'counselor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                            }`}>
                                                {otherUser.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="p-2 hover:bg-muted rounded-full transition-colors" title="Call">
                                        <Phone className="h-5 w-5 text-muted-foreground" />
                                    </button>
                                    <button className="p-2 hover:bg-muted rounded-full transition-colors" title="Video Call">
                                        <Video className="h-5 w-5 text-muted-foreground" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 bg-muted/30 p-4 overflow-y-auto">
                                <div className="max-w-4xl mx-auto space-y-4">
                                    {messagesState && messagesState.length > 0 ? (
                                        messagesState.map((message) => (
                                            <div key={message.id} className={`flex ${message.is_from_user ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                    message.is_from_user
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-muted'
                                                }`}>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <User className="h-3 w-3" />
                                                        <span className="text-xs font-medium">{message.sender_name}</span>
                                                        <span className="text-xs opacity-70 flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {new Date(message.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    {message.file_path && (
                                                        <div className="mb-2">
                                                            {message.file_type?.startsWith('image/') ? (
                                                                <div className="relative max-w-xs">
                                                                    <img
                                                                        src={`/storage/${message.file_path}`}
                                                                        alt={message.file_name}
                                                                        className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                                                                        onClick={() => window.location.href = `/storage/${message.file_path}`}
                                                                    />
                                                                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                                                                        <div className="bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                                                                            👁️ View full size
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : message.file_type?.startsWith('video/') ? (
                                                                <div className="relative max-w-xs">
                                                                    <video
                                                                        src={`/storage/${message.file_path}`}
                                                                        controls
                                                                        className="w-full h-auto rounded-lg shadow-sm"
                                                                        preload="metadata"
                                                                    >
                                                                        Your browser does not support the video tag.
                                                                    </video>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    className="flex items-center space-x-3 p-3 bg-background/60 rounded-lg cursor-pointer hover:bg-background/80 transition-colors border border-border/30"
                                                                    onClick={() => window.location.href = `/storage/${message.file_path}`}
                                                                >
                                                                    <div className="flex-shrink-0">
                                                                        <Paperclip className="h-5 w-5 text-primary" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-medium truncate">{message.file_name}</p>
                                                                        <p className="text-xs opacity-70">
                                                                            {(message.file_size! / 1024 / 1024).toFixed(2)} MB • 📥 Download
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    {message.message && (
                                                        <p className="text-sm">{message.message}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-muted-foreground py-8">
                                            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>No messages yet. Start the conversation!</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* File Preview */}
                            {selectedFile && (
                                <div className="p-4 bg-background border-t border-border">
                                    <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                                        {filePreview ? (
                                            <img
                                                src={filePreview}
                                                alt="File preview"
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-muted-foreground/20 rounded flex items-center justify-center">
                                                <Paperclip className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleRemoveFile}
                                            className="p-1 hover:bg-muted-foreground/20 rounded-full transition-colors"
                                            title="Remove file"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Message Input */}
                            <div className="p-4 bg-background border-t border-border">
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={handleFileAttach}
                                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                                        title="Attach file"
                                    >
                                        <Paperclip className="h-5 w-5" />
                                    </button>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type a message..."
                                        className="flex-1 px-4 py-2 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                                            title="Add emoji"
                                        >
                                            <Smile className="h-5 w-5" />
                                        </button>
                                        {showEmojiPicker && (
                                            <div className="absolute bottom-full right-0 mb-2 p-4 bg-background border border-border rounded-xl shadow-xl z-10 w-80 max-w-sm">
                                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                                    {emojis.map((emoji) => (
                                                        <button
                                                            key={emoji}
                                                            onClick={() => handleEmojiSelect(emoji)}
                                                            className="w-12 h-12 hover:bg-muted rounded-xl flex items-center justify-center text-2xl transition-colors flex-shrink-0"
                                                            title={`Add ${emoji}`}
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim() && !selectedFile}
                                        className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Send Message"
                                    >
                                        <Send className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}