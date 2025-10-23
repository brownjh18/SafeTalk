import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    Target,
    Plus,
    Search,
    Filter,
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
    projectId: string;
    outcomeType: 'CAD' | 'PCB' | 'Prototype' | 'Report' | 'Business Plan';
    commercializationStatus: 'Demoed' | 'Market Linked' | 'Launched';
    qualityCertification: boolean;
    artifactLink?: string;
    createdAt: string;
}

interface OutcomesIndexProps {
    outcomes: Outcome[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Outcomes',
        href: '#',
    },
];

export default function OutcomesIndex({ outcomes }: OutcomesIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All Types');

    const filteredOutcomes = useMemo(() => {
        return outcomes.filter((outcome) => {
            // Search filter
            const matchesSearch = searchTerm === '' ||
                outcome.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                outcome.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                outcome.projectName.toLowerCase().includes(searchTerm.toLowerCase());

            // Type filter
            const matchesType = filterType === 'All Types' || outcome.outcomeType === filterType;

            return matchesSearch && matchesType;
        });
    }, [outcomes, searchTerm, filterType]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Launched': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Market Linked': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Demoed': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Prototype': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
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
                        <h1 className="text-3xl font-bold">All Outcomes</h1>
                        <p className="text-muted-foreground">Track deliverables, prototypes, and commercialization progress across all projects</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            View Projects
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <label htmlFor="outcome-filter" className="sr-only">Filter outcomes by type</label>
                        <select
                            id="outcome-filter"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option>All Types</option>
                            <option>CAD</option>
                            <option>PCB</option>
                            <option>Prototype</option>
                            <option>Report</option>
                            <option>Business Plan</option>
                        </select>
                    </div>
                </div>

                {/* Outcomes Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredOutcomes.map((outcome) => (
                        <div key={outcome.id} className="rounded-lg border bg-card p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getTypeColor(outcome.outcomeType)}`}>
                                        {outcome.outcomeType}
                                    </span>
                                    {outcome.qualityCertification && (
                                        <div title="Quality Certified">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {outcome.artifactLink && (
                                        <a href={`/storage/${outcome.artifactLink}`} className="p-1.5 hover:bg-muted rounded-lg" title="Download Artifact">
                                            <Download className="h-4 w-4" />
                                        </a>
                                    )}
                                    <Link href={`/projects/${outcome.projectId}/outcomes/${outcome.id}`} className="p-1.5 hover:bg-muted rounded-lg" title="View Outcome">
                                        <Eye className="h-4 w-4" />
                                    </Link>
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
                {filteredOutcomes.length === 0 && (
                    <div className="text-center py-12">
                        <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            {outcomes.length === 0 ? 'No outcomes found' : 'No outcomes match your search'}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {outcomes.length === 0
                                ? 'Upload project deliverables and track commercialization progress'
                                : 'Try adjusting your search terms or filters'
                            }
                        </p>
                        {outcomes.length === 0 && (
                            <Link
                                href="/projects"
                                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4" />
                                View Projects
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}