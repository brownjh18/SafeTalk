import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import {
    Wrench,
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
        title: 'Equipment',
        href: '/equipment',
    },
    {
        title: 'Create Equipment',
        href: '#',
    },
];

export default function CreateEquipment() {
    const { data, setData, post, processing, errors, reset } = useForm({
        facility_id: '',
        name: '',
        description: '',
        inventory_code: '',
        usage_domain: '',
        support_phase: '',
        capabilities: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/equipment', {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Equipment" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/equipment"
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Equipment
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Create New Equipment</h1>
                            <p className="text-muted-foreground">Add new lab equipment or prototyping tools</p>
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

                            {/* Equipment Name */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Equipment Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Ultimaker S5 3D Printer"
                                />
                                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Inventory Code */}
                            <div className="space-y-2">
                                <label htmlFor="inventory_code" className="text-sm font-medium">
                                    Inventory Code
                                </label>
                                <input
                                    id="inventory_code"
                                    type="text"
                                    value={data.inventory_code}
                                    onChange={(e) => setData('inventory_code', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 3DP-001"
                                />
                                {errors.inventory_code && <p className="text-sm text-red-600">{errors.inventory_code}</p>}
                            </div>

                            {/* Usage Domain */}
                            <div className="space-y-2">
                                <label htmlFor="usage_domain" className="text-sm font-medium">
                                    Usage Domain
                                </label>
                                <select
                                    id="usage_domain"
                                    value={data.usage_domain}
                                    onChange={(e) => setData('usage_domain', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Domain</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Mechanical">Mechanical</option>
                                    <option value="IoT">IoT</option>
                                    <option value="Software">Software</option>
                                    <option value="Testing">Testing</option>
                                </select>
                                {errors.usage_domain && <p className="text-sm text-red-600">{errors.usage_domain}</p>}
                            </div>

                            {/* Support Phase */}
                            <div className="space-y-2">
                                <label htmlFor="support_phase" className="text-sm font-medium">
                                    Support Phase
                                </label>
                                <select
                                    id="support_phase"
                                    value={data.support_phase}
                                    onChange={(e) => setData('support_phase', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Phase</option>
                                    <option value="Training">Training</option>
                                    <option value="Prototyping">Prototyping</option>
                                    <option value="Testing">Testing</option>
                                    <option value="Commercialization">Commercialization</option>
                                </select>
                                {errors.support_phase && <p className="text-sm text-red-600">{errors.support_phase}</p>}
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
                                    placeholder="Describe the equipment's specifications, capabilities, and usage guidelines..."
                                />
                                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                            </div>

                            {/* Capabilities */}
                            <div className="space-y-2">
                                <label htmlFor="capabilities" className="text-sm font-medium">
                                    Capabilities
                                </label>
                                <textarea
                                    id="capabilities"
                                    value={data.capabilities}
                                    onChange={(e) => setData('capabilities', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 3D Printing, Dual Extrusion, Large Scale Printing, ABS/PLA/PETG Materials"
                                />
                                {errors.capabilities && <p className="text-sm text-red-600">{errors.capabilities}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-4">
                        <Link
                            href="/equipment"
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Creating...' : 'Create Equipment'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}