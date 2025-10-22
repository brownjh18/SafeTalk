import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import equipmentRoutes from '@/routes/equipment';
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
        href: equipmentRoutes.index().url,
    },
    {
        title: 'Edit Equipment',
        href: '#',
    },
];

interface EditEquipmentProps {
    equipment: {
        id: string;
        name: string;
        description: string;
        facility_id: string;
        inventory_code: string;
        usage_domain: string;
        support_phase: string;
        capabilities: string;
    };
    usageDomains: string[];
    supportPhases: string[];
    facilities: Array<{
        facility_id: string;
        name: string;
        location: string;
    }>;
}

export default function EditEquipment({ equipment, usageDomains, supportPhases, facilities }: EditEquipmentProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        facility_id: equipment.facility_id || '',
        name: equipment.name || '',
        description: equipment.description || '',
        inventory_code: equipment.inventory_code || '',
        usage_domain: equipment.usage_domain || '',
        support_phase: equipment.support_phase || '',
        capabilities: equipment.capabilities || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(equipmentRoutes.update(equipment.id).url, {
            onSuccess: () => {
                // Success handled by redirect
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Equipment" />
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
                            <h1 className="text-3xl font-bold">Edit Equipment</h1>
                            <p className="text-muted-foreground">Update equipment information and settings</p>
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
                                    {facilities.map((facility) => (
                                        <option key={facility.facility_id} value={facility.facility_id}>
                                            {facility.name} - {facility.location}
                                        </option>
                                    ))}
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
                                    {usageDomains.map((domain) => (
                                        <option key={domain} value={domain}>
                                            {domain}
                                        </option>
                                    ))}
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
                                    {supportPhases.map((phase) => (
                                        <option key={phase} value={phase}>
                                            {phase}
                                        </option>
                                    ))}
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
                            href={equipmentRoutes.index().url}
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
                            {processing ? 'Updating...' : 'Update Equipment'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}