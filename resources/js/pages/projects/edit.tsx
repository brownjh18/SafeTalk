import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import projectsRoutes from '@/routes/projects';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import {
    Folder,
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
        title: 'Projects',
        href: projectsRoutes.index().url,
    },
    {
        title: 'Edit Project',
        href: '#',
    },
];

interface EditProjectProps {
    project: {
        id: string;
        title: string;
        description: string;
        program_id: string;
        facility_id: string;
        natureOfProject: string;
        innovationFocus: string;
        prototypeStage: string;
        testingRequirements: string;
        commercializationPlan: string;
    };
    programs: Array<{
        program_id: string;
        name: string;
    }>;
    facilities: Array<{
        facility_id: string;
        name: string;
        location: string;
    }>;
}

export default function EditProject({ project, programs, facilities }: EditProjectProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        program_id: project.program_id || '',
        facility_id: project.facility_id || '',
        title: project.title || '',
        natureOfProject: project.natureOfProject || '',
        description: project.description || '',
        innovationFocus: project.innovationFocus || '',
        prototypeStage: project.prototypeStage || '',
        testingRequirements: project.testingRequirements || '',
        commercializationPlan: project.commercializationPlan || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(projectsRoutes.update(project.id).url, {
            onSuccess: () => {
                // Success handled by redirect
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Project" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Projects
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Edit Project</h1>
                            <p className="text-muted-foreground">Update project information and settings</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="rounded-xl border bg-card p-6">
                        <div className="grid gap-6">
                            {/* Program Selection */}
                            <div className="space-y-2">
                                <label htmlFor="program_id" className="text-sm font-medium">
                                    Program <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="program_id"
                                    value={data.program_id}
                                    onChange={(e) => setData('program_id', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Program</option>
                                    {programs.map((program) => (
                                        <option key={program.program_id} value={program.program_id}>
                                            {program.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.program_id && <p className="text-sm text-red-600">{errors.program_id}</p>}
                            </div>

                            {/* Facility Selection */}
                            <div className="space-y-2">
                                <label htmlFor="facility_id" className="text-sm font-medium">
                                    Facility
                                </label>
                                <select
                                    id="facility_id"
                                    value={data.facility_id}
                                    onChange={(e) => setData('facility_id', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Facility (Optional)</option>
                                    {facilities.map((facility) => (
                                        <option key={facility.facility_id} value={facility.facility_id}>
                                            {facility.name} - {facility.location}
                                        </option>
                                    ))}
                                </select>
                                {errors.facility_id && <p className="text-sm text-red-600">{errors.facility_id}</p>}
                            </div>

                            {/* Project Title */}
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-medium">
                                    Project Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Telemedicine Platform for Rural Health Centers"
                                />
                                {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                            </div>

                            {/* Nature of Project */}
                            <div className="space-y-2">
                                <label htmlFor="natureOfProject" className="text-sm font-medium">
                                    Nature of Project <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="natureOfProject"
                                    value={data.natureOfProject}
                                    onChange={(e) => setData('natureOfProject', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Project Nature</option>
                                    <option value="Research">Research</option>
                                    <option value="Prototype Development">Prototype Development</option>
                                    <option value="Applied Research">Applied Research</option>
                                    <option value="Product Development">Product Development</option>
                                </select>
                                {errors.natureOfProject && <p className="text-sm text-red-600">{errors.natureOfProject}</p>}
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
                                    placeholder="Describe the project objectives, methodology, and expected outcomes..."
                                />
                                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                            </div>

                            {/* Innovation Focus */}
                            <div className="space-y-2">
                                <label htmlFor="innovationFocus" className="text-sm font-medium">
                                    Innovation Focus
                                </label>
                                <input
                                    id="innovationFocus"
                                    type="text"
                                    value={data.innovationFocus}
                                    onChange={(e) => setData('innovationFocus', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Healthcare Technology, Mobile Applications"
                                />
                                {errors.innovationFocus && <p className="text-sm text-red-600">{errors.innovationFocus}</p>}
                            </div>

                            {/* Prototype Stage */}
                            <div className="space-y-2">
                                <label htmlFor="prototypeStage" className="text-sm font-medium">
                                    Prototype Stage
                                </label>
                                <select
                                    id="prototypeStage"
                                    value={data.prototypeStage}
                                    onChange={(e) => setData('prototypeStage', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Stage</option>
                                    <option value="Concept">Concept</option>
                                    <option value="Design">Design</option>
                                    <option value="Development">Development</option>
                                    <option value="Testing">Testing</option>
                                    <option value="Pilot">Pilot</option>
                                    <option value="Market Launch">Market Launch</option>
                                </select>
                                {errors.prototypeStage && <p className="text-sm text-red-600">{errors.prototypeStage}</p>}
                            </div>

                            {/* Testing Requirements */}
                            <div className="space-y-2">
                                <label htmlFor="testingRequirements" className="text-sm font-medium">
                                    Testing Requirements
                                </label>
                                <textarea
                                    id="testingRequirements"
                                    value={data.testingRequirements}
                                    onChange={(e) => setData('testingRequirements', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Describe testing requirements, methodologies, and success criteria..."
                                />
                                {errors.testingRequirements && <p className="text-sm text-red-600">{errors.testingRequirements}</p>}
                            </div>

                            {/* Commercialization Plan */}
                            <div className="space-y-2">
                                <label htmlFor="commercializationPlan" className="text-sm font-medium">
                                    Commercialization Plan
                                </label>
                                <textarea
                                    id="commercializationPlan"
                                    value={data.commercializationPlan}
                                    onChange={(e) => setData('commercializationPlan', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Outline the plan for commercialization, market entry, and scaling..."
                                />
                                {errors.commercializationPlan && <p className="text-sm text-red-600">{errors.commercializationPlan}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-4">
                        <Link
                            href={projectsRoutes.index().url}
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Updating...' : 'Update Project'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}