import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import {
    Building2,
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
        title: 'Facilities',
        href: '/facilities',
    },
    {
        title: 'Create Facility',
        href: '#',
    },
];

export default function CreateFacility() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        location: '',
        description: '',
        partner_organization: '',
        facility_type: '',
        capabilities: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/facilities', {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Facility" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/facilities"
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Facilities
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Create New Facility</h1>
                            <p className="text-muted-foreground">Add a new government partner facility or innovation lab</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="rounded-xl border bg-card p-6">
                        <div className="grid gap-6">
                            {/* Facility Name */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Facility Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Makerere University Innovation Lab"
                                />
                                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label htmlFor="location" className="text-sm font-medium">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="location"
                                    type="text"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Kampala, Uganda"
                                />
                                {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
                            </div>

                            {/* Partner Organization */}
                            <div className="space-y-2">
                                <label htmlFor="partner_organization" className="text-sm font-medium">
                                    Partner Organization
                                </label>
                                <input
                                    id="partner_organization"
                                    type="text"
                                    value={data.partner_organization}
                                    onChange={(e) => setData('partner_organization', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Makerere University, Ministry of ICT"
                                />
                                {errors.partner_organization && <p className="text-sm text-red-600">{errors.partner_organization}</p>}
                            </div>

                            {/* Facility Type */}
                            <div className="space-y-2">
                                <label htmlFor="facility_type" className="text-sm font-medium">
                                    Facility Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="facility_type"
                                    value={data.facility_type}
                                    onChange={(e) => setData('facility_type', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Facility Type</option>
                                    <option value="Lab">Laboratory</option>
                                    <option value="Workshop">Workshop</option>
                                    <option value="Testing Center">Testing Center</option>
                                    <option value="Research Center">Research Center</option>
                                </select>
                                {errors.facility_type && <p className="text-sm text-red-600">{errors.facility_type}</p>}
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
                                    placeholder="Describe the facility's purpose, equipment, and capabilities..."
                                />
                                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                            </div>

                            {/* Capabilities */}
                            <div className="space-y-2">
                                <label htmlFor="capabilities" className="text-sm font-medium">
                                    Key Capabilities
                                </label>
                                <textarea
                                    id="capabilities"
                                    value={data.capabilities}
                                    onChange={(e) => setData('capabilities', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 3D Printing, CNC Machining, Electronics Testing, IoT Development"
                                />
                                {errors.capabilities && <p className="text-sm text-red-600">{errors.capabilities}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-4">
                        <Link
                            href="/facilities"
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Creating...' : 'Create Facility'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}