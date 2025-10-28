import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Heart, Users, TrendingUp, AlertTriangle, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/counselor/dashboard',
    },
    {
        title: 'Client Moods',
        href: '/counselor/moods',
    },
];

interface Client {
    id: number;
    name: string;
    email: string;
    moods: Array<{
        id: number;
        mood_level: number;
        mood_type: string;
        mood_date: string;
        notes: string | null;
    }>;
}

interface CounselorMoodsProps {
    clients: Client[];
    statistics: {
        total_clients: number;
        active_clients_with_moods: number;
        average_mood: number;
        clients_needing_attention: number;
    };
}

export default function CounselorMoodsIndex({ clients, statistics }: CounselorMoodsProps) {
    const getMoodEmoji = (level: number) => {
        if (level <= 2) return '😢';
        if (level <= 4) return '😕';
        if (level <= 6) return '😐';
        if (level <= 8) return '🙂';
        return '😊';
    };

    const getMoodColor = (level: number) => {
        if (level <= 2) return 'text-red-600';
        if (level <= 4) return 'text-orange-600';
        if (level <= 6) return 'text-yellow-600';
        if (level <= 8) return 'text-blue-600';
        return 'text-green-600';
    };

    const getAverageMood = (moods: Client['moods']) => {
        if (moods.length === 0) return 0;
        return Math.round(moods.reduce((sum, mood) => sum + mood.mood_level, 0) / moods.length * 10) / 10;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Client Mood Tracking" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Client Mood Tracking</h1>
                        <p className="text-muted-foreground">
                            Monitor your clients' emotional well-being and progress
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                                <p className="text-2xl font-bold">{statistics.total_clients}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Mood Trackers</p>
                                <p className="text-2xl font-bold">{statistics.active_clients_with_moods}</p>
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
                            <TrendingUp className="h-8 w-8 text-green-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Need Attention</p>
                                <p className="text-2xl font-bold text-red-600">{statistics.clients_needing_attention}</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                        </div>
                    </div>
                </div>

                {/* Clients List */}
                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Client Mood Overview</h3>
                        <Heart className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="space-y-4">
                        {clients.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                <p className="text-muted-foreground">No clients assigned yet</p>
                            </div>
                        ) : (
                            clients.map((client) => (
                                <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            {client.moods.length > 0 ? (
                                                <>
                                                    <span className="text-2xl">{getMoodEmoji(getAverageMood(client.moods))}</span>
                                                    <div>
                                                        <p className="font-medium">{client.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Avg: {getAverageMood(client.moods)}/10 • {client.moods.length} entries
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div>
                                                    <p className="font-medium">{client.name}</p>
                                                    <p className="text-sm text-muted-foreground">No mood entries yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {client.moods.length > 0 && (
                                            <div className="text-right mr-4">
                                                <p className="text-sm font-medium">Latest Mood</p>
                                                <div className="flex items-center space-x-1">
                                                    <span className="text-lg">
                                                        {getMoodEmoji(client.moods[0]?.mood_level || 5)}
                                                    </span>
                                                    <span className={`text-sm font-medium ${getMoodColor(client.moods[0]?.mood_level || 5)}`}>
                                                        {client.moods[0]?.mood_level || 'N/A'}/10
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <Link
                                            href={`/counselor/moods/${client.id}`}
                                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View Details
                                        </Link>
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