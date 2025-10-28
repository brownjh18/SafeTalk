import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Briefcase,
    Folder,
    Settings,
    Building2,
    Users,
    Target,
    Wrench,
    Plus,
    TrendingUp,
    Activity,
    Clock,
    GraduationCap,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    Calendar,
    CheckCircle,
    AlertCircle,
    Info,
    Zap,
    Award,
    BookOpen,
    Lightbulb,
    Heart,
    UserCheck,
    FileText
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    stats: {
        users: number;
        counselors: number;
        clients: number;
        verified_counselors: number;
        sessions: number;
        completed_sessions: number;
        active_sessions: number;
        chats: number;
        resources: number;
        progress_reports: number;
        notifications: number;
        moods: number;
        average_mood: number;
        ratings: number;
        average_rating: number;
    };
    projectProgress: {
        completed: number;
        in_progress: number;
        planning: number;
    };
    recentProjects: Array<{
        id: string;
        title: string;
        program: string;
        facility: string;
        created_at: string;
    }>;
    recentOutcomes: Array<{
        id: string;
        title: string;
        project: string;
        created_at: string;
    }>;
    achievements: Array<{
        title: string;
        description: string;
        time: string;
    }>;
}

interface DashboardCardProps {
    title: string;
    description: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    color?: string;
}

function DashboardCard({ title, description, href, icon: Icon, count, color = "blue" }: DashboardCardProps) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
        green: "bg-green-50 text-green-600 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800",
        purple: "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800",
        orange: "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800",
        red: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-800",
        teal: "bg-teal-50 text-teal-600 border-teal-200 dark:bg-teal-950 dark:text-teal-400 dark:border-teal-800",
        pink: "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-950 dark:text-pink-400 dark:border-pink-800",
    };

    return (
        <Link
            href={href}
            className={`group relative overflow-hidden rounded-xl border p-6 transition-all hover:shadow-lg hover:-translate-y-1 ${colorClasses[color as keyof typeof colorClasses]}`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className={`rounded-lg p-2 ${colorClasses[color as keyof typeof colorClasses].replace('bg-', 'bg-').replace('text-', 'text-').split(' ')[0]}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{title}</h3>
                        <p className="text-sm opacity-75">{description}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {count !== undefined && (
                        <span className="text-2xl font-bold">{count}</span>
                    )}
                    <Plus className="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
        </Link>
    );
}

export default function Dashboard({ stats, projectProgress, recentProjects, recentOutcomes, achievements }: DashboardProps) {
    const completionRate = stats.sessions > 0 ? Math.round((stats.completed_sessions / stats.sessions) * 100) : 0;
    const verificationRate = stats.counselors > 0 ? Math.round((stats.verified_counselors / stats.counselors) * 100) : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Platform overview and key performance metrics</p>
                        <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-2">
                                <Heart className="h-4 w-4 text-pink-600" />
                                <span className="text-sm text-pink-600 font-medium">Avg Mood: {stats.average_mood}/10</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Award className="h-4 w-4 text-yellow-600" />
                                <span className="text-sm text-yellow-600 font-medium">Counselor Rating: {stats.average_rating}/5.0</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Last updated: {new Date().toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Key Performance Indicators */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Platform Health</p>
                                <p className="text-2xl font-bold">{completionRate}%</p>
                                <p className="text-xs text-muted-foreground">Session Success Rate</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">User Engagement</p>
                                <p className="text-2xl font-bold">{stats.users}</p>
                                <p className="text-xs text-muted-foreground">Active Users</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Counselor Quality</p>
                                <p className="text-2xl font-bold">{stats.average_rating}</p>
                                <p className="text-xs text-muted-foreground">Average Rating</p>
                            </div>
                            <Award className="h-8 w-8 text-yellow-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Client Well-being</p>
                                <p className="text-2xl font-bold">{stats.average_mood}</p>
                                <p className="text-xs text-muted-foreground">Average Mood</p>
                            </div>
                            <Heart className="h-8 w-8 text-pink-600" />
                        </div>
                    </div>
                </div>

                {/* Secondary Metrics */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                                <p className="text-2xl font-bold">{stats.active_sessions}</p>
                                <p className="text-xs text-muted-foreground">In Progress</p>
                            </div>
                            <Activity className="h-8 w-8 text-green-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Counselor Verification</p>
                                <p className="text-2xl font-bold">{verificationRate}%</p>
                                <p className="text-xs text-muted-foreground">Verified Rate</p>
                            </div>
                            <UserCheck className="h-8 w-8 text-orange-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Mood Tracking</p>
                                <p className="text-2xl font-bold">{stats.moods}</p>
                                <p className="text-xs text-muted-foreground">Total Entries</p>
                            </div>
                            <Heart className="h-8 w-8 text-pink-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Progress Reports</p>
                                <p className="text-2xl font-bold">{stats.progress_reports}</p>
                                <p className="text-xs text-muted-foreground">Total Reports</p>
                            </div>
                            <FileText className="h-8 w-8 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Analytics Dashboard */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* User Demographics */}
                    <div className="rounded-xl border bg-card p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <Users className="h-5 w-5 mr-2 text-blue-600" />
                            User Demographics
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total Users</span>
                                <span className="font-medium">{stats.users}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Counselors</span>
                                <span className="font-medium">{stats.counselors}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Clients</span>
                                <span className="font-medium">{stats.clients}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Verification Rate</span>
                                <span className="font-medium text-orange-600">{verificationRate}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Session Performance */}
                    <div className="rounded-xl border bg-card p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <Activity className="h-5 w-5 mr-2 text-green-600" />
                            Session Performance
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total Sessions</span>
                                <span className="font-medium">{stats.sessions}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Active Sessions</span>
                                <span className="font-medium">{stats.active_sessions}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Completed</span>
                                <span className="font-medium">{stats.completed_sessions}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Success Rate</span>
                                <span className="font-medium text-green-600">{completionRate}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Quality Metrics */}
                    <div className="rounded-xl border bg-card p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <Award className="h-5 w-5 mr-2 text-yellow-600" />
                            Quality Metrics
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Counselor Rating</span>
                                <span className="font-medium">{stats.average_rating}/5.0</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Client Mood</span>
                                <span className="font-medium">{stats.average_mood}/10</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Progress Reports</span>
                                <span className="font-medium">{stats.progress_reports}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total Ratings</span>
                                <span className="font-medium text-purple-600">{stats.ratings}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <DashboardCard
                        title="User Management"
                        description="Manage admins, counselors, and clients"
                        href="/users"
                        icon={Users}
                        count={stats.users}
                        color="blue"
                    />
                    <DashboardCard
                        title="Session Monitoring"
                        description="Track and manage counseling sessions"
                        href="/admin/sessions"
                        icon={Calendar}
                        count={stats.sessions}
                        color="green"
                    />
                    <DashboardCard
                        title="Analytics & Reports"
                        description="Platform performance and insights"
                        href="/admin/reports"
                        icon={Target}
                        count={stats.progress_reports}
                        color="teal"
                    />
                    <DashboardCard
                        title="Resource Library"
                        description="Manage self-help materials"
                        href="/admin/resources"
                        icon={BookOpen}
                        count={stats.resources}
                        color="orange"
                    />
                    <DashboardCard
                        title="System Messages"
                        description="Admin messaging and announcements"
                        href="/admin/messages"
                        icon={Activity}
                        count={stats.chats}
                        color="purple"
                    />
                    <DashboardCard
                        title="Notifications"
                        description="Broadcast alerts and updates"
                        href="/admin/announcements"
                        icon={Info}
                        count={stats.notifications}
                        color="indigo"
                    />
                    <DashboardCard
                        title="Mood Analytics"
                        description="Client mood tracking and statistics"
                        href="/admin/moods"
                        icon={Heart}
                        count={stats.moods}
                        color="pink"
                    />
                    <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-slate-50 to-gray-100/50 dark:from-slate-950 dark:to-gray-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                        <div className="text-center">
                            <div className="rounded-lg bg-slate-600 p-2 mx-auto mb-2 w-fit">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <p className="font-medium text-slate-700 dark:text-slate-300">Documentation</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Platform Guides</p>
                        </div>
                    </div>
                </div>

                {/* Enhanced Recent Activity */}
                <div className="rounded-xl border bg-card p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Recent SafeTalk Activity</h2>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Activity className="h-4 w-4" />
                            <span>Live Updates</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {recentProjects.slice(0, 1).map((project) => (
                            <div key={project.id} className="flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800">
                                <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <p className="font-semibold text-green-800 dark:text-green-200">New Session: {project.title}</p>
                                        <span className="text-xs bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">New</span>
                                    </div>
                                    <p className="text-sm text-green-700 dark:text-green-300 mb-2">Counselor: {project.program}, Platform: {project.facility}</p>
                                    <div className="flex items-center space-x-4 text-xs text-green-600 dark:text-green-400">
                                        <span>⏱️ {project.created_at}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {recentOutcomes.slice(0, 1).map((outcome) => (
                            <div key={outcome.id} className="flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border border-blue-200 dark:border-blue-800">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <p className="font-semibold text-blue-800 dark:text-blue-200">New Progress Report: {outcome.title}</p>
                                        <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">Report</span>
                                    </div>
                                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">Counselor: {outcome.project}</p>
                                    <div className="flex items-center space-x-4 text-xs text-blue-600 dark:text-blue-400">
                                        <span>⏱️ {outcome.created_at}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 border border-orange-200 dark:border-orange-800">
                            <div className="w-3 h-3 bg-orange-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <p className="font-semibold text-orange-800 dark:text-orange-200">New User Registered</p>
                                    <span className="text-xs bg-orange-200 dark:bg-orange-800 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full">Registration</span>
                                </div>
                                <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">New client joined the platform for support</p>
                                <div className="flex items-center space-x-4 text-xs text-orange-600 dark:text-orange-400">
                                    <span>👤 New client</span>
                                    <span>🔒 Anonymous option</span>
                                    <span>⏱️ 1 day ago</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 border border-purple-200 dark:border-purple-800">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <p className="font-semibold text-purple-800 dark:text-purple-200">Session Completed</p>
                                    <span className="text-xs bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">Completed</span>
                                </div>
                                <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">Counseling session successfully finished with positive feedback</p>
                                <div className="flex items-center space-x-4 text-xs text-purple-600 dark:text-purple-400">
                                    <span>🏆 Session completed</span>
                                    <span>📊 100% satisfaction</span>
                                    <span>⏱️ 2 days ago</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                        <Link href="/dashboard" className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                            View All Activity →
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
