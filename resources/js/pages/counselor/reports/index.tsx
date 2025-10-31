import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    FileText,
    Calendar,
    TrendingUp,
    Users,
    Eye,
    Download,
    Star,
    Heart,
    CheckCircle,
    Activity,
    MessageSquare
} from 'lucide-react';
import { useState, useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/counselor/dashboard',
    },
    {
        title: 'Reports',
        href: '/counselor/reports',
    },
];

interface ProgressReport {
    id: number;
    session_id: number;
    client_id: number;
    notes: string;
    progress_level: string;
    created_at: string;
    session: {
        scheduled_at: string;
        client: {
            name: string;
            email: string;
        };
    };
}

interface ReportStats {
    total_sessions: number;
    completed_sessions: number;
    active_sessions: number;
    completion_rate: number;
    total_reports: number;
    this_month_reports: number;
    client_moods: number;
    average_client_mood: number;
    average_rating: number;
    total_ratings: number;
}

interface RecentSession {
    id: number;
    client: {
        name: string;
        email: string;
    };
    status: string;
    scheduled_at: string;
    created_at: string;
}

interface RecentRating {
    id: number;
    counselor_name: string;
    client_name: string;
    rating: number;
    review: string;
    created_at: string;
}

interface CounselorReportsProps {
    reports: {
        data: ProgressReport[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: ReportStats;
    recentSessions: RecentSession[];
    recentRatings: RecentRating[];
}

export default function CounselorReports({ reports, stats, recentSessions, recentRatings }: CounselorReportsProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMonth, setFilterMonth] = useState('All Time');

    const filteredReports = useMemo(() => {
        return reports.data.filter((report) => {
            const matchesSearch = searchTerm === '' ||
                report.session.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.session.client.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesMonth = filterMonth === 'All Time' || 
                new Date(report.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) === filterMonth;

            return matchesSearch && matchesMonth;
        });
    }, [reports.data, searchTerm, filterMonth]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Progress Reports" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Progress Reports</h1>
                        <p className="text-muted-foreground">Track client progress and session outcomes</p>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        <Download className="h-4 w-4" />
                        Export Reports
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                                <p className="text-2xl font-bold">{stats.total_sessions}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                                <p className="text-2xl font-bold">{stats.completion_rate}%</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                                <p className="text-2xl font-bold">{stats.average_rating}</p>
                            </div>
                            <Star className="h-8 w-8 text-yellow-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Client Mood Avg</p>
                                <p className="text-2xl font-bold">{stats.average_client_mood}</p>
                            </div>
                            <Heart className="h-8 w-8 text-pink-600" />
                        </div>
                    </div>
                </div>

                {/* Detailed Stats */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border bg-card p-6">
                        <h3 className="text-lg font-semibold mb-4">Session Statistics</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Active Sessions</span>
                                <span className="font-medium">{stats.active_sessions}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Completed Sessions</span>
                                <span className="font-medium">{stats.completed_sessions}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total Progress Reports</span>
                                <span className="font-medium">{stats.total_reports}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">This Month Reports</span>
                                <span className="font-medium">{stats.this_month_reports}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <h3 className="text-lg font-semibold mb-4">Client & Rating Stats</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Client Mood Entries</span>
                                <span className="font-medium">{stats.client_moods}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total Ratings Received</span>
                                <span className="font-medium">{stats.total_ratings}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Average Rating</span>
                                <span className="font-medium text-yellow-600">{stats.average_rating}/5.0</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Client Mood Average</span>
                                <span className="font-medium text-pink-600">{stats.average_client_mood}/10</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search by client name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-input bg-background pl-3 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <select
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            title="Filter reports by month"
                        >
                            <option>All Time</option>
                            <option>October 2025</option>
                            <option>September 2025</option>
                        </select>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Sessions */}
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Recent Sessions</h3>
                            <Activity className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div className="space-y-3">
                            {recentSessions.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">No recent sessions</p>
                            ) : (
                                recentSessions.map((session) => (
                                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <p className="font-medium">{session.client.name}</p>
                                                <span className="text-sm text-muted-foreground">with you</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{session.client.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                                                {session.status}
                                            </span>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(session.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recent Ratings */}
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Recent Ratings</h3>
                            <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div className="space-y-3">
                            {recentRatings.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">No ratings yet</p>
                            ) : (
                                recentRatings.map((rating) => (
                                    <div key={rating.id} className="p-3 border rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-medium">{rating.client_name}</span>
                                                <span className="text-sm text-muted-foreground">rated you</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-3 w-3 ${i < rating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {rating.review && (
                                            <p className="text-sm text-muted-foreground italic mb-2">"{rating.review}"</p>
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

                {/* Progress Reports */}
                <div className="rounded-xl border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-4">Progress Reports</h3>

                    <div className="space-y-4">
                        {filteredReports.map((report) => (
                            <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <p className="font-medium">{report.session.client.name}</p>
                                            <span className="text-sm text-muted-foreground">with you</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{report.session.client.email}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Session: {new Date(report.session.scheduled_at).toLocaleDateString()}
                                        </p>
                                        {report.notes && (
                                            <p className="text-xs text-muted-foreground mt-1">{report.notes}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                        {report.progress_level}
                                    </span>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">
                                            {new Date(report.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button className="p-1.5 hover:bg-muted rounded-lg" title="View Details">
                                        <Eye className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredReports.length === 0 && (
                        <div className="text-center py-8">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">No reports found matching your criteria</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
