import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import {
    Settings,
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
        title: 'Services',
        href: '/services',
    },
    {
        title: 'Create Service',
        href: '#',
    },
];

export default function CreateService() {
    const { data, setData, post, processing, errors, reset } = useForm({
        facility_id: '',
        name: '',
        description: '',
        category: '',
        skill_type: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/services', {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Service" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Services
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Create New Service</h1>
                            <p className="text-muted-foreground">Add a new technical service or training program</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="rounded-xl border bg-card p-6">
                        <div className="grid gap-6">
                            {/* Facility Selection */}
                            <div className="space-y-2">
                                <label htmlFor="facility_id" className="text-sm font-medium">
                                    Facility <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="facility_id"
                                    value={data.facility_id}
                                    onChange={(e) => setData('facility_id', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Facility</option>
                                    <option value="1">Makerere University Innovation Lab</option>
                                    <option value="2">Agricultural Research Center</option>
                                    <option value="3">National ICT Innovation Hub</option>
                                </select>
                                {errors.facility_id && <p className="text-sm text-red-600">{errors.facility_id}</p>}
                            </div>

                            {/* Service Name */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Service Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 3D Printing & Prototyping"
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
                                    placeholder="Describe the service, its benefits, and how to access it..."
                                />
                                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label htmlFor="category" className="text-sm font-medium">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Machining">Machining</option>
                                    <option value="Testing">Testing</option>
                                    <option value="Training">Training</option>
                                    <option value="Consultation">Consultation</option>
                                    <option value="Prototyping">Prototyping</option>
                                </select>
                                {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
                            </div>

                            {/* Skill Type */}
                            <div className="space-y-2">
                                <label htmlFor="skill_type" className="text-sm font-medium">
                                    Skill Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="skill_type"
                                    value={data.skill_type}
                                    onChange={(e) => setData('skill_type', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Skill Type</option>
                                    <option value="Hardware">Hardware</option>
                                    <option value="Software">Software</option>
                                    <option value="Integration">Integration</option>
                                    <option value="Business">Business</option>
                                </select>
                                {errors.skill_type && <p className="text-sm text-red-600">{errors.skill_type}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-4">
                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Creating...' : 'Create Service'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}