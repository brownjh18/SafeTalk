import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import programsRoutes from '@/routes/programs';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import {
    Briefcase,
    Save,
    X,
    ArrowLeft
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
    {
        title: 'Create Program',
        href: '#',
    },
];

export default function CreateProgram() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        national_alignment: '',
        focus_areas: '',
        phases: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(programsRoutes.store().url, {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Program" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={programsRoutes.index().url}
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Programs
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Create New Program</h1>
                            <p className="text-muted-foreground">Add a new NDPIII-aligned innovation program</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="rounded-xl border bg-card p-6">
                        <div className="grid gap-6">
                            {/* Program Name */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Program Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Digital Health Innovation Program"
                                />
                                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
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
                                    placeholder="Describe the program's objectives, scope, and expected outcomes..."
                                />
                                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                            </div>

                            {/* National Alignment */}
                            <div className="space-y-2">
                                <label htmlFor="national_alignment" className="text-sm font-medium">
                                    National Alignment <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="national_alignment"
                                    value={data.national_alignment}
                                    onChange={(e) => setData('national_alignment', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select NDPIII Alignment</option>
                                    <option value="NDPIII Health Sector Priority">NDPIII Health Sector Priority</option>
                                    <option value="NDPIII Agriculture Modernization">NDPIII Agriculture Modernization</option>
                                    <option value="Digital Transformation Roadmap">Digital Transformation Roadmap</option>
                                    <option value="4IR Strategy">4IR Strategy</option>
                                    <option value="National ICT Policy">National ICT Policy</option>
                                </select>
                                {errors.national_alignment && <p className="text-sm text-red-600">{errors.national_alignment}</p>}
                            </div>

                            {/* Focus Areas */}
                            <div className="space-y-2">
                                <label htmlFor="focus_areas" className="text-sm font-medium">
                                    Focus Areas <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="focus_areas"
                                    type="text"
                                    value={data.focus_areas}
                                    onChange={(e) => setData('focus_areas', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Telemedicine, Health Information Systems, Medical IoT"
                                />
                                {errors.focus_areas && <p className="text-sm text-red-600">{errors.focus_areas}</p>}
                            </div>

                            {/* Phases */}
                            <div className="space-y-2">
                                <label htmlFor="phases" className="text-sm font-medium">
                                    Implementation Phases <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="phases"
                                    type="text"
                                    value={data.phases}
                                    onChange={(e) => setData('phases', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Research → Prototype → Pilot → Scale"
                                />
                                {errors.phases && <p className="text-sm text-red-600">{errors.phases}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-4">
                        <Link
                            href={programsRoutes.index().url}
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Creating...' : 'Create Program'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}