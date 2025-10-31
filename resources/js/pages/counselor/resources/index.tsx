import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import {
    FileText,
    Download,
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Upload,
    Calendar,
    Eye
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/counselor/dashboard',
    },
    {
        title: 'Resources',
        href: '/counselor/resources',
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

interface CounselorResourcesProps {
    resources: {
        data: Resource[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    types: string[];
}

export default function CounselorResources({ resources, types }: CounselorResourcesProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All Types');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);
    const [previewResource, setPreviewResource] = useState<Resource | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const createForm = useForm({
        title: '',
        description: '',
        type: '',
        file: null as File | null,
    });

    const editForm = useForm({
        title: '',
        description: '',
        type: '',
        file: null as File | null,
    });

    const filteredResources = useMemo(() => {
        return resources.data.filter((resource) => {
            const matchesSearch = searchTerm === '' ||
                resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.description.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType = filterType === 'All Types' || resource.type === filterType;

            return matchesSearch && matchesType;
        });
    }, [resources.data, searchTerm, filterType]);

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/counselor/resources', {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingResource) {
            editForm.put(`/counselor/resources/${editingResource.id}`, {
                onSuccess: () => {
                    setIsEditDialogOpen(false);
                    setEditingResource(null);
                    editForm.reset();
                },
            });
        }
    };

    const handleEdit = (resource: Resource) => {
        setEditingResource(resource);
        editForm.setData({
            title: resource.title,
            description: resource.description,
            type: resource.type,
            file: null,
        });
        setIsEditDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        router.delete(`/counselor/resources/${id}`);
    };

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
            <Head title="Resources Management" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Resources Management</h1>
                        <p className="text-muted-foreground">Manage resources for your clients</p>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Resource
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border shadow-2xl backdrop-blur-sm">
                            <DialogHeader>
                                <DialogTitle className="flex items-center justify-between">
                                    <span>Add New Resource</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsCreateDialogOpen(false)}
                                        className="hover:bg-muted transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </Button>
                                </DialogTitle>
                                <DialogDescription>
                                    Upload a new resource file with details.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateSubmit} className="space-y-4 bg-muted/30 p-4 rounded-lg">
                                <div>
                                    <Label htmlFor="create-title">Title</Label>
                                    <Input
                                        id="create-title"
                                        value={createForm.data.title}
                                        onChange={(e) => createForm.setData('title', e.target.value)}
                                        required
                                        className="bg-background"
                                    />
                                    {createForm.errors.title && <p className="text-sm text-red-600">{createForm.errors.title}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="create-description">Description</Label>
                                    <Textarea
                                        id="create-description"
                                        value={createForm.data.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => createForm.setData('description', e.target.value)}
                                        required
                                        className="bg-background"
                                    />
                                    {createForm.errors.description && <p className="text-sm text-red-600">{createForm.errors.description}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="create-type">Type</Label>
                                    <Select value={createForm.data.type} onValueChange={(value) => createForm.setData('type', value)}>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Document">Document</SelectItem>
                                            <SelectItem value="Article">Article</SelectItem>
                                            <SelectItem value="Video">Video</SelectItem>
                                            <SelectItem value="Audio">Audio</SelectItem>
                                            <SelectItem value="Book">Book</SelectItem>
                                            <SelectItem value="Presentation">Presentation</SelectItem>
                                            <SelectItem value="Worksheet">Worksheet</SelectItem>
                                            <SelectItem value="Guide">Guide</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {createForm.errors.type && <p className="text-sm text-red-600">{createForm.errors.type}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="create-file">File</Label>
                                    <Input
                                        id="create-file"
                                        type="file"
                                        onChange={(e) => createForm.setData('file', e.target.files?.[0] || null)}
                                        required
                                        className="bg-background"
                                    />
                                    {createForm.errors.file && <p className="text-sm text-red-600">{createForm.errors.file}</p>}
                                </div>
                                <div className="flex gap-2 pt-4 border-t bg-muted/50 p-4 rounded-lg">
                                    <Button type="submit" disabled={createForm.processing} className="flex-1">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search resources..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All Types">All Types</SelectItem>
                                <SelectItem value="Document">Document</SelectItem>
                                <SelectItem value="Article">Article</SelectItem>
                                <SelectItem value="Video">Video</SelectItem>
                                <SelectItem value="Audio">Audio</SelectItem>
                                <SelectItem value="Book">Book</SelectItem>
                                <SelectItem value="Presentation">Presentation</SelectItem>
                                <SelectItem value="Worksheet">Worksheet</SelectItem>
                                <SelectItem value="Guide">Guide</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
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
                                    <Button variant="outline" size="sm" onClick={() => handlePreview(resource)} title="Preview">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleEdit(resource)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete "{resource.title}"? This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(resource.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
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

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="bg-card border shadow-2xl backdrop-blur-sm">
                        <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                                <span>Edit Resource</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsEditDialogOpen(false)}
                                    className="hover:bg-muted transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </Button>
                            </DialogTitle>
                            <DialogDescription>
                                Update the resource details.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className="space-y-4 bg-muted/30 p-4 rounded-lg">
                            <div>
                                <Label htmlFor="edit-title">Title</Label>
                                <Input
                                    id="edit-title"
                                    value={editForm.data.title}
                                    onChange={(e) => editForm.setData('title', e.target.value)}
                                    required
                                    className="bg-background"
                                />
                                {editForm.errors.title && <p className="text-sm text-red-600">{editForm.errors.title}</p>}
                            </div>
                            <div>
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                    id="edit-description"
                                    value={editForm.data.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => editForm.setData('description', e.target.value)}
                                    required
                                    className="bg-background"
                                />
                                {editForm.errors.description && <p className="text-sm text-red-600">{editForm.errors.description}</p>}
                            </div>
                            <div>
                                <Label htmlFor="edit-type">Type</Label>
                                <Select value={editForm.data.type} onValueChange={(value) => editForm.setData('type', value)}>
                                    <SelectTrigger className="bg-background">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Document">Document</SelectItem>
                                        <SelectItem value="Article">Article</SelectItem>
                                        <SelectItem value="Video">Video</SelectItem>
                                        <SelectItem value="Audio">Audio</SelectItem>
                                        <SelectItem value="Book">Book</SelectItem>
                                        <SelectItem value="Presentation">Presentation</SelectItem>
                                        <SelectItem value="Worksheet">Worksheet</SelectItem>
                                        <SelectItem value="Guide">Guide</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {editForm.errors.type && <p className="text-sm text-red-600">{editForm.errors.type}</p>}
                            </div>
                            <div>
                                <Label htmlFor="edit-file">File (optional)</Label>
                                <Input
                                    id="edit-file"
                                    type="file"
                                    onChange={(e) => editForm.setData('file', e.target.files?.[0] || null)}
                                    className="bg-background"
                                />
                                {editForm.errors.file && <p className="text-sm text-red-600">{editForm.errors.file}</p>}
                            </div>
                            <div className="flex gap-2 pt-4 border-t bg-muted/50 p-4 rounded-lg">
                                <Button type="submit" disabled={editForm.processing} className="flex-1">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Update
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Preview Modal */}
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border shadow-2xl backdrop-blur-sm">
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
