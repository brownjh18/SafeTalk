import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import {
    Save,
    X,
    ArrowLeft
} from 'lucide-react';

interface Program {
    program_id: string;
    name: string;
}

interface Facility {
    facility_id: string;
    name: string;
    location: string;
}

interface Props {
    programs: Program[];
    facilities: Facility[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Projects',
        href: '/projects',
    },
    {
        title: 'Create Project',
        href: '#',
    },
];

export default function CreateProject({ programs, facilities }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        program_id: '',
        facility: '',
        title: '',
        nature_of_project: '',
        description: '',
        innovation_focus: '',
        prototype_stage: '',
        testing_requirements: '',
        commercialization_plan: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/projects', {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Project" />
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
                            <h1 className="text-3xl font-bold">Create New Project</h1>
                            <p className="text-muted-foreground">Add a new project to the system</p>
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
                                <label htmlFor="facility" className="text-sm font-medium">
                                    Facility
                                </label>
                                <select
                                    id="facility"
                                    value={data.facility}
                                    onChange={(e) => setData('facility', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Facility</option>
                                    {facilities.map((facility) => (
                                        <option key={facility.facility_id} value={facility.facility_id}>
                                            {facility.name} - {facility.location}
                                        </option>
                                    ))}
                                </select>
                                {errors.facility && <p className="text-sm text-red-600">{errors.facility}</p>}
                            </div>

                            {/* Title */}
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-medium">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Smart Irrigation System"
                                />
                                {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                            </div>

                            {/* Nature of Project */}
                            <div className="space-y-2">
                                <label htmlFor="nature_of_project" className="text-sm font-medium">
                                    Nature of Project <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="nature_of_project"
                                    type="text"
                                    value={data.nature_of_project}
                                    onChange={(e) => setData('nature_of_project', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Hardware, Software, Research"
                                />
                                {errors.nature_of_project && <p className="text-sm text-red-600">{errors.nature_of_project}</p>}
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
                                    placeholder="Describe the project, its goals, and key features..."
                                />
                                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                            </div>

                            {/* Innovation Focus */}
                            <div className="space-y-2">
                                <label htmlFor="innovation_focus" className="text-sm font-medium">
                                    Innovation Focus
                                </label>
                                <input
                                    id="innovation_focus"
                                    type="text"
                                    value={data.innovation_focus}
                                    onChange={(e) => setData('innovation_focus', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., AI, IoT, Sustainability"
                                />
                                {errors.innovation_focus && <p className="text-sm text-red-600">{errors.innovation_focus}</p>}
                            </div>

                            {/* Prototype Stage */}
                            <div className="space-y-2">
                                <label htmlFor="prototype_stage" className="text-sm font-medium">
                                    Prototype Stage
                                </label>
                                <select
                                    id="prototype_stage"
                                    value={data.prototype_stage}
                                    onChange={(e) => setData('prototype_stage', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Stage</option>
                                    <option value="Concept">Concept</option>
                                    <option value="Development">Development</option>
                                    <option value="Pilot Testing">Pilot Testing</option>
                                    <option value="Market Launch">Market Launch</option>
                                </select>
                                {errors.prototype_stage && <p className="text-sm text-red-600">{errors.prototype_stage}</p>}
                            </div>

                            {/* Testing Requirements */}
                            <div className="space-y-2">
                                <label htmlFor="testing_requirements" className="text-sm font-medium">
                                    Testing Requirements
                                </label>
                                <textarea
                                    id="testing_requirements"
                                    value={data.testing_requirements}
                                    onChange={(e) => setData('testing_requirements', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Describe any testing needs..."
                                />
                                {errors.testing_requirements && <p className="text-sm text-red-600">{errors.testing_requirements}</p>}
                            </div>

                            {/* Commercialization Plan */}
                            <div className="space-y-2">
                                <label htmlFor="commercialization_plan" className="text-sm font-medium">
                                    Commercialization Plan
                                </label>
                                <textarea
                                    id="commercialization_plan"
                                    value={data.commercialization_plan}
                                    onChange={(e) => setData('commercialization_plan', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Outline the plan for commercialization..."
                                />
                                {errors.commercialization_plan && <p className="text-sm text-red-600">{errors.commercialization_plan}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-4">
                        <Link
                            href="/projects"
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
                            {processing ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
