import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    Megaphone,
    Plus,
    Send,
    Users,
    Calendar,
    Edit,
    Trash2,
    Eye
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Announcements',
        href: '/admin/announcements',
    },
];

interface Announcement {
    id: number;
    title: string;
    message: string;
    created_at: string;
    is_active: boolean;
}

interface User {
    id: number;
    name: string;
    role: string;
}

interface AdminAnnouncementsProps {
    announcements: Announcement[];
    users: User[];
}

export default function AdminAnnouncements({ announcements = [], users = [] }: AdminAnnouncementsProps) {
    const [showCreateForm, setShowCreateForm] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        title: '',
        message: '',
        target_roles: [] as string[],
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/announcements', {
            onSuccess: () => {
                reset();
                setShowCreateForm(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Announcements" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Announcements</h1>
                        <p className="text-muted-foreground">Send messages to users and manage system communications</p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        New Announcement
                    </button>
                </div>

                {/* Create Announcement Form */}
                {showCreateForm && (
                    <div className="rounded-xl border bg-card p-6">
                        <h3 className="text-lg font-semibold mb-4">Create New Announcement</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter announcement title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Message</label>
                                <textarea
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    rows={4}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter announcement message"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Target Roles</label>
                                <div className="space-y-2">
                                    {['admin', 'counselor', 'client'].map((role) => (
                                        <label key={role} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={data.target_roles.includes(role)}
                                                onChange={(e) => {
                                                    const newRoles = e.target.checked
                                                        ? [...data.target_roles, role]
                                                        : data.target_roles.filter(r => r !== role);
                                                    setData('target_roles', newRoles);
                                                }}
                                                className="rounded border-gray-300"
                                            />
                                            <span className="capitalize">{role}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                    <Send className="h-4 w-4" />
                                    {processing ? 'Sending...' : 'Send Announcement'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm(false)}
                                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Announcements List */}
                <div className="rounded-xl border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Announcements</h3>

                    <div className="space-y-4">
                        {announcements.map((announcement) => (
                            <div key={announcement.id} className="flex items-start justify-between p-4 border rounded-lg">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <h4 className="font-semibold">{announcement.title}</h4>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                            announcement.is_active
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                                        }`}>
                                            {announcement.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">{announcement.message}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(announcement.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="p-1.5 hover:bg-muted rounded-lg" title="Edit">
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded-lg" title="Delete">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {announcements.length === 0 && (
                        <div className="text-center py-8">
                            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">No announcements yet</p>
                            <p className="text-sm text-muted-foreground">Create your first announcement to communicate with users</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}