import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Trash2,
    RotateCcw,
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
    AlertTriangle
} from 'lucide-react';

interface DeletedItem {
    id: string;
    type: 'program' | 'project' | 'facility' | 'service' | 'equipment' | 'participant' | 'outcome';
    title: string;
    description?: string;
    deleted_at: string;
    metadata?: {
        [key: string]: any;
    };
}

interface TrashProps {
    deletedItems: DeletedItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Trash',
        href: '#',
    },
];

export default function Trash({ deletedItems = [] }: TrashProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All Types');
    const [isLoading, setIsLoading] = useState(false);

    const filteredItems = deletedItems.filter((item) => {
        const matchesSearch = searchTerm === '' ||
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesType = filterType === 'All Types' || item.type === filterType.toLowerCase();

        return matchesSearch && matchesType;
    });

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'program': return Briefcase;
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
            case 'program': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'project': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'facility': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'service': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
            case 'equipment': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'participant': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
            case 'outcome': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const handleRestore = (item: DeletedItem) => {
        if (confirm(`Are you sure you want to restore this ${item.type}?`)) {
            setIsLoading(true);
            router.post(`/trash/${item.type}/${item.id}/restore`);
        }
    };

    const handlePermanentDelete = (item: DeletedItem) => {
        if (confirm(`Are you sure you want to permanently delete this ${item.type}? This action cannot be undone.`)) {
            setIsLoading(true);
            router.delete(`/trash/${item.type}/${item.id}/permanent`);
        }
    };

    const handleEmptyTrash = () => {
        if (confirm('Are you sure you want to permanently delete all items in the trash? This action cannot be undone.')) {
            setIsLoading(true);
            router.delete('/trash/empty');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trash" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Trash</h1>
                        <p className="text-muted-foreground">Manage deleted items - restore or permanently delete</p>
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
                        {deletedItems.length > 0 && (
                            <button
                                onClick={handleEmptyTrash}
                                disabled={isLoading}
                                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                <Trash2 className="h-4 w-4" />
                                Empty Trash
                            </button>
                        )}
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex items-center space-x-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search deleted items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <label htmlFor="trash-filter" className="sr-only">Filter by type</label>
                        <select
                            id="trash-filter"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option>All Types</option>
                            <option>Programs</option>
                            <option>Projects</option>
                            <option>Facilities</option>
                            <option>Services</option>
                            <option>Equipment</option>
                            <option>Participants</option>
                            <option>Outcomes</option>
                        </select>
                    </div>
                </div>

                {/* Items Grid */}
                {filteredItems.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredItems.map((item) => {
                            const TypeIcon = getTypeIcon(item.type);
                            return (
                                <div key={`${item.type}-${item.id}`} className="group rounded-lg border bg-card p-6 opacity-75">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-2">
                                            <TypeIcon className="h-5 w-5 text-muted-foreground" />
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getTypeColor(item.type)}`}>
                                                {item.type}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <button
                                                onClick={() => handleRestore(item)}
                                                disabled={isLoading}
                                                className="p-1.5 hover:bg-green-100 hover:text-green-600 rounded-lg disabled:opacity-50"
                                                title="Restore Item"
                                            >
                                                <RotateCcw className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handlePermanentDelete(item)}
                                                disabled={isLoading}
                                                className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded-lg disabled:opacity-50"
                                                title="Permanently Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                    {item.description && (
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                            {item.description}
                                        </p>
                                    )}

                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <span>Deleted: {new Date(item.deleted_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Trash is empty</h3>
                        <p className="text-muted-foreground">
                            No deleted items found
                        </p>
                    </div>
                )}

                {/* Summary */}
                {deletedItems.length > 0 && (
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">
                                {filteredItems.length} of {deletedItems.length} items
                            </span>
                            <div className="flex items-center space-x-4 text-muted-foreground">
                                <span>Types: {new Set(deletedItems.map(item => item.type)).size}</span>
                                <span>Total size: ~{Math.round(deletedItems.length * 0.5)}KB</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}