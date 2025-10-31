import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Eye,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    Users,
    Filter,
    Search,
    Info,
    Settings,
    Trash2,
    MessageCircle
} from 'lucide-react';
import { useState, useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Session Monitoring',
        href: '/admin/sessions',
    },
];

interface CounselingSession {
    id: number;
    client_id: number;
    counselor_id: number;
    scheduled_at: string;
    status: string;
    client: {
        name: string;
        email: string;
    };
    counselor: {
        name: string;
        email: string;
    };
}

interface SessionStats {
    total_sessions: number;
    active_sessions: number;
    completed_sessions: number;
    scheduled_sessions: number;
}

interface AdminSessionsProps {
    sessions: {
        data: CounselingSession[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: SessionStats;
}

export default function AdminSessions({ sessions, stats }: AdminSessionsProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All Status');
    const [selectedSession, setSelectedSession] = useState<any>(null);
    const [showSessionDetails, setShowSessionDetails] = useState(false);
    const [showSessionManagement, setShowSessionManagement] = useState(false);
    const [sessionDetails, setSessionDetails] = useState<any>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [updatingSession, setUpdatingSession] = useState(false);

    const filteredSessions = useMemo(() => {
        return sessions.data.filter((session) => {
            const matchesSearch = searchTerm === '' ||
                session.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                session.client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                session.counselor.name.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = filterStatus === 'All Status' || session.status === filterStatus.toLowerCase().replace(' ', '_');

            return matchesSearch && matchesStatus;
        });
    }, [sessions.data, searchTerm, filterStatus]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'in_progress': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const handleViewSessionDetails = async (session: any) => {
        setSelectedSession(session);
        setLoadingDetails(true);
        setShowSessionDetails(true);

        try {
            const response = await fetch(`/admin/sessions/${session.id}`);
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

    const handleManageSession = (session: any) => {
        setSelectedSession(session);
        setShowSessionManagement(true);
    };

    const handleUpdateSession = async (sessionId: number, updates: any) => {
        setUpdatingSession(true);
        try {
            const response = await fetch(`/admin/sessions/${sessionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify(updates),
            });

            if (response.ok) {
                // Refresh the page to show updated data
                window.location.reload();
            } else {
                console.error('Failed to update session');
            }
        } catch (error) {
            console.error('Error updating session:', error);
        } finally {
            setUpdatingSession(false);
        }
    };

    const handleDeleteSession = async (sessionId: number) => {
        if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/admin/sessions/${sessionId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });

            if (response.ok) {
                // Refresh the page to show updated data
                window.location.reload();
            } else {
                console.error('Failed to delete session');
            }
        } catch (error) {
            console.error('Error deleting session:', error);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Session Monitoring" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Session Monitoring</h1>
                        <p className="text-muted-foreground">Monitor all counseling sessions across the platform</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                                <p className="text-sm font-medium text-muted-foreground">Active Now</p>
                                <p className="text-2xl font-bold">{stats.active_sessions}</p>
                            </div>
                            <Clock className="h-8 w-8 text-green-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                                <p className="text-2xl font-bold">{stats.completed_sessions}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-purple-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                                <p className="text-2xl font-bold">{stats.scheduled_sessions}</p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-orange-600" />
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search sessions by client, counselor, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
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

                {/* Sessions Table */}
                <div className="rounded-xl border bg-card">
                    <div className="p-4 sm:p-6">
                        <h3 className="text-lg font-semibold mb-4">All Sessions</h3>
                        <div className="space-y-3">
                            {filteredSessions.map((session) => (
                                <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                                                <p className="font-medium text-sm sm:text-base">{session.client.name}</p>
                                                <span className="text-sm text-muted-foreground hidden sm:inline">with</span>
                                                <p className="font-medium text-sm sm:text-base">{session.counselor.name}</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {session.client.email} • {session.counselor.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                                        <div className="flex items-center space-x-2 self-start sm:self-center">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(session.status)}`}>
                                                {session.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(session.scheduled_at).toLocaleDateString()} {new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1 self-end sm:self-center">
                                            <button
                                                className="p-1.5 hover:bg-muted rounded-lg"
                                                title="View Session Details"
                                                onClick={() => handleViewSessionDetails(session)}
                                            >
                                                <Info className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="p-1.5 hover:bg-muted rounded-lg"
                                                title="Manage Session"
                                                onClick={() => handleManageSession(session)}
                                            >
                                                <Settings className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded-lg"
                                                title="Delete Session"
                                                onClick={() => handleDeleteSession(session.id)}
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
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(sessionDetails.session.status)}`}>
                                                            {sessionDetails.session.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium">Scheduled:</span>
                                                        <span className="text-sm">{new Date(sessionDetails.session.scheduled_at).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium">Created:</span>
                                                        <span className="text-sm">{new Date(sessionDetails.session.created_at).toLocaleDateString()}</span>
                                                    </div>
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

                {/* Session Management Modal */}
                {showSessionManagement && selectedSession && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-card border rounded-xl w-full max-w-md shadow-2xl">
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Manage Session</h3>
                                    <button
                                        onClick={() => setShowSessionManagement(false)}
                                        className="p-2 hover:bg-muted rounded-lg"
                                    >
                                        <span className="sr-only">Close</span>
                                        ×
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Update Status</label>
                                        <select
                                            id="session-status"
                                            value={selectedSession.status}
                                            onChange={(e) => setSelectedSession({...selectedSession, status: e.target.value})}
                                            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="scheduled">Scheduled</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Update Notes</label>
                                        <textarea
                                            value={selectedSession.notes || ''}
                                            onChange={(e) => setSelectedSession({...selectedSession, notes: e.target.value})}
                                            rows={3}
                                            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                            placeholder="Add or update session notes..."
                                        />
                                    </div>

                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            onClick={() => handleUpdateSession(selectedSession.id, {
                                                status: selectedSession.status,
                                                notes: selectedSession.notes
                                            })}
                                            disabled={updatingSession}
                                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {updatingSession ? 'Updating...' : 'Update Session'}
                                        </button>
                                        <button
                                            onClick={() => setShowSessionManagement(false)}
                                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
