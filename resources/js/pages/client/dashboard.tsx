import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    MessageCircle,
    BookOpen,
    Clock,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Heart,
    UserCheck,
    FileText,
    Bell,
    Plus,
    Smile
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/client/dashboard',
    },
];

interface CounselingSession {
    id: number;
    counselor_id: number;
    scheduled_at: string;
    status: string;
    counselor: {
        name: string;
        email: string;
    };
}

interface Chat {
    id: number;
    message: string;
    created_at: string;
    is_from_counselor: boolean;
}

interface ProgressReport {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

interface Notification {
    id: number;
    title: string;
    message: string;
    created_at: string;
    is_read: boolean;
}

interface ClientDashboardProps {
    upcomingSessions: CounselingSession[];
    recentChats: Chat[];
    progressReports: ProgressReport[];
    notifications: Notification[];
}

export default function ClientDashboard({
    upcomingSessions = [],
    recentChats = [],
    progressReports = [],
    notifications = []
}: ClientDashboardProps) {
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
            <Head title="Client Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">My Dashboard</h1>
                        <p className="text-muted-foreground">Track your wellness journey</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/50 px-3 py-2 rounded-lg">
                            <UserCheck className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                Active Client
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Upcoming Sessions</p>
                                <p className="text-2xl font-bold">{upcomingSessions.length}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Recent Messages</p>
                                <p className="text-2xl font-bold">{recentChats.length}</p>
                            </div>
                            <MessageCircle className="h-8 w-8 text-orange-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Progress Reports</p>
                                <p className="text-2xl font-bold">{progressReports.length}</p>
                            </div>
                            <FileText className="h-8 w-8 text-green-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Mood Today</p>
                                <p className="text-2xl font-bold">😊</p>
                            </div>
                            <Smile className="h-8 w-8 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Upcoming Sessions */}
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Upcoming Sessions</h3>
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div className="space-y-3">
                            {upcomingSessions.length > 0 ? (
                                upcomingSessions.map((session) => (
                                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                            <div>
                                                <p className="font-medium">{session.counselor.name}</p>
                                                <p className="text-sm text-muted-foreground">Licensed Therapist</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(session.status)}`}>
                                                {session.status}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(session.scheduled_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground">No upcoming sessions</p>
                                    <p className="text-sm text-muted-foreground">Book a session to get started</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Progress Reports */}
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Progress Reports</h3>
                            <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div className="space-y-3">
                            {progressReports.length > 0 ? (
                                progressReports.map((report) => (
                                    <div key={report.id} className="p-3 border rounded-lg">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-medium text-sm">{report.title}</h4>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(report.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {report.content}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground">No progress reports yet</p>
                                    <p className="text-sm text-muted-foreground">Complete sessions to see your progress</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Link
                        href="/messages"
                        className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950 dark:to-green-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-lg bg-green-600 p-2">
                                    <MessageCircle className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Messages</h3>
                                    <p className="text-sm opacity-75">Chat with users</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Plus className="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/client/book-session"
                        className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-lg bg-blue-600 p-2">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Book Session</h3>
                                    <p className="text-sm opacity-75">Schedule counseling</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Plus className="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/client/resources"
                        className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950 dark:to-purple-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-lg bg-purple-600 p-2">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Resources</h3>
                                    <p className="text-sm opacity-75">Self-help materials</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Plus className="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/client/moods"
                        className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-950 dark:to-pink-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-lg bg-pink-600 p-2">
                                    <Smile className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Mood Tracking</h3>
                                    <p className="text-sm opacity-75">Log your daily mood</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Plus className="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Recent Messages */}
                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Recent Messages</h3>
                        <MessageCircle className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="space-y-3">
                        {recentChats.length > 0 ? (
                            recentChats.map((chat) => (
                                <div key={chat.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                                    <div className={`w-2 h-2 rounded-full mt-2 ${chat.is_from_counselor ? 'bg-blue-600' : 'bg-green-600'}`}></div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="text-xs font-medium">
                                                {chat.is_from_counselor ? 'Your Counselor' : 'You'}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(chat.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm">{chat.message}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                <p className="text-muted-foreground">No messages yet</p>
                                <p className="text-sm text-muted-foreground">Start a conversation with your counselor</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
