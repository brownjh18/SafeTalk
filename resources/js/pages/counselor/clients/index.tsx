import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Users,
    MessageCircle,
    Calendar,
    Eye,
    Mail,
    Clock,
    CheckCircle,
    AlertCircle,
    X
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/counselor/dashboard',
    },
    {
        title: 'My Clients',
        href: '/counselor/clients',
    },
];

interface Client {
    id: number;
    name: string;
    email: string;
    session_count: number;
    last_session: string | null;
    status: string;
}

interface CounselorClientsProps {
    clients: Client[];
}

export default function CounselorClients({ clients = [] }: CounselorClientsProps) {
    const [showClientProfile, setShowClientProfile] = useState(false);
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [loadingClientProfile, setLoadingClientProfile] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'in_progress': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const handleViewClientProfile = async (clientId: number) => {
        setSelectedClient(null);
        setLoadingClientProfile(true);
        setShowClientProfile(true);

        try {
            const response = await fetch(`http://127.0.0.1:8000/users/${clientId}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setSelectedClient(data);
            } else {
                console.error('Failed to fetch client profile:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error fetching client profile:', error);
        } finally {
            setLoadingClientProfile(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Clients" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">My Clients</h1>
                        <p className="text-muted-foreground">Manage your counseling clients and sessions</p>
                    </div>
                </div>

                {/* Clients Grid */}
                <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {clients.map((client) => (
                        <div key={client.id} className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                            {/* Client Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-lg bg-blue-600 p-2">
                                        <Users className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium w-fit ${
                                            client.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                            client.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                                        }`}>
                                            {client.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        className="p-1.5 hover:bg-muted rounded-lg"
                                        title="View Profile"
                                        onClick={() => handleViewClientProfile(client.id)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                    <button
                                        className="p-1.5 hover:bg-muted rounded-lg"
                                        title="Send Message"
                                        onClick={() => window.location.href = `/counselor/messages?client=${client.id}`}
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Client Content */}
                            <div className="mb-4">
                                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">{client.name}</h3>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                                    <Mail className="h-4 w-4" />
                                    <span>{client.email}</span>
                                </div>
                            </div>

                            {/* Client Stats */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Sessions:</span>
                                    </div>
                                    <span className="text-muted-foreground">{client.session_count} total</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Last Session:</span>
                                    </div>
                                    <span className="text-muted-foreground">
                                        {client.last_session ? new Date(client.last_session).toLocaleDateString() : 'No sessions yet'}
                                    </span>
                                </div>
                            </div>

                            {/* Client Footer */}
                            <div className="pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-muted-foreground">
                                        Client since {new Date().getFullYear()}
                                    </div>
                                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                        Schedule Session →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Client Profile Modal */}
                {showClientProfile && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-card border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold">Client Profile</h3>
                                    <button
                                        onClick={() => setShowClientProfile(false)}
                                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                                        title="Close dialog"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                {loadingClientProfile ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <span className="ml-2">Loading client profile...</span>
                                    </div>
                                ) : selectedClient ? (
                                    <div className="space-y-6">
                                        {/* Profile Header */}
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                <span className="text-2xl font-bold text-blue-600">
                                                    {selectedClient.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-semibold">{selectedClient.name}</h4>
                                                <p className="text-muted-foreground">{selectedClient.email}</p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                                        selectedClient.verified
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                    }`}>
                                                        {selectedClient.verified ? 'Verified' : 'Unverified'}
                                                    </span>
                                                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                        Client
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Profile Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <h5 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Account Information</h5>
                                                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium">Joined:</span>
                                                        <span className="text-sm">{new Date(selectedClient.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium">Last Updated:</span>
                                                        <span className="text-sm">{new Date(selectedClient.updated_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium">Role:</span>
                                                        <span className="text-sm capitalize">{selectedClient.role}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h5 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Quick Actions</h5>
                                                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                                                    <button
                                                        onClick={() => window.location.href = `/counselor/messages?client=${selectedClient.id}`}
                                                        className="w-full text-left p-2 hover:bg-muted rounded-lg transition-colors"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <MessageCircle className="h-4 w-4" />
                                                            <span className="text-sm">Send Message</span>
                                                        </div>
                                                    </button>
                                                    <button
                                                        onClick={() => window.location.href = `/counselor/sessions?client=${selectedClient.id}`}
                                                        className="w-full text-left p-2 hover:bg-muted rounded-lg transition-colors"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <Calendar className="h-4 w-4" />
                                                            <span className="text-sm">View Sessions</span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Info */}
                                        <div className="bg-muted/30 p-4 rounded-lg">
                                            <p className="text-sm text-muted-foreground">
                                                This is a quick preview of the client's profile. For more detailed information and management options,
                                                visit the full client management section.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                                        <p className="text-red-600">Failed to load client profile</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {clients.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No clients yet</h3>
                        <p className="text-muted-foreground mb-4">
                            You haven't had any clients assigned yet. New clients will appear here once they book sessions with you.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
