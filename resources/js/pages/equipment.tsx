import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import equipmentRoutes from '@/routes/equipment';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    Wrench,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Building2,
    Cpu,
    HardDrive,
    Monitor,
    Zap,
    Calendar,
    Tag,
    AlertTriangle,
    Users,
    MoreHorizontal,
    Clock,
    CheckCircle,
    Star,
    TrendingUp,
    ExternalLink,
    ArrowUpRight,
    ArrowDownRight,
    Gauge,
    Battery,
    Shield
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Equipment',
        href: equipmentRoutes.index().url,
    },
];

interface Equipment {
    id: string;
    name: string;
    description: string;
    facility: {
        name: string;
        id: string;
    };
    capabilities: string[];
    inventoryCode: string;
    usageDomain: 'Electronics' | 'Mechanical' | 'IoT';
    supportPhase: 'Training' | 'Prototyping' | 'Testing' | 'Commercialization';
    availability: 'available' | 'in-use' | 'maintenance' | 'out-of-order';
    projectCount: number;
    lastMaintenance: string;
    nextMaintenance: string;
    status: 'active' | 'inactive' | 'maintenance';
}

interface EquipmentProps {
    equipment: Equipment[];
    usageDomains: string[];
    supportPhases: string[];
}

export default function Equipment({ equipment = [], usageDomains = [], supportPhases = [] }: EquipmentProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDomain, setFilterDomain] = useState('All Domains');
    const [filterFacility, setFilterFacility] = useState('All Facilities');
    const [filterAvailability, setFilterAvailability] = useState('All Availability');

    const filteredEquipment = useMemo(() => {
        return equipment.filter((item) => {
            const matchesSearch = searchTerm === '' ||
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.inventoryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.capabilities.some(cap => cap.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesDomain = filterDomain === 'All Domains' || item.usageDomain === filterDomain;

            const matchesFacility = filterFacility === 'All Facilities' || item.facility.name === filterFacility;

            const matchesAvailability = filterAvailability === 'All Availability' || item.availability === filterAvailability.toLowerCase().replace(' ', '-');

            return matchesSearch && matchesDomain && matchesFacility && matchesAvailability;
        });
    }, [equipment, searchTerm, filterDomain, filterFacility, filterAvailability]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
            case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getAvailabilityColor = (availability: string) => {
        switch (availability) {
            case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'in-use': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'out-of-order': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getDomainColor = (domain: string) => {
        switch (domain) {
            case 'Electronics': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Mechanical': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
            case 'IoT': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'Software': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Testing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getPhaseColor = (phase: string) => {
        switch (phase) {
            case 'Training': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Prototyping': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'Testing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Commercialization': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const handleDelete = (equipmentId: string) => {
        if (confirm('Are you sure you want to delete this equipment? This action cannot be undone.')) {
            router.delete(equipmentRoutes.destroy(equipmentId).url, {
                onSuccess: () => {
                    // Success message will be handled by the server redirect
                },
            });
        }
    };

    const getDomainIcon = (domain: string) => {
        switch (domain) {
            case 'Electronics': return Monitor;
            case 'Mechanical': return Wrench;
            case 'IoT': return Cpu;
            case 'Software': return HardDrive;
            case 'Testing': return Zap;
            default: return Wrench;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Equipment" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Equipment</h1>
                        <p className="text-muted-foreground">Lab equipment and prototyping tools at partner facilities</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link
                            href={equipmentRoutes.create().url}
                            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            <Plus className="h-4 w-4" />
                            Add Equipment
                        </Link>
                    </div>
                </div>

                {/* Enhanced Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search equipment by name, code, or capabilities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={filterDomain}
                            onChange={(e) => setFilterDomain(e.target.value)}
                            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option>All Domains</option>
                            {usageDomains.map(domain => (
                                <option key={domain}>{domain}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={filterFacility}
                            onChange={(e) => setFilterFacility(e.target.value)}
                            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option>All Facilities</option>
                            {[...new Set(equipment.map(e => e.facility.name))].map(name => (
                                <option key={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={filterAvailability}
                            onChange={(e) => setFilterAvailability(e.target.value)}
                            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option>All Availability</option>
                            <option>Available</option>
                            <option>In Use</option>
                            <option>Maintenance</option>
                            <option>Out of Order</option>
                        </select>
                    </div>
                </div>

                {/* Enhanced Equipment Grid */}
                <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {filteredEquipment.map((item) => {
                        const DomainIcon = getDomainIcon(item.usageDomain);
                        return (
                            <div key={item.id} className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                                {/* Equipment Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="rounded-lg bg-red-600 p-2">
                                            <DomainIcon className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center space-x-2">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(item.status)}`}>
                                                    {item.status}
                                                </span>
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getAvailabilityColor(item.availability)}`}>
                                                    {item.availability}
                                                </span>
                                            </div>
                                            {item.availability === 'available' && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                    <span className="text-xs text-green-600 dark:text-green-400">Ready to Use</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/viewdetails?type=equipment&id=${item.id}`} className="p-1.5 hover:bg-muted rounded-lg" title="View Details">
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                        <Link href={equipmentRoutes.edit(item.id).url} className="p-1.5 hover:bg-muted rounded-lg" title="Edit Equipment">
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded-lg"
                                            title="Delete Equipment"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Equipment Content */}
                                <div className="mb-4">
                                    <h3 className="font-semibold text-lg mb-2 group-hover:text-red-600 transition-colors">{item.name}</h3>
                                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                                        <Tag className="h-4 w-4 mr-2 text-red-600" />
                                        {item.inventoryCode}
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Equipment Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="text-center p-3 rounded-lg bg-muted/50">
                                        <div className="flex items-center justify-center space-x-1 mb-1">
                                            <Users className="h-4 w-4 text-blue-600" />
                                            <span className="text-lg font-bold text-blue-600">{item.projectCount}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Active Projects</p>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-muted/50">
                                        <div className="flex items-center justify-center space-x-1 mb-1">
                                            <Gauge className="h-4 w-4 text-green-600" />
                                            <span className="text-lg font-bold text-green-600">98%</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Uptime</p>
                                    </div>
                                </div>

                                {/* Equipment Details */}
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Facility:</span>
                                        </div>
                                        <span className="text-muted-foreground">{item.facility.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getDomainColor(item.usageDomain)}`}>
                                                {item.usageDomain}
                                            </span>
                                            <span className="font-medium">Phase:</span>
                                        </div>
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPhaseColor(item.supportPhase)}`}>
                                            {item.supportPhase}
                                        </span>
                                    </div>
                                </div>

                                {/* Capabilities */}
                                <div className="mb-4">
                                    <p className="text-xs font-medium text-muted-foreground mb-2">Key Capabilities:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {item.capabilities.slice(0, 2).map((capability, index) => (
                                            <span key={index} className="inline-flex items-center rounded-md bg-red-50 dark:bg-red-950 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-300">
                                                {capability}
                                            </span>
                                        ))}
                                        {item.capabilities.length > 2 && (
                                            <span className="inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-900 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                                                +{item.capabilities.length - 2} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Maintenance Info */}
                                <div className="pt-4 border-t space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Last Maintenance:</span>
                                        </div>
                                        <span className="text-muted-foreground">{new Date(item.lastMaintenance).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Next Due:</span>
                                        </div>
                                        <span className="text-muted-foreground">{new Date(item.nextMaintenance).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredEquipment.length === 0 && (
                    <div className="text-center py-12">
                        <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            {equipment.length === 0 ? 'No equipment found' : 'No equipment match your search'}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {equipment.length === 0
                                ? 'Add lab equipment and prototyping tools available at partner facilities'
                                : 'Try adjusting your search terms or filters'
                            }
                        </p>
                        {equipment.length === 0 && (
                            <Link
                                href={equipmentRoutes.create().url}
                                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                                <Plus className="h-4 w-4" />
                                Add Equipment
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}