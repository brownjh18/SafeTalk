import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import projectsRoutes from '@/routes/projects';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    Folder,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Users,
    Building2,
    Briefcase,
    Calendar,
    MapPin,
    MoreHorizontal,
    ChevronDown,
    Clock,
    CheckCircle,
    AlertCircle,
    Info,
    Star,
    GitBranch,
    Target,
    TrendingUp,
    Award,
    Zap
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Projects',
        href: projectsRoutes.index().url,
    },
];

interface Project {
    id: string;
    title: string;
    description: string;
    program: {
        name: string;
        id: string;
    };
    facility: {
        name: string;
        location: string;
        id: string;
    };
    natureOfProject: string;
    innovationFocus: string;
    prototypeStage: 'Concept' | 'Development' | 'Pilot Testing' | 'Market Launch';
    participantCount: number;
    outcomeCount: number;
    status: 'concept' | 'development' | 'testing' | 'completed';
}

interface ProjectsProps {
    projects: Project[];
}

export default function Projects({ projects = [] }: ProjectsProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProgram, setFilterProgram] = useState('All Programs');
    const [filterStage, setFilterStage] = useState('All Stages');
    const [filterStatus, setFilterStatus] = useState('All Status');

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const matchesSearch = searchTerm === '' ||
                project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.innovationFocus.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesProgram = filterProgram === 'All Programs' || project.program.name === filterProgram;

            const matchesStage = filterStage === 'All Stages' || project.prototypeStage === filterStage;

            const matchesStatus = filterStatus === 'All Status' || project.status === filterStatus.toLowerCase();

            return matchesSearch && matchesProgram && matchesStage && matchesStatus;
        });
    }, [projects, searchTerm, filterProgram, filterStage, filterStatus]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'concept': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
            case 'development': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'testing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'commercialized': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getStageColor = (stage: string) => {
        switch (stage) {
            case 'Concept': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
            case 'Development': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Pilot Testing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Market Launch': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const handleDelete = (projectId: string) => {
        if (confirm('Are you sure you want to delete this project? This action cannot be undone and will also delete all associated outcomes.')) {
            router.delete(projectsRoutes.destroy(projectId).url, {
                onSuccess: () => {
                    // Success message will be handled by the server redirect
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Projects</h1>
                        <p className="text-muted-foreground">4IR student projects at government facilities</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link
                            href={projectsRoutes.create().url}
                            className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                        >
                            <Plus className="h-4 w-4" />
                            New Project
                        </Link>
                    </div>
                </div>

                {/* Enhanced Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search projects by name, focus, or facility..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={filterProgram}
                            onChange={(e) => setFilterProgram(e.target.value)}
                            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option>All Programs</option>
                            {[...new Set(projects.map(p => p.program.name))].map(name => (
                                <option key={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={filterStage}
                            onChange={(e) => setFilterStage(e.target.value)}
                            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option>All Stages</option>
                            <option>Concept</option>
                            <option>Development</option>
                            <option>Pilot Testing</option>
                            <option>Market Launch</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option>All Status</option>
                            <option>Concept</option>
                            <option>Development</option>
                            <option>Testing</option>
                            <option>Completed</option>
                        </select>
                    </div>
                </div>

                {/* Enhanced Projects Grid */}
                <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                            {/* Project Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(project.status)}`}>
                                        {project.status}
                                    </span>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStageColor(project.prototypeStage)}`}>
                                        {project.prototypeStage}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/viewdetails?type=project&id=${project.id}`} className="p-1.5 hover:bg-muted rounded-lg" title="View Details">
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                    <Link href={projectsRoutes.edit(project.id).url} className="p-1.5 hover:bg-muted rounded-lg" title="Edit Project">
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded-lg"
                                        title="Delete Project"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Project Title and Description */}
                            <div className="mb-4">
                                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {project.description}
                                </p>
                            </div>

                            {/* Project Progress Bar */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="font-medium">Progress</span>
                                    <span className="text-muted-foreground">
                                        {project.status === 'completed' ? '100%' :
                                         project.status === 'testing' ? '75%' :
                                         project.status === 'development' ? '50%' : '25'}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${
                                            project.status === 'completed' ? 'bg-green-600 w-full' :
                                            project.status === 'testing' ? 'bg-yellow-600 w-3/4' :
                                            project.status === 'development' ? 'bg-blue-600 w-1/2' : 'bg-gray-600 w-1/4'
                                        }`}
                                    ></div>
                                </div>
                            </div>

                            {/* Project Details */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Program:</span>
                                    </div>
                                    <span className="text-muted-foreground">{project.program.name}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Facility:</span>
                                    </div>
                                    <span className="text-muted-foreground">{project.facility.name}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Location:</span>
                                    </div>
                                    <span className="text-muted-foreground">{project.facility.location}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Team:</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className="text-muted-foreground">{project.participantCount} participants</span>
                                        <div className="flex -space-x-1">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white dark:border-gray-800"></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Project Footer */}
                            <div className="pt-4 border-t space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Innovation Focus:</span>
                                    <span className="text-muted-foreground bg-muted px-2 py-1 rounded">{project.innovationFocus}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Outcomes:</span>
                                    <div className="flex items-center space-x-2">
                                        <Target className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">{project.outcomeCount} deliverables</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Last Activity:</span>
                                    <span className="text-muted-foreground">2 days ago</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <div className="text-center py-12">
                        <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            {projects.length === 0 ? 'No projects found' : 'No projects match your search'}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {projects.length === 0
                                ? 'Start by creating your first 4IR innovation project'
                                : 'Try adjusting your search terms or filters'
                            }
                        </p>
                        {projects.length === 0 && (
                            <Link
                                href={projectsRoutes.create().url}
                                className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                            >
                                <Plus className="h-4 w-4" />
                                Create Project
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}