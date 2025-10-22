import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import projectsRoutes from '@/routes/projects';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import {
    Target,
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
        title: 'Outcomes',
        href: '/projects',
    },
    {
        title: 'Edit Outcome',
        href: '#',
    },
];

interface EditOutcomeProps {
    project: {
        id: string;
        title: string;
    };
    outcome: {
        id: string;
        title: string;
        description: string;
        outcome_type: string;
        quality_certification: string;
        commercialization_status: string;
        artifact_link?: string;
    };
    types: string[];
    statuses: string[];
}

export default function EditOutcome({ project, outcome, types, statuses }: EditOutcomeProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        title: outcome.title || '',
        description: outcome.description || '',
        outcome_type: outcome.outcome_type || '',
        quality_certification: outcome.quality_certification || '',
        commercialization_status: outcome.commercialization_status || '',
        artifact: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(projectsRoutes.outcomes.update({project: project.id, outcome: outcome.id}).url, {
            onSuccess: () => {
                // Success handled by redirect
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Outcome" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={`/projects/${project.id}/outcomes`}
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Outcomes
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Edit Outcome</h1>
                            <p className="text-muted-foreground">Update outcome information and deliverables</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="rounded-xl border bg-card p-6">
                        <div className="grid gap-6">
                            {/* Outcome Title */}
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-medium">
                                    Outcome Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Smart Irrigation System Prototype"
                                />
                                {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-medium">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Describe the outcome, its purpose, and key features..."
                                />
                                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                            </div>

                            {/* Outcome Type */}
                            <div className="space-y-2">
                                <label htmlFor="outcome_type" className="text-sm font-medium">
                                    Outcome Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="outcome_type"
                                    value={data.outcome_type}
                                    onChange={(e) => setData('outcome_type', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Type</option>
                                    {types.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                {errors.outcome_type && <p className="text-sm text-red-600">{errors.outcome_type}</p>}
                            </div>

                            {/* Quality Certification */}
                            <div className="space-y-2">
                                <label htmlFor="quality_certification" className="text-sm font-medium">
                                    Quality Certification
                                </label>
                                <input
                                    id="quality_certification"
                                    type="text"
                                    value={data.quality_certification}
                                    onChange={(e) => setData('quality_certification', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., ISO 9001, CE Mark, UL Certification"
                                />
                                {errors.quality_certification && <p className="text-sm text-red-600">{errors.quality_certification}</p>}
                            </div>

                            {/* Commercialization Status */}
                            <div className="space-y-2">
                                <label htmlFor="commercialization_status" className="text-sm font-medium">
                                    Commercialization Status
                                </label>
                                <select
                                    id="commercialization_status"
                                    value={data.commercialization_status}
                                    onChange={(e) => setData('commercialization_status', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Status</option>
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                                {errors.commercialization_status && <p className="text-sm text-red-600">{errors.commercialization_status}</p>}
                            </div>

                            {/* Artifact Upload */}
                            <div className="space-y-2">
                                <label htmlFor="artifact" className="text-sm font-medium">
                                    Replace Artifact File
                                </label>
                                <input
                                    id="artifact"
                                    type="file"
                                    onChange={(e) => setData('artifact', e.target.files?.[0] || null)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    accept=".pdf,.doc,.docx,.zip,.cad,.pcb,.jpg,.png"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Supported formats: PDF, DOC, DOCX, ZIP, CAD, PCB, JPG, PNG (max 20MB)
                                </p>
                                {outcome.artifact_link && (
                                    <p className="text-xs text-green-600">
                                        Current file: {outcome.artifact_link.split('/').pop()}
                                    </p>
                                )}
                                {errors.artifact && <p className="text-sm text-red-600">{errors.artifact}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-4">
                        <Link
                            href={projectsRoutes.outcomes.index(project.id).url}
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Updating...' : 'Update Outcome'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}