import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import participantsRoutes from '@/routes/participants';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import {
    Users,
    Save,
    X,
    ArrowLeft
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Participants',
        href: participantsRoutes.index().url,
    },
    {
        title: 'Edit Participant',
        href: '#',
    },
];

interface EditParticipantProps {
    participant: {
        id: string;
        full_name: string;
        email: string;
        affiliation: string;
        specialization: string;
        participant_type: string;
        cross_skill_trained: boolean;
        institution: string;
    };
    affiliations: string[];
    specializations: string[];
    institutions: string[];
    participantTypes: string[];
}

export default function EditParticipant({ participant, affiliations, specializations, institutions, participantTypes }: EditParticipantProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        full_name: participant.full_name || '',
        email: participant.email || '',
        affiliation: participant.affiliation || '',
        specialization: participant.specialization || '',
        participant_type: participant.participant_type || '',
        cross_skill_trained: participant.cross_skill_trained || false,
        institution: participant.institution || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(participantsRoutes.update(participant.id).url, {
            onSuccess: () => {
                // Success handled by redirect
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Participant" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/participants"
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Participants
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Edit Participant</h1>
                            <p className="text-muted-foreground">Update participant information and settings</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="rounded-xl border bg-card p-6">
                        <div className="grid gap-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label htmlFor="full_name" className="text-sm font-medium">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="full_name"
                                    type="text"
                                    value={data.full_name}
                                    onChange={(e) => setData('full_name', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Dr. Sarah Nakacwa"
                                />
                                {errors.full_name && <p className="text-sm text-red-600">{errors.full_name}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., sarah.nakacwa@mak.ac.ug"
                                />
                                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                            </div>

                            {/* Affiliation */}
                            <div className="space-y-2">
                                <label htmlFor="affiliation" className="text-sm font-medium">
                                    Affiliation <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="affiliation"
                                    value={data.affiliation}
                                    onChange={(e) => setData('affiliation', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Affiliation</option>
                                    {affiliations.map((affiliation) => (
                                        <option key={affiliation} value={affiliation}>
                                            {affiliation}
                                        </option>
                                    ))}
                                </select>
                                {errors.affiliation && <p className="text-sm text-red-600">{errors.affiliation}</p>}
                            </div>

                            {/* Specialization */}
                            <div className="space-y-2">
                                <label htmlFor="specialization" className="text-sm font-medium">
                                    Specialization <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="specialization"
                                    value={data.specialization}
                                    onChange={(e) => setData('specialization', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Specialization</option>
                                    {specializations.map((specialization) => (
                                        <option key={specialization} value={specialization}>
                                            {specialization}
                                        </option>
                                    ))}
                                </select>
                                {errors.specialization && <p className="text-sm text-red-600">{errors.specialization}</p>}
                            </div>

                            {/* Participant Type */}
                            <div className="space-y-2">
                                <label htmlFor="participant_type" className="text-sm font-medium">
                                    Participant Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="participant_type"
                                    value={data.participant_type}
                                    onChange={(e) => setData('participant_type', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Type</option>
                                    {participantTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                {errors.participant_type && <p className="text-sm text-red-600">{errors.participant_type}</p>}
                            </div>

                            {/* Institution */}
                            <div className="space-y-2">
                                <label htmlFor="institution" className="text-sm font-medium">
                                    Institution <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="institution"
                                    value={data.institution}
                                    onChange={(e) => setData('institution', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Institution</option>
                                    {institutions.map((institution) => (
                                        <option key={institution} value={institution}>
                                            {institution}
                                        </option>
                                    ))}
                                </select>
                                {errors.institution && <p className="text-sm text-red-600">{errors.institution}</p>}
                            </div>

                            {/* Cross Skill Training */}
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-medium">
                                    <input
                                        type="checkbox"
                                        checked={data.cross_skill_trained}
                                        onChange={(e) => setData('cross_skill_trained', e.target.checked)}
                                        className="rounded border border-input"
                                    />
                                    <span>Cross-skill trained (has experience in multiple domains)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-4">
                        <Link
                            href={participantsRoutes.index().url}
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Updating...' : 'Update Participant'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}