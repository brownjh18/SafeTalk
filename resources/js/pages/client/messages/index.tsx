import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
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
    Shield,
    Heart
} from 'lucide-react';
import { router } from '@inertiajs/react';
import UserSearchModal from '@/components/user-search-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/client/dashboard',
    },
    {
        title: 'My Messages',
        href: '/client/messages',
    },
];

interface SessionWithChat {
    id: number;
    counselor_name: string;
    counselor_email: string;
    last_message: string;
    last_message_time: string | null;
    unread_count: number;
}

interface Message {
    id: number;
    message: string;
    file_path?: string;
    file_name?: string;
    file_size?: number;
    file_type?: string;
    sent_at: string;
    is_from_client: boolean;
    sender_name: string;
}

interface ClientMessagesProps {
    sessionsWithChats: SessionWithChat[];
    users: Array<{
        id: number;
        name: string;
        email: string;
        role: string;
        verified: boolean;
    }>;
    messages?: Message[];
}

export default function ClientMessages({ sessionsWithChats = [], users = [], messages = [] }: ClientMessagesProps) {
    const { auth } = usePage().props as any;
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<SessionWithChat | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    // Removed isSearchFocused state as it's no longer needed

    const filteredSessions = sessionsWithChats.filter((session) => {
        const matchesSearch = searchTerm === '' ||
            session.counselor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.counselor_email.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    const filteredUsers = users.filter((user) => {
        if (searchTerm === '') return false;
        return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
    });
    const handleSessionSelect = (session: SessionWithChat) => {
        setSelectedSession(session);
        setMobileView('chat');
    };

    const handleBackToList = () => {
        setMobileView('list');
        setSelectedSession(null);
    };

    const handleSendMessage = () => {
        if ((newMessage.trim() || selectedFile) && selectedSession) {
            const formData = new FormData();

            if (newMessage.trim()) {
                formData.append('message', newMessage.trim());
            }

            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            router.post(`/client/messages/${selectedSession.id}`, formData, {
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

    const emojis = ['😊', '😂', '❤️', '👍', '🙏', '👋', '😢', '😮', '🎉', '🤔', '😴', '💪', '🙌', '👏', '🤝'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Messages" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">My Messages</h1>
                        <p className="text-muted-foreground">Communicate with your counselor</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-text"
                            />
                        </div>
                        <button
                            onClick={() => setIsSearchModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Find Users
                        </button>
                    </div>

                    {/* Search Overlay */}
                    {searchTerm && (
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={(e) => {
                                if (e.target === e.currentTarget) {
                                    setSearchTerm('');
                                }
                            }}
                        >
                            <div className="bg-card border rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-96 overflow-hidden">
                                <div className="p-4 border-b border-border">
                                    <div className="flex items-center gap-3">
                                        <Search className="h-5 w-5 text-muted-foreground" />
                                        <input
                                            type="text"
                                            placeholder="Search for users..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
                                            autoFocus
                                        />
                                        {searchTerm && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSearchTerm('');
                                                }}
                                                className="p-1 hover:bg-muted rounded-full transition-colors"
                                                title="Clear search"
                                            >
                                                <X className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => {
                                            // Check if user already has a conversation
                                            const hasConversation = sessionsWithChats.some(session =>
                                                session.counselor_name === user.name || session.counselor_email === user.email
                                            );

                                            return (
                                                <div
                                                    key={user.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (hasConversation) {
                                                            // If conversation exists, just select it
                                                            const existingSession = sessionsWithChats.find(session =>
                                                                session.counselor_name === user.name || session.counselor_email === user.email
                                                            );
                                                            if (existingSession) {
                                                                setSelectedSession(existingSession);
                                                                setMobileView('chat');
                                                                setSearchTerm('');
                                                            }
                                                        } else {
                                                            // Start new conversation
                                                            router.post('/conversations/start', {
                                                                other_user_id: user.id,
                                                            }, {
                                                                onSuccess: (response: any) => {
                                                                    setSearchTerm('');
                                                                    // Reload the page to show the new conversation
                                                                    window.location.reload();
                                                                },
                                                            });
                                                        }
                                                    }}
                                                    className="flex items-center gap-3 p-4 hover:bg-muted cursor-pointer border-b border-border/50 last:border-b-0"
                                                >
                                                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                                        <User className="h-5 w-5 text-primary-foreground" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-medium text-foreground truncate">{user.name}</h4>
                                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                                user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                                                user.role === 'counselor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                            }`}>
                                                                {user.role}
                                                            </span>
                                                            {hasConversation && (
                                                                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                                    Active
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                                                    </div>
                                                    <MessageCircle className={`h-4 w-4 ${hasConversation ? 'text-green-600' : 'text-muted-foreground'}`} />
                                                </div>
                                            );
                                        })
                                    ) : searchTerm ? (
                                        <div className="p-8 text-center">
                                            <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                            <p className="text-sm text-muted-foreground">No users found</p>
                                            <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center">
                                            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                            <p className="text-sm text-muted-foreground">Start typing to search for users</p>
                                            <p className="text-xs text-muted-foreground mt-1">You can message anyone in the system</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>


                {/* WhatsApp-style Messages Interface */}
                <div className="flex h-[calc(100vh-18rem)] md:h-[calc(100vh-16rem)] bg-card rounded-xl border overflow-hidden md:flex">
                    {/* Mobile: Show conversations list as first page */}
                    <div className={`md:hidden w-full ${mobileView === 'list' ? 'block' : 'hidden'}`}>
                        <div className="bg-background min-h-[calc(100vh-20rem)]">
                            <div className="p-4">
                                <h2 className="text-lg font-semibold mb-4">Recent Conversations</h2>
                                <div className="space-y-2">
                                    {filteredSessions.length > 0 ? (
                                        filteredSessions.map((session) => (
                                            <div
                                                key={session.id}
                                                onClick={() => handleSessionSelect(session)}
                                                className="p-4 bg-card rounded-lg cursor-pointer hover:bg-muted transition-colors border border-border"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                                                            <User className="h-6 w-6 text-primary-foreground" />
                                                        </div>
                                                        {session.unread_count > 0 && (
                                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                                                <span className="text-xs text-primary-foreground font-medium">{session.unread_count}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="font-semibold text-foreground truncate">
                                                                {session.counselor_name}
                                                            </h3>
                                                            <span className="text-xs text-muted-foreground">
                                                                {session.last_message_time ? new Date(session.last_message_time).toLocaleDateString() : ''}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {session.last_message || 'No messages yet'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-foreground mb-2">
                                                {sessionsWithChats.length === 0 ? 'No conversations' : 'No matches found'}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-6">
                                                {sessionsWithChats.length === 0
                                                    ? 'Start a conversation with a counselor'
                                                    : 'Try adjusting your search'
                                                }
                                            </p>
                                            <button
                                                onClick={() => setIsSearchModalOpen(true)}
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                            >
                                                <Plus className="h-5 w-5" />
                                                Start New Conversation
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Sidebar */}
                    <div className="hidden md:flex w-1/3 bg-background border-r border-border flex flex-col min-w-0">

                        {/* Conversations List */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredSessions.length > 0 ? (
                                filteredSessions.map((session) => (
                                    <div
                                        key={session.id}
                                        onClick={() => handleSessionSelect(session)}
                                        className={`p-4 cursor-pointer hover:bg-muted transition-colors border-b border-border ${
                                            selectedSession?.id === session.id ? 'bg-muted' : ''
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                                                    <User className="h-6 w-6 text-primary-foreground" />
                                                </div>
                                                {session.unread_count > 0 && (
                                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                                        <span className="text-xs text-primary-foreground font-medium">{session.unread_count}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-foreground truncate">
                                                        {session.counselor_name}
                                                    </h3>
                                                    <span className="text-xs text-muted-foreground">
                                                        {session.last_message_time ? new Date(session.last_message_time).toLocaleDateString() : ''}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {session.last_message || 'No messages yet'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                    <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium text-foreground mb-2">
                                        {sessionsWithChats.length === 0 ? 'No conversations' : 'No matches found'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {sessionsWithChats.length === 0
                                            ? 'Start a conversation with a counselor'
                                            : 'Try adjusting your search'
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className={`flex-1 flex flex-col min-w-0 ${mobileView === 'list' ? 'hidden' : 'flex'}`}>
                        {selectedSession ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 bg-background border-b border-border flex items-center justify-between">
                                    <div className="md:hidden">
                                        <button
                                            onClick={handleBackToList}
                                            className="p-2 hover:bg-muted rounded-full transition-colors mr-2"
                                            title="Back to conversations"
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-primary-foreground" />
                                        </div>
                                        <div>
                                            <h2 className="font-semibold text-foreground">
                                                {selectedSession.counselor_name}
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                Licensed Counselor
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button className="p-2 hover:bg-muted rounded-full transition-colors" title="Call">
                                            <Phone className="h-5 w-5 text-muted-foreground" />
                                        </button>
                                        <button className="p-2 hover:bg-muted rounded-full transition-colors" title="Video Call">
                                            <Video className="h-5 w-5 text-muted-foreground" />
                                        </button>
                                        <Link
                                            href={`/client/messages/${selectedSession.id}`}
                                            className="p-2 hover:bg-muted rounded-full transition-colors"
                                        >
                                            <Eye className="h-5 w-5 text-muted-foreground" />
                                        </Link>
                                        <Link
                                            href={`/client/moods`}
                                            className="p-2 hover:bg-muted rounded-full transition-colors"
                                            title="View Mood Statistics"
                                        >
                                            <Heart className="h-5 w-5 text-muted-foreground" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 bg-muted/30 p-4 overflow-y-auto">
                                    <div className="max-w-4xl mx-auto space-y-4">
                                        {messages && messages.length > 0 ? (
                                            messages.map((message) => (
                                                <div key={message.id} className={`flex ${message.is_from_client ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                        message.is_from_client
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
                                                <div className="absolute bottom-full right-0 mb-2 p-2 bg-background border border-border rounded-lg shadow-lg z-10">
                                                    <div className="grid grid-cols-5 gap-1">
                                                        {emojis.map((emoji) => (
                                                            <button
                                                                key={emoji}
                                                                onClick={() => handleEmojiSelect(emoji)}
                                                                className="w-8 h-8 hover:bg-muted rounded flex items-center justify-center text-lg"
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
                        ) : (
                            <div className="flex-1 flex items-center justify-center bg-muted/30">
                                <div className="text-center">
                                    <MessageCircle className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
                                    <h2 className="text-2xl font-semibold text-foreground mb-2">
                                        Welcome to SafeTalk Messages
                                    </h2>
                                    <p className="text-muted-foreground mb-6">
                                        Select a conversation from the sidebar to start messaging
                                    </p>
                                    <button
                                        onClick={() => setIsSearchModalOpen(true)}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        <Plus className="h-5 w-5" />
                                        Start New Conversation
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* User Search Modal */}
                <UserSearchModal
                    isOpen={isSearchModalOpen}
                    onClose={() => setIsSearchModalOpen(false)}
                    users={users}
                    currentUser={{
                        id: auth.user.id,
                        role: auth.user.role,
                    }}
                />
            </div>
        </AppLayout>
    );
}