import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    BarChart3,
    Users,
    Calendar,
    CheckCircle,
    TrendingUp,
    Download,
    FileText,
    UserCheck,
    Activity,
    Heart,
    Star,
    MessageSquare
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Reports & Analytics',
        href: '/admin/reports',
    },
];

interface ReportStats {
    total_users: number;
    total_counselors: number;
    total_clients: number;
    verified_counselors: number;
    total_sessions: number;
    completed_sessions: number;
    active_sessions: number;
    total_progress_reports: number;
    this_month_sessions: number;
    total_moods: number;
    active_clients_with_moods: number;
    average_mood: number;
    mood_distribution: { [key: number]: number };
    // Counselor ratings statistics
    total_ratings: number;
    average_rating: number;
    counselors_with_ratings: number;
    rating_distribution: { [key: number]: number };
}

interface RecentSession {
    id: number;
    client: {
        name: string;
        email: string;
    };
    counselor: {
        name: string;
        email: string;
    };
    status: string;
    created_at: string;
}

interface TopRatedCounselor {
    id: number;
    name: string;
    email: string;
    average_rating: number;
    total_ratings: number;
    verified: boolean;
}

interface RecentRating {
    id: number;
    counselor_name: string;
    client_name: string;
    rating: number;
    review: string;
    created_at: string;
}

interface AdminReportsProps {
    stats: ReportStats;
    recentSessions: RecentSession[];
    topRatedCounselors: TopRatedCounselor[];
    recentRatings: RecentRating[];
}

export default function AdminReports({ stats, recentSessions, topRatedCounselors, recentRatings }: AdminReportsProps) {
    const completionRate = stats.total_sessions > 0 ? Math.round((stats.completed_sessions / stats.total_sessions) * 100) : 0;
    const verificationRate = stats.total_counselors > 0 ? Math.round((stats.verified_counselors / stats.total_counselors) * 100) : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports & Analytics" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
                        <p className="text-muted-foreground">Platform usage statistics and insights</p>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        <Download className="h-4 w-4" />
                        Export Report
                    </button>
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
                                <p className="text-2xl font-bold">{stats.total_users}</p>
                                <p className="text-xs text-muted-foreground">Active Users</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Counselor Quality</p>
                                <p className="text-2xl font-bold">{stats.average_rating?.toFixed(1) || 'N/A'}</p>
                                <p className="text-xs text-muted-foreground">Average Rating</p>
                            </div>
                            <Star className="h-8 w-8 text-yellow-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Client Well-being</p>
                                <p className="text-2xl font-bold">{stats.average_mood?.toFixed(1) || 'N/A'}</p>
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
                                <p className="text-2xl font-bold">{stats.total_moods}</p>
                                <p className="text-xs text-muted-foreground">Total Entries</p>
                            </div>
                            <Heart className="h-8 w-8 text-pink-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Monthly Growth</p>
                                <p className="text-2xl font-bold">{stats.this_month_sessions}</p>
                                <p className="text-xs text-muted-foreground">Sessions This Month</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-purple-600" />
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
                                <span className="font-medium">{stats.total_users}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Counselors</span>
                                <span className="font-medium">{stats.total_counselors}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Clients</span>
                                <span className="font-medium">{stats.total_clients}</span>
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
                                <span className="font-medium">{stats.total_sessions}</span>
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
                            <Star className="h-5 w-5 mr-2 text-yellow-600" />
                            Quality Metrics
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Counselor Rating</span>
                                <span className="font-medium">{stats.average_rating?.toFixed(1) || 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Client Mood</span>
                                <span className="font-medium">{stats.average_mood?.toFixed(1) || 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Progress Reports</span>
                                <span className="font-medium">{stats.total_progress_reports}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">This Month</span>
                                <span className="font-medium text-purple-600">{stats.this_month_sessions}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Visualizations */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Rating Distribution Chart */}
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold flex items-center">
                                <Star className="h-5 w-5 mr-2 text-yellow-600" />
                                Counselor Ratings
                            </h3>
                            <span className="text-sm text-muted-foreground">
                                {stats.total_ratings || 0} total ratings
                            </span>
                        </div>

                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-1 w-12">
                                        <span className="text-sm font-medium">{rating}</span>
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-yellow-500 h-3 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${stats.rating_distribution ? (stats.rating_distribution[rating] / Math.max(...Object.values(stats.rating_distribution))) * 100 : 0}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="w-8 text-sm text-muted-foreground text-right">
                                        {stats.rating_distribution?.[rating] || 0}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mood Distribution Chart */}
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold flex items-center">
                                <Heart className="h-5 w-5 mr-2 text-pink-600" />
                                Client Mood Levels
                            </h3>
                            <span className="text-sm text-muted-foreground">
                                {stats.total_moods} total entries
                            </span>
                        </div>

                        <div className="space-y-2">
                            {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((level) => (
                                <div key={level} className="flex items-center space-x-3">
                                    <div className="w-8 text-sm font-medium text-center">{level}</div>
                                    <div className="flex-1">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${stats.mood_distribution ? (stats.mood_distribution[level] / Math.max(...Object.values(stats.mood_distribution))) * 100 : 0}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="w-8 text-sm text-muted-foreground text-right">
                                        {stats.mood_distribution?.[level] || 0}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Performance Insights */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Top Rated Counselors */}
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold flex items-center">
                                <Star className="h-5 w-5 mr-2 text-yellow-600" />
                                Top Performers
                            </h3>
                            <span className="text-sm text-muted-foreground">
                                {topRatedCounselors.length} rated
                            </span>
                        </div>

                        <div className="space-y-3">
                            {topRatedCounselors.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4 text-sm">No ratings yet</p>
                            ) : (
                                topRatedCounselors.slice(0, 5).map((counselor, index) => (
                                    <div key={counselor.id} className="flex items-center justify-between p-2 border rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex items-center justify-center w-6 h-6 bg-yellow-100 rounded-full">
                                                <span className="text-xs font-bold text-yellow-800">#{index + 1}</span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center space-x-1">
                                                    <p className="font-medium text-sm truncate">{counselor.name}</p>
                                                    {counselor.verified && (
                                                        <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="flex items-center space-x-1">
                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                <span className="font-medium text-sm">{counselor.average_rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recent Activity Feed */}
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold flex items-center">
                                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                                Recent Activity
                            </h3>
                            <span className="text-sm text-muted-foreground">
                                Latest updates
                            </span>
                        </div>

                        <div className="space-y-3">
                            {recentSessions.slice(0, 4).map((session) => (
                                <div key={session.id} className="flex items-start space-x-3 p-2 border rounded-lg">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate">
                                            {session.client.name} session
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            with {session.counselor.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(session.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {recentSessions.length === 0 && (
                                <p className="text-muted-foreground text-center py-4 text-sm">No recent sessions</p>
                            )}
                        </div>
                    </div>

                    {/* Client Feedback */}
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold flex items-center">
                                <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
                                Client Feedback
                            </h3>
                            <span className="text-sm text-muted-foreground">
                                {recentRatings.length} recent
                            </span>
                        </div>

                        <div className="space-y-3">
                            {recentRatings.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4 text-sm">No ratings yet</p>
                            ) : (
                                recentRatings.slice(0, 3).map((rating) => (
                                    <div key={rating.id} className="p-2 border rounded-lg">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-sm truncate">{rating.counselor_name}</span>
                                            <div className="flex items-center space-x-1 flex-shrink-0">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-2.5 w-2.5 ${i < rating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {rating.review && (
                                            <p className="text-xs text-muted-foreground italic line-clamp-2 mb-1">
                                                "{rating.review}"
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(rating.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
