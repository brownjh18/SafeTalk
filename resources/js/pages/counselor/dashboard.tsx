import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    MessageCircle,
    Users,
    Clock,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Heart,
    UserCheck,
    BookOpen,
    Plus
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/counselor/dashboard',
    },
];

const quickActions = [
    {
        title: 'Messages',
        description: 'Chat with users',
        href: '/messages',
        icon: MessageCircle,
        color: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800',
    },
    {
        title: 'Sessions',
        description: 'Manage counseling sessions',
        href: '/counselor/sessions',
        icon: Calendar,
        color: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800',
    },
    {
        title: 'Clients',
        description: 'View and manage clients',
        href: '/counselor/clients',
        icon: Users,
        color: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800',
    },
    {
        title: 'Resources',
        description: 'Manage self-help materials',
        href: '/counselor/resources',
        icon: BookOpen,
        color: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800',
    },
    {
        title: 'Client Moods',
        description: 'Monitor client mood patterns',
        href: '/counselor/moods',
        icon: Heart,
        color: 'bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-950 dark:text-pink-400 dark:border-pink-800',
    },
];

interface CounselingSession {
    id: number;
    client_id: number;
    scheduled_at: string;
    status: string;
    client: {
        name: string;
        email: string;
    };
}

interface Notification {
    id: number;
    title: string;
    message: string;
    created_at: string;
    is_read: boolean;
}

interface CounselorDashboardProps {
    todaySessions: CounselingSession[];
    pendingChats: number;
    totalClients: number;
    notifications: Notification[];
    moodStats: {
        total_moods: number;
        active_clients: number;
        average_mood: number;
        clients_needing_attention: number;
    };
}

export default function CounselorDashboard({
    todaySessions = [],
    pendingChats = 0,
    totalClients = 0,
    notifications = [],
    moodStats = { total_moods: 0, active_clients: 0, average_mood: 0, clients_needing_attention: 0 }
}: CounselorDashboardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'in_progress': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Counselor Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Counselor Dashboard</h1>
                        <p className="text-muted-foreground">Manage your clients and sessions</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/50 px-3 py-2 rounded-lg">
                            <UserCheck className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                Active Counselor
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Today's Sessions</p>
                                <p className="text-2xl font-bold">{todaySessions.length}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending Chats</p>
                                <p className="text-2xl font-bold">{pendingChats}</p>
                            </div>
                            <MessageCircle className="h-8 w-8 text-orange-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                                <p className="text-2xl font-bold">{totalClients}</p>
                            </div>
                            <Users className="h-8 w-8 text-green-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                                <p className="text-2xl font-bold">98%</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-purple-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Mood Entries</p>
                                <p className="text-2xl font-bold">{moodStats.total_moods}</p>
                            </div>
                            <Heart className="h-8 w-8 text-pink-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Clients Needing Attention</p>
                                <p className="text-2xl font-bold text-red-600">{moodStats.clients_needing_attention}</p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.href}
                            className={`group relative overflow-hidden rounded-xl border p-6 transition-all hover:shadow-lg hover:-translate-y-1 ${action.color}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`rounded-lg p-2 ${action.color.replace('bg-', 'bg-').replace('text-', 'text-').split(' ')[0]}`}>
                                        <action.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{action.title}</h3>
                                        <p className="text-sm opacity-75">{action.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Plus className="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Today's Sessions */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Today's Sessions</h3>
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div className="space-y-3">
                            {todaySessions.length > 0 ? (
                                todaySessions.map((session) => (
                                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                            <div>
                                                <p className="font-medium">{session.client.name}</p>
                                                <p className="text-sm text-muted-foreground">{session.client.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(session.status)}`}>
                                                {session.status}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground">No sessions scheduled for today</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Notifications */}
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Recent Notifications</h3>
                            <AlertCircle className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div className="space-y-3">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div key={notification.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                                        <div className={`w-2 h-2 rounded-full mt-2 ${notification.is_read ? 'bg-gray-400' : 'bg-blue-600'}`}></div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{notification.title}</p>
                                            <p className="text-xs text-muted-foreground">{notification.message}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(notification.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground">No new notifications</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
