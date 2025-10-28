import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Heart, Calendar, TrendingUp, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/counselor/dashboard',
    },
    {
        title: 'Client Moods',
        href: '/counselor/moods',
    },
    {
        title: 'Client Details',
        href: '/counselor/moods/{client}',
    },
];

interface Mood {
    id: number;
    mood_level: number;
    mood_type: 'daily' | 'post_session';
    notes: string | null;
    mood_date: string;
    created_at: string;
}

interface Client {
    id: number;
    name: string;
    email: string;
}

interface CounselorMoodsShowProps {
    client: Client;
    moods: Mood[];
    statistics: {
        total_entries: number;
        average_mood: number;
        highest_mood: number;
        lowest_mood: number;
        recent_trend: 'improving' | 'declining' | 'stable' | 'insufficient_data';
    };
}

export default function CounselorMoodsShow({ client, moods, statistics }: CounselorMoodsShowProps) {
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

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'improving': return '📈';
            case 'declining': return '📉';
            case 'stable': return '➡️';
            default: return '❓';
        }
    };

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case 'improving': return 'text-green-600';
            case 'declining': return 'text-red-600';
            case 'stable': return 'text-blue-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${client.name} - Mood Tracking`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/counselor/moods"
                            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Clients
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">{client.name}'s Mood Tracking</h1>
                            <p className="text-muted-foreground">{client.email}</p>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
                                <p className="text-2xl font-bold">{statistics.total_entries}</p>
                            </div>
                            <Heart className="h-8 w-8 text-pink-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Average Mood</p>
                                <p className="text-2xl font-bold">{statistics.average_mood?.toFixed(1) || 'N/A'}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Highest Mood</p>
                                <p className="text-2xl font-bold">{statistics.highest_mood || 'N/A'}</p>
                            </div>
                            <span className="text-2xl">😊</span>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Recent Trend</p>
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg">{getTrendIcon(statistics.recent_trend)}</span>
                                    <span className={`text-sm font-medium capitalize ${getTrendColor(statistics.recent_trend)}`}>
                                        {statistics.recent_trend.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-orange-600" />
                        </div>
                    </div>
                </div>

                {/* Mood History */}
                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Mood History</h3>
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="space-y-4">
                        {moods.length === 0 ? (
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
                                                Level {mood.mood_level}/10
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {format(new Date(mood.mood_date), 'PPP')}
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