import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import programsRoutes from '@/routes/programs';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    Briefcase,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Building2,
    Users,
    Target,
    MoreHorizontal,
    ChevronDown,
    Calendar,
    CheckCircle,
    Clock,
    TrendingUp,
    Award,
    BookOpen,
    Lightbulb,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Programs',
        href: programsRoutes.index().url,
    },
];

interface Program {
    id: string;
    name: string;
    description: string;
    nationalAlignment: string;
    focusAreas: string;
    phases: string;
    projectCount: number;
    status: 'active' | 'planning' | 'completed' | 'on hold';
}

interface ProgramsProps {
    programs: Program[];
}

export default function Programs({ programs = [] }: ProgramsProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All Status');
    const [filterAlignment, setFilterAlignment] = useState('All Alignments');

    const filteredPrograms = useMemo(() => {
        return programs.filter((program) => {
            const matchesSearch = searchTerm === '' ||
                program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                program.nationalAlignment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                program.focusAreas.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = filterStatus === 'All Status' || program.status === filterStatus.toLowerCase().replace(' ', '');

            const matchesAlignment = filterAlignment === 'All Alignments' || program.nationalAlignment.toLowerCase().includes(filterAlignment.toLowerCase());

            return matchesSearch && matchesStatus && matchesAlignment;
        });
    }, [programs, searchTerm, filterStatus, filterAlignment]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'planning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const handleDelete = (programId: string) => {
        if (confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
            router.delete(programsRoutes.destroy(programId).url, {
                onSuccess: () => {
                    // Success message will be handled by the server redirect
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Programs" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Programs</h1>
                        <p className="text-muted-foreground">Manage NDPIII-aligned innovation programs</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link
                            href={programsRoutes.create().url}
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            New Program
                        </Link>
                    </div>
                </div>

                {/* Enhanced Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search programs by name, alignment, or focus areas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Planning</option>
                            <option>Completed</option>
                            <option>On Hold</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={filterAlignment}
                            onChange={(e) => setFilterAlignment(e.target.value)}
                            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option>All Alignments</option>
                            <option>NDPIII Health Sector</option>
                            <option>NDPIII Agriculture</option>
                            <option>Digital Transformation</option>
                            <option>4IR Strategy</option>
                        </select>
                    </div>
                </div>

                {/* Enhanced Programs Grid */}
                <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {filteredPrograms.map((program) => (
                        <div key={program.id} className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                            {/* Program Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-lg bg-blue-600 p-2">
                                        <Briefcase className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium w-fit ${getStatusColor(program.status)}`}>
                                            {program.status}
                                        </span>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <Award className="h-3 w-3 text-yellow-600" />
                                            <span className="text-xs text-muted-foreground">NDPIII Aligned</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/viewdetails?type=program&id=${program.id}`} className="p-1.5 hover:bg-muted rounded-lg" title="View Details">
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                    <Link href={programsRoutes.edit(program.id).url} className="p-1.5 hover:bg-muted rounded-lg" title="Edit Program">
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(program.id)}
                                        className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded-lg"
                                        title="Delete Program"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Program Content */}
                            <div className="mb-4">
                                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">{program.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                    {program.description}
                                </p>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="font-medium">Implementation Progress</span>
                                        <span className="text-muted-foreground">
                                            {program.status === 'completed' ? '100%' :
                                             program.status === 'active' ? '65%' : '25'}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${
                                                program.status === 'completed' ? 'bg-green-600 w-full' :
                                                program.status === 'active' ? 'bg-blue-600 w-2/3' : 'bg-yellow-600 w-1/4'
                                            }`}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Program Details */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Target className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Alignment:</span>
                                    </div>
                                    <span className="text-muted-foreground bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded text-xs">
                                        {program.nationalAlignment}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Projects:</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-muted-foreground">{program.projectCount} active</span>
                                        <div className="flex -space-x-1">
                                            {[1, 2, 3].slice(0, Math.min(program.projectCount, 3)).map((i) => (
                                                <div key={i} className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-blue-500 border border-white dark:border-gray-800"></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Lightbulb className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Focus Areas:</span>
                                    </div>
                                    <span className="text-muted-foreground text-xs">{program.focusAreas}</span>
                                </div>
                            </div>

                            {/* Program Footer */}
                            <div className="pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        <span>Updated 3 days ago</span>
                                    </div>
                                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                        View Projects →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredPrograms.length === 0 && (
                    <div className="text-center py-12">
                        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            {programs.length === 0 ? 'No programs found' : 'No programs match your search'}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {programs.length === 0
                                ? 'Get started by creating your first NDPIII-aligned program'
                                : 'Try adjusting your search terms or filters'
                            }
                        </p>
                        {programs.length === 0 && (
                            <Link
                                href={programsRoutes.create().url}
                                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4" />
                                Create Program
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}