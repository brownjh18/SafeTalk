import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface MoodLoggerProps {
    sessionId?: number;
    moodType: 'daily' | 'post_session';
    onSuccess?: () => void;
    title?: string;
    description?: string;
}

export default function MoodLogger({
    sessionId,
    moodType,
    onSuccess,
    title = "Log Your Mood",
    description = "How are you feeling?"
}: MoodLoggerProps) {
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        mood_level: 5,
        mood_type: moodType,
        counseling_session_id: sessionId,
        notes: '',
        mood_date: new Date().toISOString().split('T')[0],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/client/moods', {
            onSuccess: () => {
                reset();
                setShowForm(false);
                onSuccess?.();
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

    if (!showForm) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center">
                        <p className="text-muted-foreground mb-4">
                            {moodType === 'post_session'
                                ? "How did the session make you feel?"
                                : "Ready to log today's mood?"
                            }
                        </p>
                        <Button onClick={() => setShowForm(true)}>
                            {moodType === 'post_session' ? 'Rate Session Mood' : 'Log Daily Mood'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="mood_level">Mood Level (1-10)</Label>
                        <div className="flex items-center space-x-4">
                            <Input
                                id="mood_level"
                                type="range"
                                min="1"
                                max="10"
                                value={data.mood_level}
                                onChange={(e) => setData('mood_level', parseInt(e.target.value))}
                                className="flex-1"
                            />
                            <div className="text-center">
                                <div className="text-3xl">{getMoodEmoji(data.mood_level)}</div>
                                <div className="text-sm font-medium">{data.mood_level}/10</div>
                            </div>
                        </div>
                        {errors.mood_level && (
                            <p className="text-sm text-red-600">{errors.mood_level}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            placeholder={
                                moodType === 'post_session'
                                    ? "How did this session impact you?"
                                    : "Any thoughts about your day?"
                            }
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={3}
                        />
                        {errors.notes && (
                            <p className="text-sm text-red-600">{errors.notes}</p>
                        )}
                    </div>

                    <div className="flex space-x-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Mood'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowForm(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}