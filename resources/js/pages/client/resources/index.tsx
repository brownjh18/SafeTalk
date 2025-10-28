import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    FileText,
    Download,
    Search,
    Filter,
    Eye,
    Calendar,
    X
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/client/dashboard',
    },
    {
        title: 'Resources',
        href: '/client/resources',
    },
];

interface Resource {
    id: number;
    title: string;
    description: string;
    file_path: string;
    type: string;
    created_at: string;
    uploader: {
        name: string;
    };
}

interface ClientResourcesProps {
    resources: {
        data: Resource[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    types: string[];
}

export default function ClientResources({ resources, types }: ClientResourcesProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All Types');
    const [previewResource, setPreviewResource] = useState<Resource | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const filteredResources = useMemo(() => {
        return resources.data.filter((resource) => {
            const matchesSearch = searchTerm === '' ||
                resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.description.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType = filterType === 'All Types' || resource.type === filterType;

            return matchesSearch && matchesType;
        });
    }, [resources.data, searchTerm, filterType]);

    const handlePreview = (resource: Resource) => {
        setPreviewResource(resource);
        setIsPreviewOpen(true);
    };

    const renderPreviewContent = (resource: Resource) => {
        const fileExtension = resource.file_path.split('.').pop()?.toLowerCase();

        switch (resource.type.toLowerCase()) {
            case 'video':
                return (
                    <video controls className="w-full max-h-96 rounded-lg">
                        <source src={`/storage/${resource.file_path}`} type={`video/${fileExtension}`} />
                        Your browser does not support the video tag.
                    </video>
                );
            case 'audio':
                return (
                    <audio controls className="w-full">
                        <source src={`/storage/${resource.file_path}`} type={`audio/${fileExtension}`} />
                        Your browser does not support the audio element.
                    </audio>
                );
            case 'document':
            case 'article':
            case 'book':
            case 'presentation':
            case 'worksheet':
            case 'guide':
                if (fileExtension === 'pdf') {
                    return (
                        <iframe
                            src={`/storage/${resource.file_path}`}
                            className="w-full h-96 rounded-lg border"
                            title={resource.title}
                        />
                    );
                }
                // For other document types, show download link
                return (
                    <div className="text-center p-8">
                        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">
                            This {resource.type.toLowerCase()} cannot be previewed directly.
                        </p>
                        <a
                            href={`/storage/${resource.file_path}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Download className="h-4 w-4" />
                            Download to View
                        </a>
                    </div>
                );
            default:
                return (
                    <div className="text-center p-8">
                        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">
                            Preview not available for this resource type.
                        </p>
                        <a
                            href={`/storage/${resource.file_path}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Download className="h-4 w-4" />
                            Download
                        </a>
                    </div>
                );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Resources" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Resources</h1>
                        <p className="text-muted-foreground">Access helpful materials and documents</p>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            aria-label="Filter by resource type"
                        >
                            <option>All Types</option>
                            {types.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Resources Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredResources.map((resource) => (
                        <div key={resource.id} className="rounded-xl border bg-card p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    <span className="text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">
                                        {resource.type}
                                    </span>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePreview(resource)}
                                        title="Preview"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <a
                                        href={`/storage/${resource.file_path}`}
                                        className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                                        title="Download"
                                    >
                                        <Download className="h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                {resource.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>By {resource.uploader.name}</span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(resource.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredResources.length === 0 && (
                    <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No resources found matching your criteria</p>
                    </div>
                )}

                {/* Preview Modal */}
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                                <span>{previewResource?.title}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="hover:bg-muted transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </Button>
                            </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 bg-muted/30 p-4 rounded-lg">
                            {previewResource && renderPreviewContent(previewResource)}
                        </div>
                        {previewResource && (
                            <div className="flex justify-between items-center mt-4 pt-4 border-t bg-muted/50 p-4 rounded-lg">
                                <div className="text-sm text-muted-foreground">
                                    <p>Uploaded by: {previewResource.uploader.name}</p>
                                    <p>Type: {previewResource.type}</p>
                                </div>
                                <a
                                    href={`/storage/${previewResource.file_path}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Download className="h-4 w-4" />
                                    Download
                                </a>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}