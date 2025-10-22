import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import facilitiesRoutes from '@/routes/facilities';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Building2,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    MapPin,
    Users,
    Wrench,
    Settings,
    Phone,
    Mail,
    Globe,
    MoreHorizontal,
    ExternalLink,
    Star,
    Clock,
    CheckCircle,
    AlertTriangle,
    Info,
    Zap,
    Shield,
    Wifi
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Facilities',
        href: facilitiesRoutes.index().url,
    },
];

interface Facility {
    id: string;
    name: string;
    location: string;
    description: string;
    partnerOrganization: string;
    facilityType: 'Lab' | 'Workshop' | 'Testing Center' | 'Research Center';
    capabilities: string[];
    serviceCount: number;
    equipmentCount: number;
    projectCount: number;
    contactEmail: string;
    contactPhone: string;
    website?: string;
    status: 'active' | 'maintenance' | 'planning';
}

interface FacilitiesProps {
    facilities: Facility[];
    types: string[];
    partners: string[];
}

export default function Facilities({ facilities = [], types = [], partners = [] }: FacilitiesProps) {

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'planning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Lab': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Workshop': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
            case 'Testing Center': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'Research Center': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const handleDelete = (facilityId: string) => {
        if (confirm('Are you sure you want to delete this facility? This action cannot be undone and may affect associated projects and services.')) {
            router.delete(facilitiesRoutes.destroy(facilityId).url, {
                onSuccess: () => {
                    // Success message will be handled by the server redirect
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Facilities" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Facilities</h1>
                        <p className="text-muted-foreground">Government partner sites and innovation labs</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link
                            href={facilitiesRoutes.create().url}
                            className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                        >
                            <Plus className="h-4 w-4" />
                            Add Facility
                        </Link>
                    </div>
                </div>

                {/* Enhanced Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search facilities by name, location, or capabilities..."
                            className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>All Types</option>
                            <option>Lab</option>
                            <option>Workshop</option>
                            <option>Testing Center</option>
                            <option>Research Center</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Maintenance</option>
                            <option>Planning</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <select className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>All Locations</option>
                            <option>Kampala</option>
                            <option>Wakiso</option>
                            <option>Jinja</option>
                            <option>Mbarara</option>
                        </select>
                    </div>
                </div>

                {/* Enhanced Facilities Grid */}
                <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {facilities.map((facility) => (
                        <div key={facility.id} className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                            {/* Facility Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-lg bg-purple-600 p-2">
                                        <Building2 className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center space-x-2">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(facility.status)}`}>
                                                {facility.status}
                                            </span>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getTypeColor(facility.facilityType)}`}>
                                                {facility.facilityType}
                                            </span>
                                        </div>
                                        {facility.status === 'active' && (
                                            <div className="flex items-center space-x-1 mt-1">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                <span className="text-xs text-green-600 dark:text-green-400">Operational</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={facilitiesRoutes.edit(facility.id).url} className="p-1.5 hover:bg-muted rounded-lg" title="Edit Facility">
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(facility.id)}
                                        className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded-lg"
                                        title="Delete Facility"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Facility Content */}
                            <div className="mb-4">
                                <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition-colors">{facility.name}</h3>
                                <div className="flex items-center text-sm text-muted-foreground mb-3">
                                    <MapPin className="h-4 w-4 mr-2 text-purple-600" />
                                    {facility.location}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                    {facility.description}
                                </p>
                            </div>

                            {/* Facility Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="text-center p-3 rounded-lg bg-muted/50">
                                    <div className="flex items-center justify-center space-x-1 mb-1">
                                        <Wrench className="h-4 w-4 text-blue-600" />
                                        <span className="text-lg font-bold text-blue-600">{facility.equipmentCount}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Equipment</p>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-muted/50">
                                    <div className="flex items-center justify-center space-x-1 mb-1">
                                        <Settings className="h-4 w-4 text-green-600" />
                                        <span className="text-lg font-bold text-green-600">{facility.serviceCount}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Services</p>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-muted/50">
                                    <div className="flex items-center justify-center space-x-1 mb-1">
                                        <Users className="h-4 w-4 text-orange-600" />
                                        <span className="text-lg font-bold text-orange-600">{facility.projectCount}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Projects</p>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-muted/50">
                                    <div className="flex items-center justify-center space-x-1 mb-1">
                                        <Star className="h-4 w-4 text-yellow-600" />
                                        <span className="text-lg font-bold text-yellow-600">4.8</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Rating</p>
                                </div>
                            </div>

                            {/* Capabilities */}
                            <div className="mb-4">
                                <p className="text-xs font-medium text-muted-foreground mb-2">Key Capabilities:</p>
                                <div className="flex flex-wrap gap-1">
                                    {facility.capabilities.slice(0, 3).map((capability, index) => (
                                        <span key={index} className="inline-flex items-center rounded-md bg-purple-50 dark:bg-purple-950 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-300">
                                            {capability}
                                        </span>
                                    ))}
                                    {facility.capabilities.length > 3 && (
                                        <span className="inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-900 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                                            +{facility.capabilities.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="pt-4 border-t space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Contact:</span>
                                    </div>
                                    <a href={`mailto:${facility.contactEmail}`} className="text-blue-600 hover:text-blue-700 text-xs hover:underline">
                                        {facility.contactEmail}
                                    </a>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Phone:</span>
                                    </div>
                                    <a href={`tel:${facility.contactPhone}`} className="text-blue-600 hover:text-blue-700 text-xs hover:underline">
                                        {facility.contactPhone}
                                    </a>
                                </div>
                                {facility.website && (
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Globe className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Website:</span>
                                        </div>
                                        <a href={facility.website} target="_blank" rel="noopener" className="text-blue-600 hover:text-blue-700 text-xs hover:underline flex items-center">
                                            Visit Site <ExternalLink className="h-3 w-3 ml-1" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {facilities.length === 0 && (
                    <div className="text-center py-12">
                        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No facilities found</h3>
                        <p className="text-muted-foreground mb-4">
                            Add government facilities and innovation labs to get started
                        </p>
                        <Link
                            href={facilitiesRoutes.create().url}
                            className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                        >
                            <Plus className="h-4 w-4" />
                            Add Facility
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}