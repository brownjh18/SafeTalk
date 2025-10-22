import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
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
        href: '/participants',
    },
    {
        title: 'Create Participant',
        href: '#',
    },
];

export default function CreateParticipant() {
    const { data, setData, post, processing, errors, reset } = useForm({
        full_name: '',
        email: '',
        affiliation: '',
        specialization: '',
        participant_type: '',
        cross_skill_trained: false,
        institution: '',
        project_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/participants', {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Participant" />
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
                            <h1 className="text-3xl font-bold">Create New Participant</h1>
                            <p className="text-muted-foreground">Add a new student, lecturer, or industry collaborator</p>
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
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Software Engineering">Software Engineering</option>
                                    <option value="Electrical Engineering">Electrical Engineering</option>
                                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                                    <option value="Business">Business</option>
                                    <option value="Design">Design</option>
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
                                    <option value="Software Development">Software Development</option>
                                    <option value="Hardware Engineering">Hardware Engineering</option>
                                    <option value="Mobile Development">Mobile Development</option>
                                    <option value="Embedded Systems">Embedded Systems</option>
                                    <option value="Business Analysis">Business Analysis</option>
                                    <option value="UI/UX Design">UI/UX Design</option>
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
                                    <option value="Student">Student</option>
                                    <option value="Lecturer">Lecturer</option>
                                    <option value="Collaborator">Collaborator</option>
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
                                    <option value="Makerere University">Makerere University</option>
                                    <option value="Kyambogo University">Kyambogo University</option>
                                    <option value="Uganda Christian University">Uganda Christian University</option>
                                    <option value="Kiira Motors Corporation">Kiira Motors Corporation</option>
                                    <option value="Ministry of ICT">Ministry of ICT</option>
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

                            {/* Project Assignment */}
                            <div className="space-y-2">
                                <label htmlFor="project_id" className="text-sm font-medium">
                                    Assign to Project
                                </label>
                                <select
                                    id="project_id"
                                    value={data.project_id}
                                    onChange={(e) => setData('project_id', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Project (Optional)</option>
                                    <option value="1">Telemedicine Platform</option>
                                    <option value="2">Smart Irrigation System</option>
                                    <option value="3">E-Government Portal</option>
                                </select>
                                {errors.project_id && <p className="text-sm text-red-600">{errors.project_id}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-4">
                        <Link
                            href="/participants"
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
                            {processing ? 'Creating...' : 'Create Participant'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}