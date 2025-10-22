import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import participantsRoutes from '@/routes/participants';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Users,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Mail,
    MapPin,
    GraduationCap,
    UserCheck
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Participants',
        href: participantsRoutes.index().url,
    },
];

interface Participant {
    id: string;
    fullName: string;
    email: string;
    affiliation: string;
    specialization: string;
    institution: string;
    participantType: 'Student' | 'Lecturer' | 'Collaborator';
    projectCount: number;
    status: 'active' | 'inactive';
}

interface ParticipantsProps {
    participants: Participant[];
}

export default function Participants({ participants = [] }: ParticipantsProps) {

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Student': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Lecturer': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'Collaborator': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const handleDelete = (participantId: string) => {
        if (confirm('Are you sure you want to delete this participant? This action cannot be undone.')) {
            router.delete(participantsRoutes.destroy(participantId).url, {
                onSuccess: () => {
                    // Success message will be handled by the server redirect
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Participants" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Participants</h1>
                        <p className="text-muted-foreground">Manage project participants and team members</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link
                            href={participantsRoutes.create().url}
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            Add Participant
                        </Link>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex items-center space-x-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search participants..."
                            className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option>All Types</option>
                            <option>Students</option>
                            <option>Lecturers</option>
                            <option>Collaborators</option>
                        </select>
                    </div>
                </div>

                {/* Participants Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {participants.map((participant) => (
                        <div key={participant.id} className="rounded-lg border bg-card p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium w-fit ${getTypeColor(participant.participantType)}`}>
                                            {participant.participantType}
                                        </span>
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium w-fit mt-1 ${getStatusColor(participant.status)}`}>
                                            {participant.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={participantsRoutes.edit(participant.id).url} className="p-1.5 hover:bg-muted rounded-lg" title="Edit Participant">
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(participant.id)}
                                        className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded-lg"
                                        title="Delete Participant"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-semibold text-lg mb-2">{participant.fullName}</h3>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm">
                                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="truncate">{participant.email}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>{participant.institution}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <UserCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>{participant.affiliation} • {participant.specialization}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Active Projects:</span>
                                    <span className="text-muted-foreground">{participant.projectCount}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {participants.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No participants found</h3>
                        <p className="text-muted-foreground mb-4">
                            Start by adding participants to your projects
                        </p>
                        <Link
                            href={participantsRoutes.create().url}
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            Add Participant
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}