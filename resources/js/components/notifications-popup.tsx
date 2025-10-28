import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { usePage } from '@inertiajs/react';
import {
    Bell,
    MessageCircle,
    Calendar,
    BookOpen,
    User,
    Megaphone,
    Clock,
    CheckCircle,
    X,
    Eye
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    type: 'message' | 'session' | 'resource' | 'announcement' | 'system';
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
    data?: any;
}

interface NotificationsPopupProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: NotificationItem[];
    unreadCount: number;
}

export default function NotificationsPopup({ isOpen, onClose, notifications = [], unreadCount = 0 }: NotificationsPopupProps) {
    const { auth } = usePage().props as any;
    const userRole = auth?.user?.role || 'client';
    const [localNotifications, setLocalNotifications] = useState(notifications);

    useEffect(() => {
        setLocalNotifications(notifications);
    }, [notifications]);

    // Fetch real notifications from backend API
    useEffect(() => {
        if (isOpen) {
            fetch('/notifications', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                credentials: 'same-origin',
            })
            .then(response => response.json())
            .then(data => {
                const notifications = data.notifications || [];
                const unreadCount = data.unread_count || 0;
                setLocalNotifications(notifications);
            })
            .catch(error => {
                console.error('Failed to fetch notifications:', error);
            });
        }
    }, [isOpen]);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'message':
                return <MessageCircle className="h-4 w-4 text-blue-600" />;
            case 'session':
                return <Calendar className="h-4 w-4 text-green-600" />;
            case 'resource':
                return <BookOpen className="h-4 w-4 text-orange-600" />;
            case 'announcement':
                return <Megaphone className="h-4 w-4 text-purple-600" />;
            default:
                return <Bell className="h-4 w-4 text-gray-600" />;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'message':
                return 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800';
            case 'session':
                return 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
            case 'resource':
                return 'bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800';
            case 'announcement':
                return 'bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800';
            default:
                return 'bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800';
        }
    };

    const handleNotificationClick = (notification: NotificationItem) => {
        // Mark as read
        markAsRead(notification.id);

        // Navigate based on notification type and data
        let link = '';
        switch (notification.type) {
            case 'message':
                link = '/messages';
                break;
            case 'session':
                link = userRole === 'counselor' ? '/counselor/sessions' : '/client/dashboard';
                break;
            case 'resource':
                link = userRole === 'counselor' ? '/counselor/resources' : '/client/resources';
                break;
            case 'announcement':
                link = notification.data?.link || (userRole === 'counselor' ? '/counselor/announcements' : userRole === 'client' ? '/client/announcements' : '/admin/announcements');
                break;
            case 'system':
                // Check if it's a session request notification
                if (notification.message && notification.message.includes('requested a counseling session')) {
                    link = userRole === 'counselor' ? '/counselor/sessions' : '/dashboard';
                } else {
                    link = userRole === 'admin' ? '/admin/sessions' : '/dashboard';
                }
                break;
            default:
                link = '/dashboard';
        }

        router.visit(link);
    };

    const markAsRead = (notificationId: number) => {
        setLocalNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId ? { ...notif, is_read: true } : notif
            )
        );

        // Here you would typically make an API call to mark as read
        router.post(`/notifications/${notificationId}/read`, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const markAllAsRead = () => {
        setLocalNotifications(prev =>
            prev.map(notif => ({ ...notif, is_read: true }))
        );

        router.post('/notifications/mark-all-read', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatTimeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    const unreadNotifications = localNotifications.filter(n => !n.is_read);
    const readNotifications = localNotifications.filter(n => n.is_read);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="max-w-2xl max-h-[80vh] overflow-hidden bg-card border shadow-2xl backdrop-blur-sm"
                style={{
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)'
                }}
            >
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center gap-3">
                            <div className="relative">
                                <Bell className="h-4 w-4 text-primary" />
                                {unreadCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-1 -right-1 h-3 w-3 rounded-full p-0 flex items-center justify-center text-[10px]"
                                    >
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </Badge>
                                )}
                            </div>
                        <div>
                            <DialogTitle className="text-xl">Notifications</DialogTitle>
                            <DialogDescription>
                                Stay updated with your latest activities
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={markAllAsRead}
                                className="text-xs"
                            >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Mark all read
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="hover:bg-muted"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto max-h-96 pr-4">
                    <div className="space-y-4">
                        {/* Unread Notifications */}
                        {unreadNotifications.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    New ({unreadNotifications.length})
                                </h3>
                                <div className="space-y-3">
                                    {unreadNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} relative cursor-pointer hover:opacity-90 transition-opacity`}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className="font-medium text-sm text-foreground">
                                                            {notification.title}
                                                        </h4>
                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                            <span className="text-xs text-muted-foreground">
                                                                {formatTimeAgo(notification.created_at)}
                                                            </span>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    markAsRead(notification.id);
                                                                }}
                                                                className="h-6 w-6 p-0 hover:bg-muted"
                                                                title="Mark as read"
                                                            >
                                                                <Eye className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Badge variant="secondary" className="text-xs">
                                                            {notification.type}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Unread indicator */}
                                            <div className="absolute left-0 top-4 bottom-4 w-1 bg-red-500 rounded-r-full"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Read Notifications */}
                        {readNotifications.length > 0 && (
                            <>
                                {unreadNotifications.length > 0 && <Separator className="my-6" />}
                                <div>
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4" />
                                        Earlier
                                    </h3>
                                    <div className="space-y-3">
                                        {readNotifications.slice(0, 10).map((notification) => (
                                            <div
                                                key={notification.id}
                                                className="p-4 rounded-lg border bg-muted/30 border-border/50 cursor-pointer hover:opacity-90 transition-opacity"
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 mt-1 opacity-60">
                                                        {getNotificationIcon(notification.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h4 className="font-medium text-sm text-muted-foreground">
                                                                {notification.title}
                                                            </h4>
                                                            <span className="text-xs text-muted-foreground flex-shrink-0">
                                                                {formatTimeAgo(notification.created_at)}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {notification.message}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Badge variant="outline" className="text-xs">
                                                                {notification.type}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Empty State */}
                        {localNotifications.length === 0 && (
                            <div className="text-center py-12">
                                <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-foreground mb-2">
                                    No notifications yet
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    You'll see updates about messages, sessions, and announcements here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {localNotifications.length > 10 && (
                    <div className="pt-4 border-t">
                        <Button variant="outline" className="w-full" onClick={() => router.visit('/notifications')}>
                            View All Notifications
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}