import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Eye,
    Search,
    Filter,
    RefreshCw,
    Archive,
    Folder,
    Building2,
    Users,
    Target,
    Briefcase,
    Settings,
    Wrench,
    UserCheck,
    Calendar,
    AlertTriangle,
    ArrowLeft,
    Edit,
    Trash2
} from 'lucide-react';

interface ItemDetails {
    id: string;
    type: 'project' | 'facility' | 'service' | 'equipment' | 'participant' | 'outcome';
    title: string;
    description?: string;
    status?: string;
    created_at: string;
    updated_at: string;
    metadata?: {
        [key: string]: any;
    };
}

interface ViewDetailsProps {
    item: ItemDetails;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'View Details',
        href: '#',
    },
];

export default function ViewDetails({ item }: ViewDetailsProps) {
    const [isLoading, setIsLoading] = useState(false);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'project': return Folder;
            case 'facility': return Building2;
            case 'service': return Settings;
            case 'equipment': return Wrench;
            case 'participant': return Users;
            case 'outcome': return Target;
            default: return Archive;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'project': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'facility': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'service': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
            case 'equipment': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'participant': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
            case 'outcome': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'development': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const TypeIcon = getTypeIcon(item.type);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`View ${item.type} Details`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={`/${item.type}s`}
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to {item.type.charAt(0).toUpperCase() + item.type.slice(1)}s
                        </Link>
                        <div className="flex items-center space-x-3">
                            <div className="rounded-lg bg-muted p-2">
                                <TypeIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">{item.title}</h1>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getTypeColor(item.type)}`}>
                                        {item.type}
                                    </span>
                                    {item.status && (
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => router.reload()}
                            disabled={isLoading}
                            className="inline-flex items-center gap-2 rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                        >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <Link
                            href={`/${item.type}s/${item.id}/edit`}
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Edit className="h-4 w-4" />
                            Edit {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </Link>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <div className="rounded-xl border bg-card p-6">
                            <h2 className="text-xl font-semibold mb-4">Description</h2>
                            {item.description ? (
                                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                            ) : (
                                <p className="text-muted-foreground italic">No description provided</p>
                            )}
                        </div>

                        {/* Metadata */}
                        {item.metadata && Object.keys(item.metadata).length > 0 && (
                            <div className="rounded-xl border bg-card p-6">
                                <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {Object.entries(item.metadata).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                            <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                                            <span className="text-muted-foreground">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Related Items */}
                        <div className="rounded-xl border bg-card p-6">
                            <h2 className="text-xl font-semibold mb-4">Related Items</h2>
                            <div className="text-center py-8">
                                <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">Related items will be displayed here</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Item Information */}
                        <div className="rounded-xl border bg-card p-6">
                            <h2 className="text-xl font-semibold mb-4">Item Information</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">ID:</span>
                                    <span className="text-muted-foreground bg-muted px-3 py-1 rounded-full text-sm font-mono">{item.id}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Type:</span>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getTypeColor(item.type)}`}>
                                        {item.type}
                                    </span>
                                </div>
                                {item.status && (
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Status:</span>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Created:</span>
                                    <span className="text-muted-foreground text-sm">{new Date(item.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Updated:</span>
                                    <span className="text-muted-foreground text-sm">{new Date(item.updated_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="rounded-xl border bg-card p-6">
                            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <Link
                                    href={`/${item.type}s/${item.id}/edit`}
                                    className="flex items-center gap-3 w-full p-3 rounded-lg border bg-muted hover:bg-accent transition-colors"
                                >
                                    <Edit className="h-4 w-4" />
                                    <span className="font-medium">Edit {item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                                </Link>
                                <Link
                                    href={`/${item.type}s`}
                                    className="flex items-center gap-3 w-full p-3 rounded-lg border bg-muted hover:bg-accent transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    <span className="font-medium">Back to {item.type.charAt(0).toUpperCase() + item.type.slice(1)}s</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        if (confirm(`Are you sure you want to delete this ${item.type}?`)) {
                                            router.delete(`/${item.type}s/${item.id}`);
                                        }
                                    }}
                                    className="flex items-center gap-3 w-full p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="font-medium">Delete {item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}