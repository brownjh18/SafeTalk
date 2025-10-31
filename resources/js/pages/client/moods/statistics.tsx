import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, BarChart3, Calendar, Target } from 'lucide-react';

interface Mood {
    id: number;
    mood_level: number;
    mood_type: 'daily' | 'post_session';
    notes: string | null;
    mood_date: string;
    created_at: string;
}

interface Statistics {
    total_entries: number;
    average_mood: number;
    highest_mood: number;
    lowest_mood: number;
    recent_trend: 'improving' | 'declining' | 'stable' | 'insufficient_data';
    daily_moods: number;
    post_session_moods: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/client/dashboard',
    },
    {
        title: 'Mood Tracking',
        href: '/client/moods',
    },
    {
        title: 'Statistics',
        href: '/client/moods/statistics',
    },
];

interface Props {
    statistics: Statistics;
    moods: Mood[];
}

export default function MoodStatistics({ statistics, moods }: Props) {
    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'improving':
                return <TrendingUp className="h-4 w-4 text-green-600" />;
            case 'declining':
                return <TrendingDown className="h-4 w-4 text-red-600" />;
            case 'stable':
                return <Minus className="h-4 w-4 text-blue-600" />;
            default:
                return <BarChart3 className="h-4 w-4 text-gray-600" />;
        }
    };

    const getTrendText = (trend: string) => {
        switch (trend) {
            case 'improving':
                return 'Improving';
            case 'declining':
                return 'Declining';
            case 'stable':
                return 'Stable';
            default:
                return 'Insufficient Data';
        }
    };

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
            <Head title="Mood Statistics" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mood Statistics</h1>
                    <p className="text-muted-foreground">
                        Track your emotional journey and progress over time.
                    </p>
                </div>

                {/* Overview Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.total_entries}</div>
                            <p className="text-xs text-muted-foreground">
                                Mood log entries
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold flex items-center space-x-2">
                                <span>{getMoodEmoji(Math.round(statistics.average_mood))}</span>
                                <span>{statistics.average_mood.toFixed(1)}/10</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Overall average
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Recent Trend</CardTitle>
                            {getTrendIcon(statistics.recent_trend)}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {getTrendText(statistics.recent_trend)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Last 7 entries
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Session Moods</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.post_session_moods}</div>
                            <p className="text-xs text-muted-foreground">
                                Post-session entries
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Mood Range */}
                <Card>
                    <CardHeader>
                        <CardTitle>Mood Range</CardTitle>
                        <CardDescription>
                            Your highest and lowest mood levels
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-center">
                                <div className="text-3xl mb-2">{getMoodEmoji(statistics.lowest_mood)}</div>
                                <Badge variant="secondary" className={getMoodColor(statistics.lowest_mood)}>
                                    Lowest: {statistics.lowest_mood}/10
                                </Badge>
                            </div>
                            <div className="flex-1 mx-4">
                                <Progress
                                    value={(statistics.average_mood / 10) * 100}
                                    className="h-2"
                                />
                            </div>
                            <div className="text-center">
                                <div className="text-3xl mb-2">{getMoodEmoji(statistics.highest_mood)}</div>
                                <Badge variant="secondary" className={getMoodColor(statistics.highest_mood)}>
                                    Highest: {statistics.highest_mood}/10
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Moods */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Mood Entries</CardTitle>
                        <CardDescription>
                            Your latest mood log entries
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {moods.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8">
                                No mood entries yet. Start tracking to see your progress!
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {moods.slice(0, 10).map((mood) => (
                                    <div key={mood.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <div className="text-2xl">{getMoodEmoji(mood.mood_level)}</div>
                                            <div>
                                                <div className="font-medium">
                                                    Level {mood.mood_level}/10
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(mood.mood_date).toLocaleDateString()}
                                                </div>
                                                {mood.notes && (
                                                    <div className="text-sm text-muted-foreground mt-1">
                                                        {mood.notes}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className={getMoodColor(mood.mood_level)}>
                                            {mood.mood_type === 'daily' ? 'Daily' : 'Post-Session'}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
