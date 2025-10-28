import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Heart, Users, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Reports',
        href: '/admin/reports',
    },
    {
        title: 'Mood Analytics',
        href: '/admin/moods',
    },
];

interface MoodEntry {
    id: number;
    user_id: number;
    mood_level: number;
    mood_type: 'daily' | 'post_session';
    notes: string | null;
    mood_date: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface AdminMoodsProps {
    moods: MoodEntry[];
    statistics: {
        total_moods: number;
        total_clients: number;
        active_clients: number;
        average_mood: number;
        mood_distribution: { [key: number]: number };
        recent_activity: Array<{
            id: number;
            user_name: string;
            mood_level: number;
            mood_type: string;
            created_at: string;
        }>;
    };
}

export default function AdminMoodsIndex({ moods, statistics }: AdminMoodsProps) {
    const getMoodEmoji = (level: number) => {
        if (level <= 2) return '😢';
        if (level <= 4) return '😕';
        if (level <= 6) return '😐';
        if (level <= 8) return '🙂';
        return '😊';
    };

    const getMoodColor = (level: number) => {
        if (level <= 2) return 'bg-red-100 text-red-800';
        if (level <= 4) return 'bg-orange-100 text-orange-800';
        if (level <= 6) return 'bg-yellow-100 text-yellow-800';
        if (level <= 8) return 'bg-blue-100 text-blue-800';
        return 'bg-green-100 text-green-800';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mood Analytics" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Mood Analytics</h1>
                        <p className="text-muted-foreground">
                            Comprehensive mood tracking and analytics across all clients
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Mood Entries</p>
                                <p className="text-2xl font-bold">{statistics.total_moods}</p>
                            </div>
                            <Heart className="h-8 w-8 text-pink-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                                <p className="text-2xl font-bold">{statistics.active_clients}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Average Mood</p>
                                <p className="text-2xl font-bold">{statistics.average_mood ? statistics.average_mood.toFixed(1) : 'N/A'}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                                <p className="text-2xl font-bold">
                                    {statistics.total_clients > 0 ? Math.round((statistics.active_clients / statistics.total_clients) * 100) : 0}%
                                </p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Mood Distribution Chart */}
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Mood Distribution</h3>
                            <Heart className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                                <div key={level} className="flex items-center space-x-3">
                                    <div className="w-8 text-sm font-medium">{level}</div>
                                    <div className="flex-1">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-pink-500 h-2 rounded-full"
                                                style={{
                                                    width: `${statistics.mood_distribution ? (statistics.mood_distribution[level] / Math.max(...Object.values(statistics.mood_distribution))) * 100 : 0}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="w-8 text-sm text-muted-foreground">
                                        {statistics.mood_distribution?.[level] || 0}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Recent Activity</h3>
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div className="space-y-3">
                            {statistics.recent_activity.length > 0 ? (
                                statistics.recent_activity.map((activity) => (
                                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">{getMoodEmoji(activity.mood_level)}</span>
                                            <div>
                                                <p className="font-medium text-sm">{activity.user_name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {activity.mood_type === 'daily' ? 'Daily' : 'Post-Session'} • {activity.mood_level}/10
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(activity.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground">No recent mood activity</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* All Mood Entries */}
                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">All Mood Entries</h3>
                        <Heart className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="space-y-4">
                        {!moods || moods.length === 0 ? (
                            <div className="text-center py-8">
                                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                <p className="text-muted-foreground">No mood entries yet</p>
                            </div>
                        ) : (
                            moods.map((mood) => (
                                <div key={mood.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="text-2xl">{getMoodEmoji(mood.mood_level)}</div>
                                        <div>
                                            <div className="font-medium">
                                                {mood.user.name} ({mood.user.email})
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Level {mood.mood_level}/10 • {new Date(mood.mood_date).toLocaleDateString()}
                                            </div>
                                            {mood.notes && (
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    {mood.notes}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getMoodColor(mood.mood_level)}`}>
                                            {mood.mood_type === 'daily' ? 'Daily' : 'Post-Session'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}