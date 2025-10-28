import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Users,
    MessageSquare,
    Plus,
    UserMinus,
    UserPlus,
    Crown,
    Check,
    X
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Group Chats',
        href: '/group-chats',
    },
];

interface GroupChatSession {
    id: number;
    title: string;
    description: string;
    participant_count: number;
    mode: string;
    created_at: string;
    is_participant: boolean;
    is_active: boolean;
    user_join_status?: 'none' | 'pending' | 'active';
}

interface PendingRequest {
    session_id: number;
    session_title: string;
    user_id: number;
    user_name: string;
    user_email: string;
    requested_at: string;
}

interface GroupChatsIndexProps {
    sessions: {
        data: GroupChatSession[];
    };
    canCreate: boolean;
    userRole: string;
    pendingRequests: PendingRequest[];
}

export default function GroupChatsIndex({ sessions, canCreate, userRole, pendingRequests }: GroupChatsIndexProps) {
    const sessionData = sessions?.data || [];

    const handleJoin = (sessionId: number) => {
        router.post(`/group-chats/${sessionId}/join`, {}, {
            onSuccess: () => {
                // Refresh the page to update button states
                window.location.reload();
            }
        });
    };

    const handleLeave = (sessionId: number) => {
        router.post(`/group-chats/${sessionId}/leave`);
    };

    const handleApproveRequest = (sessionId: number, userId: number) => {
        router.post(`/group-chats/${sessionId}/approve-participant/${userId}`, {}, {
            onSuccess: () => {
                // Refresh the page to update pending requests list
                window.location.reload();
            }
        });
    };

    const handleRejectRequest = (sessionId: number, userId: number) => {
        if (confirm('Are you sure you want to reject this join request?')) {
            router.post(`/group-chats/${sessionId}/reject-participant/${userId}`, {}, {
                onSuccess: () => {
                    // Refresh the page to update pending requests list
                    window.location.reload();
                }
            });
        }
    };

    const getModeColor = (mode: string) => {
        switch (mode) {
            case 'audio': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'message': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Group Chats" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Group Chats</h1>
                        <p className="text-muted-foreground">Connect with others in supportive group discussions</p>
                    </div>
                    {canCreate && userRole !== 'client' && (
                        <Link
                            href="/group-chats/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4" />
                            Create Group Chat
                        </Link>
                    )}
                </div>

                {/* Pending Requests Section for Counselors */}
                {userRole === 'counselor' && pendingRequests && pendingRequests.length > 0 && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Pending Join Requests
                            </CardTitle>
                            <CardDescription>
                                Review and approve join requests for your group chat sessions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {pendingRequests.map((request) => (
                                    <div key={`${request.session_id}-${request.user_id}`} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback>
                                                    {request.user_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{request.user_name}</p>
                                                <p className="text-sm text-muted-foreground">{request.user_email}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Requested to join: {request.session_title}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(request.requested_at).toLocaleDateString()}
                                            </span>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    onClick={() => handleApproveRequest(request.session_id, request.user_id)}
                                                    className="h-8 px-3"
                                                >
                                                    <Check className="h-4 w-4 mr-1" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleRejectRequest(request.session_id, request.user_id)}
                                                    className="h-8 px-3"
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Sessions Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sessionData.length > 0 ? (
                        sessionData.map((session) => (
                            <div key={session.id} className="rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="rounded-lg bg-primary/10 p-2">
                                            <MessageSquare className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <Link
                                                href={`/group-chats/${session.id}`}
                                                className="font-semibold text-lg hover:text-primary transition-colors"
                                            >
                                                {session.title}
                                            </Link>
                                            <p className="text-sm text-muted-foreground">
                                                Created {new Date(session.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getModeColor(session.mode)}`}>
                                            {session.mode}
                                        </span>
                                        {!session.is_active && (
                                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                                                Ended
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                    {session.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {session.participant_count} participants
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {session.is_active ? (
                                            session.user_join_status === 'active' ? (
                                                <button
                                                    onClick={() => handleLeave(session.id)}
                                                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
                                                >
                                                    <UserMinus className="h-4 w-4" />
                                                    Leave
                                                </button>
                                            ) : session.user_join_status === 'pending' ? (
                                                <button
                                                    disabled
                                                    className="inline-flex items-center gap-2 rounded-lg bg-yellow-100 px-3 py-1.5 text-sm font-medium text-yellow-800 cursor-not-allowed dark:bg-yellow-900 dark:text-yellow-300"
                                                >
                                                    <UserPlus className="h-4 w-4" />
                                                    Request Sent
                                                </button>
                                            ) : userRole === 'client' ? (
                                                <button
                                                    onClick={() => handleJoin(session.id)}
                                                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                                >
                                                    <UserPlus className="h-4 w-4" />
                                                    Send Request
                                                </button>
                                            ) : null
                                        ) : (
                                            <span className="text-sm text-muted-foreground">Session ended</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No group chats available</h3>
                            <p className="text-muted-foreground">Check back later for new group discussions</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}