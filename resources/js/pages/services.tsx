import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import servicesRoutes from '@/routes/services';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    Settings,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Building2,
    Wrench,
    Code,
    Cpu,
    Zap,
    GraduationCap,
    Briefcase,
    Users,
    MoreHorizontal,
    Clock,
    CheckCircle,
    AlertCircle,
    Star,
    TrendingUp,
    Calendar,
    ExternalLink,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Services',
        href: servicesRoutes.index().url,
    },
];

interface Service {
    id: string;
    name: string;
    description: string;
    facility: {
        name: string;
        id: string;
    };
    category: 'Machining' | 'Testing' | 'Training';
    skillType: 'Hardware' | 'Software' | 'Integration';
    duration: string;
    capacity: number;
    availability: 'available' | 'limited' | 'unavailable';
    projectCount: number;
    status: 'active' | 'inactive' | 'maintenance';
}

interface ServicesProps {
    services: Service[];
}

export default function Services({ services = [] }: ServicesProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All Categories');
    const [filterFacility, setFilterFacility] = useState('All Facilities');
    const [filterAvailability, setFilterAvailability] = useState('All Availability');

    const filteredServices = useMemo(() => {
        return services.filter((service) => {
            const matchesSearch = searchTerm === '' ||
                service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.category.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = filterCategory === 'All Categories' || service.category === filterCategory;

            const matchesFacility = filterFacility === 'All Facilities' || service.facility.name === filterFacility;

            const matchesAvailability = filterAvailability === 'All Availability' || service.availability === filterAvailability.toLowerCase();

            return matchesSearch && matchesCategory && matchesFacility && matchesAvailability;
        });
    }, [services, searchTerm, filterCategory, filterFacility, filterAvailability]);

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
            case 'limited': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'unavailable': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Machining': return Wrench;
            case 'Testing': return Code;
            case 'Training': return GraduationCap;
            case 'Consultation': return Briefcase;
            case 'Prototyping': return Cpu;
            default: return Settings;
        }
    };

    const getSkillTypeColor = (skillType: string) => {
        switch (skillType) {
            case 'Hardware': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Software': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Integration': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'Business': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const handleDelete = (serviceId: string) => {
        if (confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
            router.delete(servicesRoutes.destroy(serviceId).url, {
                onSuccess: () => {
                    // Success message will be handled by the server redirect
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Services" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Services</h1>
                        <p className="text-muted-foreground">Technical services and training programs at partner facilities</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link
                            href={servicesRoutes.create().url}
                            className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                        >
                            <Plus className="h-4 w-4" />
                            Add Service
                        </Link>
                    </div>
                </div>

                {/* Enhanced Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search services by name, category, or facility..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option>All Categories</option>
                            <option>Machining</option>
                            <option>Testing</option>
                            <option>Training</option>
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
                            {[...new Set(services.map(s => s.facility.name))].map(name => (
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
                            <option>Limited</option>
                            <option>Unavailable</option>
                        </select>
                    </div>
                </div>

                {/* Enhanced Services Grid */}
                <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {filteredServices.map((service) => {
                        const CategoryIcon = getCategoryIcon(service.category);
                        return (
                            <div key={service.id} className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                                {/* Service Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="rounded-lg bg-orange-600 p-2">
                                            <CategoryIcon className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center space-x-2">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(service.status)}`}>
                                                    {service.status}
                                                </span>
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getAvailabilityColor(service.availability)}`}>
                                                    {service.availability}
                                                </span>
                                            </div>
                                            {service.availability === 'available' && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                    <span className="text-xs text-green-600 dark:text-green-400">Ready to Book</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/viewdetails?type=service&id=${service.id}`} className="p-1.5 hover:bg-muted rounded-lg" title="View Details">
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                        <Link href={servicesRoutes.edit(service.id).url} className="p-1.5 hover:bg-muted rounded-lg" title="Edit Service">
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded-lg"
                                            title="Delete Service"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Service Content */}
                                <div className="mb-4">
                                    <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-600 transition-colors">{service.name}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                        {service.description}
                                    </p>
                                </div>

                                {/* Service Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="text-center p-3 rounded-lg bg-muted/50">
                                        <div className="flex items-center justify-center space-x-1 mb-1">
                                            <Users className="h-4 w-4 text-blue-600" />
                                            <span className="text-lg font-bold text-blue-600">{service.projectCount}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Active Projects</p>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-muted/50">
                                        <div className="flex items-center justify-center space-x-1 mb-1">
                                            <Zap className="h-4 w-4 text-green-600" />
                                            <span className="text-lg font-bold text-green-600">{service.capacity}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Capacity</p>
                                    </div>
                                </div>

                                {/* Service Details */}
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Facility:</span>
                                        </div>
                                        <span className="text-muted-foreground">{service.facility.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getSkillTypeColor(service.skillType)}`}>
                                                {service.skillType}
                                            </span>
                                            <span className="font-medium">Category:</span>
                                        </div>
                                        <span className="text-muted-foreground">{service.category}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Duration:</span>
                                        </div>
                                        <span className="text-muted-foreground">{service.duration}</span>
                                    </div>
                                </div>

                                {/* Service Footer */}
                                <div className="pt-4 border-t">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                            <Star className="h-3 w-3 text-yellow-500" />
                                            <span>4.8 rating</span>
                                        </div>
                                        <button className="text-xs text-orange-600 hover:text-orange-700 font-medium">
                                            Book Service →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredServices.length === 0 && (
                    <div className="text-center py-12">
                        <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            {services.length === 0 ? 'No services found' : 'No services match your search'}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {services.length === 0
                                ? 'Add technical services and training programs offered at partner facilities'
                                : 'Try adjusting your search terms or filters'
                            }
                        </p>
                        {services.length === 0 && (
                            <Link
                                href={servicesRoutes.create().url}
                                className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                            >
                                <Plus className="h-4 w-4" />
                                Add Service
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}