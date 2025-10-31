import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Users,
    MessageSquare,
    Plus,
    UserMinus,
    UserPlus,
    Crown,
    Check,
    X,
    Lock,
    Globe
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
    is_private?: boolean;
    is_invited?: boolean;
}


interface GroupChatsIndexProps {
    sessions: {
        data: GroupChatSession[];
    };
    canCreate: boolean;
    userRole: string;
}

export default function GroupChatsIndex({ sessions, canCreate, userRole }: GroupChatsIndexProps) {
    const sessionData = sessions?.data || [];

    const handleJoin = (sessionId: number) => {
        router.post(`/group-chats/${sessionId}/join`, {}, {
            onSuccess: () => {
                // Refresh the page to update button states
                window.location.reload();
            },
            onError: (errors) => {
                console.error('Join session error:', errors);
                alert('Failed to join session: ' + (errors?.message || errors?.session || 'Unknown error'));
            }
        });
    };

    const handleLeave = (sessionId: number) => {
        router.post(`/group-chats/${sessionId}/leave`);
    };

    const getModeColor = (mode: string) => {
        switch (mode) {
            case 'audio': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'message': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    // Filter sessions based on user role and invitation status
    const publicSessions = sessionData.filter(session => !session.is_private);
    const privateSessions = sessionData.filter(session => {
        if (!session.is_private) return false;

        // For counselors: show all private sessions they created
        if (userRole === 'counselor') return true;

        // For clients: only show private sessions they were invited to
        // This is determined by the is_invited flag from the server
        return session.is_invited;
    });

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


                {/* Sessions Tabs */}
                <Tabs defaultValue="public" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="public" className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Public Sessions ({publicSessions.length})
                        </TabsTrigger>
                        <TabsTrigger value="private" className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Private Sessions ({privateSessions.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="public" className="mt-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {publicSessions.length > 0 ? (
                                publicSessions.map((session) => (
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
                                                         <span className="text-sm text-muted-foreground">Active participant</span>
                                                     ) : (
                                                         <span className="text-sm text-muted-foreground">Session available</span>
                                                     )
                                                 ) : (
                                                     <span className="text-sm text-muted-foreground">Session ended</span>
                                                 )}
                                             </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No public group chats available</h3>
                                    <p className="text-muted-foreground">Check back later for new public group discussions</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="private" className="mt-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {privateSessions.length > 0 ? (
                                privateSessions.map((session) => (
                                    <div key={session.id} className="rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="rounded-lg bg-primary/10 p-2">
                                                    <Lock className="h-6 w-6 text-primary" />
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
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No private group chats available</h3>
                                    <p className="text-muted-foreground">Private sessions are invitation-only</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
