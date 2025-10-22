import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import projectsRoutes from '@/routes/projects';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Target,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Download,
    FileText,
    Award,
    TrendingUp,
    Calendar,
    CheckCircle
} from 'lucide-react';

interface Outcome {
    id: string;
    title: string;
    description: string;
    projectName: string;
    outcomeType: 'CAD' | 'PCB' | 'Prototype' | 'Report' | 'Business Plan' | 'Software';
    commercializationStatus: 'Demoed' | 'Market Linked' | 'Launched' | 'Scaling';
    qualityCertification: boolean;
    artifactLink?: string;
    createdAt: string;
}

interface OutcomesProps {
    project: {
        id: string;
        title: string;
        outcomes: Outcome[];
    };
}

interface OutcomesProps {
    project: {
        id: string;
        title: string;
        outcomes: Outcome[];
    };
}

interface OutcomesProps {
    project: {
        id: string;
        title: string;
        outcomes: Outcome[];
    };
}

interface OutcomesProps {
    project: {
        id: string;
        title: string;
        outcomes: Outcome[];
    };
}

export default function Outcomes({ project }: OutcomesProps) {
    const outcomes = project.outcomes || [];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Outcomes',
            href: projectsRoutes.outcomes.index(project.id).url,
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Launched': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Market Linked': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Demoed': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Scaling': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const handleDelete = (outcomeId: string) => {
        if (confirm('Are you sure you want to delete this outcome? This action cannot be undone and will also delete the associated artifact file.')) {
            router.delete(projectsRoutes.outcomes.destroy({project: project.id, outcome: outcomeId}).url, {
                onSuccess: () => {
                    // Success message will be handled by the server redirect
                },
            });
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Prototype': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
            case 'Software': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
            case 'Business Plan': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
            case 'CAD': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'PCB': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
            case 'Report': return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Outcomes" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Project Outcomes</h1>
                        <p className="text-muted-foreground">Track deliverables, prototypes, and commercialization progress</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link
                            href={projectsRoutes.outcomes.create(project.id).url}
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            Upload Outcome
                        </Link>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex items-center space-x-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search outcomes..."
                            className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option>All Types</option>
                            <option>Prototypes</option>
                            <option>Software</option>
                            <option>Business Plans</option>
                            <option>Reports</option>
                        </select>
                    </div>
                </div>

                {/* Outcomes Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {outcomes.map((outcome) => (
                        <div key={outcome.id} className="rounded-lg border bg-card p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getTypeColor(outcome.outcomeType)}`}>
                                        {outcome.outcomeType}
                                    </span>
                                    {outcome.qualityCertification && (
                                        <CheckCircle className="h-4 w-4 text-green-600" title="Quality Certified" />
                                    )}
                                </div>
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {outcome.artifactLink && (
                                        <a href={`/projects/${project.id}/outcomes/${outcome.id}/download`} className="p-1.5 hover:bg-muted rounded-lg" title="Download Artifact">
                                            <Download className="h-4 w-4" />
                                        </a>
                                    )}
                                    <Link href={projectsRoutes.outcomes.edit({project: project.id, outcome: outcome.id}).url} className="p-1.5 hover:bg-muted rounded-lg" title="Edit Outcome">
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(outcome.id)}
                                        className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded-lg"
                                        title="Delete Outcome"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-semibold text-lg mb-2">{outcome.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {outcome.description}
                            </p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm">
                                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="font-medium">Project:</span>
                                    <span className="ml-1">{outcome.projectName}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(outcome.commercializationStatus)}`}>
                                        {outcome.commercializationStatus}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>Created: {new Date(outcome.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {outcomes.length === 0 && (
                    <div className="text-center py-12">
                        <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No outcomes found</h3>
                        <p className="text-muted-foreground mb-4">
                            Upload project deliverables and track commercialization progress
                        </p>
                        <Link
                            href="/outcomes/create"
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            Upload Outcome
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}