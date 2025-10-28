import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Group Chats',
        href: '/group-chats',
    },
    {
        title: 'Create',
        href: '/group-chats/create',
    },
];

export default function GroupChatsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        mode: 'message',
        max_participants: 10,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/group-chats');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Group Chat" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create Group Chat</h1>
                        <p className="text-muted-foreground">
                            Set up a new group chat session for supportive discussions.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Group Chat Details</CardTitle>
                            <CardDescription>
                                Provide the basic information for your group chat session.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g., Anxiety Support Group"
                                    required
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-600">{errors.title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describe the purpose and focus of this group chat..."
                                    rows={3}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="mode">Mode</Label>
                                    <Select
                                        value={data.mode}
                                        onValueChange={(value) => setData('mode', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="message">Message</SelectItem>
                                            <SelectItem value="audio">Audio</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.mode && (
                                        <p className="text-sm text-red-600">{errors.mode}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="max_participants">Max Participants</Label>
                                    <Input
                                        id="max_participants"
                                        type="number"
                                        value={data.max_participants}
                                        onChange={(e) => setData('max_participants', parseInt(e.target.value) || 10)}
                                        placeholder="10"
                                        min="2"
                                        max="50"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Maximum number of participants (2-50).
                                    </p>
                                    {errors.max_participants && (
                                        <p className="text-sm text-red-600">{errors.max_participants}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <a href="/group-chats">Cancel</a>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Group Chat'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}