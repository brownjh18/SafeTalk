import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    Eye,
    MessageCircle,
    Plus,
    Filter,
    Search,
    Info,
    X,
    Trash2
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/counselor/dashboard',
    },
    {
        title: 'Sessions',
        href: '/counselor/sessions',
    },
];

interface CounselingSession {
    id: number;
    client_id: number;
    counselor_id: number;
    scheduled_at: string;
    status: string;
    notes?: string;
    session_type: 'message' | 'audio';
    is_followup: boolean;
    client: {
        id: number;
        name: string;
        email: string;
    };
    counselor: {
        name: string;
        email: string;
    };
    created_at: string;
}

interface SessionStats {
    total_sessions: number;
    upcoming_sessions: number;
    completed_sessions: number;
}

interface CounselorSessionsProps {
    sessions: {
        data: CounselingSession[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: SessionStats;
    clients: Client[];
}

interface Client {
    id: number;
    name: string;
    email: string;
}

export default function CounselorSessions({ sessions, stats, clients }: CounselorSessionsProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All Status');
    const [selectedSession, setSelectedSession] = useState<any>(null);
    const [showSessionDetails, setShowSessionDetails] = useState(false);
    const [sessionDetails, setSessionDetails] = useState<any>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [clientSearchQuery, setClientSearchQuery] = useState('');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState<any>(null);
    const [showClientProfile, setShowClientProfile] = useState(false);
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [loadingClientProfile, setLoadingClientProfile] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        client_id: '',
        scheduled_at: '',
        notes: '',
        session_type: 'message' as 'message' | 'audio',
    });

    const filteredSessions = useMemo(() => {
        return sessions.data.filter((session) => {
            const matchesSearch = searchTerm === '' ||
                session.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                session.client.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = filterStatus === 'All Status' || session.status === filterStatus.toLowerCase().replace(' ', '_');

            return matchesSearch && matchesStatus;
        });
    }, [sessions.data, searchTerm, filterStatus]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'in_progress': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const handleViewSessionDetails = async (session: any) => {
        setSelectedSession(session);
        setLoadingDetails(true);
        setShowSessionDetails(true);

        try {
            const response = await fetch(`/counselor/sessions/${session.id}`);
            if (response.ok) {
                const data = await response.json();
                setSessionDetails(data);
            } else {
                console.error('Failed to fetch session details');
            }
        } catch (error) {
            console.error('Error fetching session details:', error);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleCreateSession = (e: React.FormEvent) => {
        e.preventDefault();
        post('/counselor/sessions', {
            onSuccess: () => {
                reset();
                setShowCreateDialog(false);
                setClientSearchQuery('');
                // Refresh the page to show the new session
                window.location.reload();
            },
        });
    };

    // Filter clients based on search query
    const filteredClients = useMemo(() => {
        if (!clientSearchQuery.trim()) return clients;
        const query = clientSearchQuery.toLowerCase();
        return clients.filter(client =>
            client.name.toLowerCase().includes(query) ||
            client.email.toLowerCase().includes(query)
        );
    }, [clients, clientSearchQuery]);

    const handleDeleteSession = (session: any) => {
        setSessionToDelete(session);
        setShowDeleteDialog(true);
    };

    const handleViewClientProfile = async (clientId: number) => {
        console.log('Fetching client profile for ID:', clientId);
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
            console.log('Response status:', response.status);
            if (response.ok) {
                const data = await response.json();
                console.log('Client data:', data);
                setSelectedClient(data);
            } else {
                console.error('Failed to fetch client profile:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error response:', errorText);
            }
        } catch (error) {
            console.error('Error fetching client profile:', error);
        } finally {
            setLoadingClientProfile(false);
        }
    };

    const confirmDeleteSession = () => {
        if (!sessionToDelete) return;

        const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;

        if (!csrfToken) {
            console.error('CSRF token not found');
            return;
        }

        // Make delete request
        fetch(`/counselor/sessions/${sessionToDelete.id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
        .then(response => {
            if (response.ok) {
                setShowDeleteDialog(false);
                setSessionToDelete(null);
                // Refresh the page to show updated sessions
                window.location.reload();
            } else {
                console.error('Failed to delete session:', response.status, response.statusText);
                return response.text().then(text => console.error('Response:', text));
            }
        })
        .catch(error => {
            console.error('Error deleting session:', error);
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Sessions" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">My Sessions</h1>
                        <p className="text-muted-foreground">Manage your counseling sessions and appointments</p>
                    </div>
                    {showCreateDialog && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                            <div className="bg-card border rounded-xl w-full max-w-md mx-4 shadow-2xl">
                                <div className="p-6 border-b">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-semibold">Schedule New Session</h3>
                                        <button
                                            onClick={() => setShowCreateDialog(false)}
                                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                                            title="Close dialog"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <p className="text-muted-foreground text-sm mt-2">
                                        Book a counseling session with one of your clients
                                    </p>
                                </div>

                                <div className="p-6">
                                    <form onSubmit={handleCreateSession} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="client-search">Search & Select Client</Label>
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="client-search"
                                                    type="text"
                                                    placeholder="Search by name or email..."
                                                    value={clientSearchQuery}
                                                    onChange={(e) => setClientSearchQuery(e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>

                                            {/* Search Results */}
                                            {clientSearchQuery.trim() && (
                                                <div className="border rounded-md max-h-48 overflow-y-auto">
                                                    {filteredClients.length > 0 ? (
                                                        filteredClients.map((client) => (
                                                            <button
                                                                key={client.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setData('client_id', client.id.toString());
                                                                    setClientSearchQuery(client.name + ' (' + client.email + ')');
                                                                }}
                                                                className={`w-full text-left px-3 py-2 hover:bg-muted transition-colors ${
                                                                    data.client_id === client.id.toString() ? 'bg-blue-50 text-blue-700' : ''
                                                                }`}
                                                            >
                                                                <div className="font-medium">{client.name}</div>
                                                                <div className="text-sm text-muted-foreground">{client.email}</div>
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                                                            No clients found matching "{clientSearchQuery}"
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {data.client_id && (
                                                <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md">
                                                    <span className="text-sm text-green-800">
                                                        Selected: {clients.find(c => c.id.toString() === data.client_id)?.name}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setData('client_id', '');
                                                            setClientSearchQuery('');
                                                        }}
                                                        className="text-green-600 hover:text-green-800"
                                                        title="Clear selection"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}

                                            {errors.client_id && (
                                                <p className="text-sm text-red-600">{errors.client_id}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="session-datetime">Session Date & Time</Label>
                                            <Input
                                                id="session-datetime"
                                                type="datetime-local"
                                                value={data.scheduled_at}
                                                onChange={(e) => setData('scheduled_at', e.target.value)}
                                                required
                                            />
                                            {errors.scheduled_at && (
                                                <p className="text-sm text-red-600">{errors.scheduled_at}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Session Type</Label>
                                            <div className="flex space-x-4">
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        value="message"
                                                        checked={data.session_type === 'message'}
                                                        onChange={(e) => setData('session_type', e.target.value as 'message' | 'audio')}
                                                        className="text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm">Message Chat</span>
                                                </label>
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        value="audio"
                                                        checked={data.session_type === 'audio'}
                                                        onChange={(e) => setData('session_type', e.target.value as 'message' | 'audio')}
                                                        className="text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm">Audio Call</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="notes">Session Notes (Optional)</Label>
                                            <Textarea
                                                id="notes"
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                rows={3}
                                                placeholder="Any specific topics or concerns to address in this session..."
                                            />
                                            {errors.notes && (
                                                <p className="text-sm text-red-600">{errors.notes}</p>
                                            )}
                                        </div>

                                        <div className="flex justify-end space-x-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setShowCreateDialog(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={processing}>
                                                {processing ? 'Scheduling...' : 'Schedule Session'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        onClick={() => setShowCreateDialog(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Schedule Session
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                                <p className="text-2xl font-bold">{stats.total_sessions}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                                <p className="text-2xl font-bold">{stats.upcoming_sessions}</p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                                <p className="text-2xl font-bold">{stats.completed_sessions}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search sessions by client name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <label htmlFor="status-filter" className="sr-only">Filter by status</label>
                        <select
                            id="status-filter"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option>All Status</option>
                            <option>Scheduled</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                        </select>
                    </div>
                </div>

                {/* Sessions List */}
                <div className="rounded-xl border bg-card p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">Appointment Schedule</h3>

                    <div className="space-y-4">
                        {filteredSessions.map((session) => (
                            <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                                            <p className="font-medium text-sm sm:text-base">{session.client.name}</p>
                                            <span className="text-sm text-muted-foreground">with you</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">{session.client.email}</p>
                                        {session.notes && (
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{session.notes}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                                    <div className="flex items-center space-x-2 self-start sm:self-center">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(session.status)}`}>
                                            {session.status.replace('_', ' ')}
                                        </span>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                            session.session_type === 'audio'
                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                        }`}>
                                            {session.session_type === 'audio' ? 'Audio' : 'Chat'}
                                        </span>
                                        {session.is_followup && (
                                            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                                                Follow-up
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-sm font-medium">
                                            {new Date(session.scheduled_at).toLocaleDateString()}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <button
                                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                            onClick={() => {
                                                // Navigate directly to active session
                                                window.location.href = `/counselor/sessions/${session.id}/active`;
                                            }}
                                        >
                                            Start Session
                                        </button>
                                        <button
                                            className="p-1.5 hover:bg-muted rounded-lg"
                                            title="View Client Profile"
                                            onClick={() => handleViewClientProfile(session.client.id)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                            className="p-1.5 hover:bg-muted rounded-lg"
                                            title="Send Message"
                                            onClick={() => window.location.href = `/counselor/messages?client=${session.client_id}`}
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                        </button>
                                        <button
                                            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg"
                                            title="Delete Session"
                                            onClick={() => handleDeleteSession(session)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredSessions.length === 0 && (
                        <div className="text-center py-8">
                            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">No sessions found matching your criteria</p>
                        </div>
                    )}
                </div>

                {/* Session Details Modal */}
                {showSessionDetails && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-card border rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold">Session Details</h3>
                                    <button
                                        onClick={() => setShowSessionDetails(false)}
                                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                {loadingDetails ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <span className="ml-2">Loading session details...</span>
                                    </div>
                                ) : sessionDetails ? (
                                    <div className="space-y-6">
                                        {/* Session Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Session Information</h4>
                                                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium">Status:</span>
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(sessionDetails.session.status)}`}>
                                                                {sessionDetails.session.status.replace('_', ' ')}
                                                            </span>
                                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                                                sessionDetails.session.session_type === 'audio'
                                                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                                                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                                            }`}>
                                                                {sessionDetails.session.session_type === 'audio' ? 'Audio Call' : 'Message Chat'}
                                                            </span>
                                                            {sessionDetails.session.is_followup && (
                                                                <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                                                                    Follow-up
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium">Scheduled:</span>
                                                        <span className="text-sm">{new Date(sessionDetails.session.scheduled_at).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium">Created:</span>
                                                        <span className="text-sm">{new Date(sessionDetails.session.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    {sessionDetails.session.is_followup && (
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium">Session Type:</span>
                                                            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                                                                Follow-up Session
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Participants</h4>
                                                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                            <span className="text-sm font-medium text-blue-600">C</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{sessionDetails.session.client.name}</p>
                                                            <p className="text-sm text-muted-foreground">Client</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                                            <span className="text-sm font-medium text-green-600">T</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{sessionDetails.session.counselor.name}</p>
                                                            <p className="text-sm text-muted-foreground">Counselor</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Session Notes */}
                                        {sessionDetails.session.notes && (
                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Session Notes</h4>
                                                <div className="bg-muted/50 p-4 rounded-lg">
                                                    <p className="text-sm">{sessionDetails.session.notes}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Chat Messages */}
                                        {sessionDetails.chats && sessionDetails.chats.length > 0 && (
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Chat History</h4>
                                                <div className="bg-muted/30 p-4 rounded-lg max-h-64 overflow-y-auto space-y-3">
                                                    {sessionDetails.chats.map((chat: any) => (
                                                        <div key={chat.id} className={`flex ${chat.is_from_counselor ? 'justify-end' : 'justify-start'}`}>
                                                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                                chat.is_from_counselor
                                                                    ? 'bg-blue-600 text-white'
                                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                                            }`}>
                                                                <p className="text-sm">{chat.message}</p>
                                                                <p className={`text-xs mt-1 ${
                                                                    chat.is_from_counselor ? 'text-blue-200' : 'text-gray-500'
                                                                }`}>
                                                                    {new Date(chat.sent_at).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Progress Reports */}
                                        {sessionDetails.progress_reports && sessionDetails.progress_reports.length > 0 && (
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Progress Reports</h4>
                                                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                                                    {sessionDetails.progress_reports.map((report: any) => (
                                                        <div key={report.id} className="bg-card border rounded-lg p-4">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <h5 className="font-medium text-sm">{report.title}</h5>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {new Date(report.created_at).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">{report.content}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Empty States */}
                                        {(!sessionDetails.chats || sessionDetails.chats.length === 0) &&
                                         (!sessionDetails.progress_reports || sessionDetails.progress_reports.length === 0) && (
                                            <div className="text-center py-8">
                                                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                                <p className="text-muted-foreground">No additional session data available</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                                        <p className="text-red-600">Failed to load session details</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

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

                {/* Delete Confirmation Dialog */}
                {showDeleteDialog && sessionToDelete && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-card border rounded-xl w-full max-w-md mx-4 shadow-2xl">
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-red-600">Delete Session</h3>
                                    <button
                                        onClick={() => setShowDeleteDialog(false)}
                                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                                        title="Close dialog"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <p className="text-muted-foreground text-sm mt-2">
                                    Are you sure you want to delete this session? This action cannot be undone.
                                </p>
                            </div>

                            <div className="p-6">
                                <div className="bg-muted/30 p-4 rounded-lg mb-6">
                                    <div className="space-y-2">
                                        <p className="font-medium">{sessionToDelete.client.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(sessionToDelete.scheduled_at).toLocaleDateString()} at{' '}
                                            {new Date(sessionToDelete.scheduled_at).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        <p className="text-sm text-muted-foreground capitalize">
                                            Status: {sessionToDelete.status.replace('_', ' ')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowDeleteDialog(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={confirmDeleteSession}
                                    >
                                        Delete Session
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}