import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Mood {
    id: number;
    mood_level: number;
    mood_type: 'daily' | 'post_session';
    notes: string | null;
    logged_at: string;
    activities: string[] | null;
    triggers: string[] | null;
    location: string | null;
    weather: string | null;
    energy_level: number | null;
    sleep_quality: number | null;
    stress_level: number | null;
    created_at: string;
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
];

interface Props {
    moods: Mood[];
}

export default function MoodIndex({ moods }: Props) {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        mood_level: 5,
        mood_type: 'daily' as 'daily' | 'post_session',
        notes: '',
        activities: [] as string[],
        triggers: [] as string[],
        location: '',
        weather: '',
        energy_level: 5,
        sleep_quality: 5,
        stress_level: 5,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/client/moods', {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
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
            <Head title="Mood Tracking" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Mood Tracking</h1>
                        <p className="text-muted-foreground">
                            Track your daily mood and see your progress over time.
                        </p>
                    </div>
                    <Button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto">
                        {showForm ? 'Cancel' : 'Log Mood'}
                    </Button>
                </div>

                {showForm && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Log Your Mood</CardTitle>
                            <CardDescription>
                                How are you feeling today?
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="mood_level">Mood Level (1-10)</Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="mood_level"
                                                type="range"
                                                min="1"
                                                max="10"
                                                value={data.mood_level}
                                                onChange={(e) => setData('mood_level', parseInt(e.target.value))}
                                                className="flex-1"
                                            />
                                            <span className="text-2xl">{getMoodEmoji(data.mood_level)}</span>
                                            <span className="font-medium">{data.mood_level}/10</span>
                                        </div>
                                        {errors.mood_level && (
                                            <p className="text-sm text-red-600">{errors.mood_level}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            placeholder="e.g., Home, Work, Park"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                        />
                                        {errors.location && (
                                            <p className="text-sm text-red-600">{errors.location}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="weather">Weather</Label>
                                        <Input
                                            id="weather"
                                            placeholder="e.g., Sunny, Rainy, Cloudy"
                                            value={data.weather}
                                            onChange={(e) => setData('weather', e.target.value)}
                                        />
                                        {errors.weather && (
                                            <p className="text-sm text-red-600">{errors.weather}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="energy_level">Energy Level (1-10)</Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="energy_level"
                                                type="range"
                                                min="1"
                                                max="10"
                                                value={data.energy_level}
                                                onChange={(e) => setData('energy_level', parseInt(e.target.value))}
                                                className="flex-1"
                                            />
                                            <span className="font-medium">{data.energy_level}/10</span>
                                        </div>
                                        {errors.energy_level && (
                                            <p className="text-sm text-red-600">{errors.energy_level}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="sleep_quality">Sleep Quality (1-10)</Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="sleep_quality"
                                                type="range"
                                                min="1"
                                                max="10"
                                                value={data.sleep_quality}
                                                onChange={(e) => setData('sleep_quality', parseInt(e.target.value))}
                                                className="flex-1"
                                            />
                                            <span className="font-medium">{data.sleep_quality}/10</span>
                                        </div>
                                        {errors.sleep_quality && (
                                            <p className="text-sm text-red-600">{errors.sleep_quality}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="stress_level">Stress Level (1-10)</Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="stress_level"
                                                type="range"
                                                min="1"
                                                max="10"
                                                value={data.stress_level}
                                                onChange={(e) => setData('stress_level', parseInt(e.target.value))}
                                                className="flex-1"
                                            />
                                            <span className="font-medium">{data.stress_level}/10</span>
                                        </div>
                                        {errors.stress_level && (
                                            <p className="text-sm text-red-600">{errors.stress_level}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes (Optional)</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="How are you feeling? Any thoughts you'd like to share..."
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                    />
                                    {errors.notes && (
                                        <p className="text-sm text-red-600">{errors.notes}</p>
                                    )}
                                </div>

                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Mood'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mood History</CardTitle>
                            <CardDescription>
                                Your recent mood entries
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {moods.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">
                                    No mood entries yet. Start tracking your mood today!
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {moods.map((mood) => (
                                        <div key={mood.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="text-2xl">{getMoodEmoji(mood.mood_level)}</div>
                                                <div className="flex-1">
                                                    <div className="font-medium">
                                                        Level {mood.mood_level}/10
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {format(new Date(mood.logged_at), 'PPP p')}
                                                    </div>
                                                    {mood.location && (
                                                        <div className="text-sm text-muted-foreground">
                                                            📍 {mood.location}
                                                        </div>
                                                    )}
                                                    {mood.weather && (
                                                        <div className="text-sm text-muted-foreground">
                                                            🌤️ {mood.weather}
                                                        </div>
                                                    )}
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
            </div>
        </AppLayout>
    );
}