import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    Calendar,
    Clock,
    UserCheck,
    Heart,
    Star,
    CheckCircle,
    Plus,
    Eye,
    Award,
    Users,
    MessageCircle,
    X,
    Search,
    Filter,
    Phone
} from 'lucide-react';
import { useState, useMemo } from 'react';
import RatingForm from '@/components/rating-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/client/dashboard',
    },
    {
        title: 'Book Session',
        href: '/client/book-session',
    },
];

interface Counselor {
    id: number;
    name: string;
    email: string;
    specialization: string;
    experience_years?: number;
    total_sessions?: number;
    rating?: number;
    total_ratings?: number;
    bio?: string;
    certifications?: string[];
    has_user_rated?: boolean;
}

interface MySession {
    id: number;
    counselor_name: string;
    scheduled_at: string;
    status: string;
    notes?: string;
    session_type: 'message' | 'audio';
    is_followup: boolean;
    created_at: string;
}

interface BookSessionProps {
    availableCounselors: Counselor[];
    mySessions: MySession[];
}

export default function BookSession({ availableCounselors = [], mySessions = [] }: BookSessionProps) {
    const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileCounselor, setProfileCounselor] = useState<Counselor | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchMode, setSearchMode] = useState<'name' | 'specialization' | 'all'>('all');
    const [showSessionDetailsModal, setShowSessionDetailsModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState<MySession | null>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        counselor_id: '',
        scheduled_at: '',
        notes: '',
        session_type: 'message' as 'message' | 'audio',
    });

    const handleCounselorSelect = (counselor: Counselor) => {
        setSelectedCounselor(counselor);
        setData('counselor_id', counselor.id.toString());
        setShowBookingForm(true);
    };

    const handleViewProfile = (counselor: Counselor) => {
        setProfileCounselor(counselor);
        setShowProfileModal(true);
    };

    const handleViewSessionDetails = (session: MySession) => {
        setSelectedSession(session);
        setShowSessionDetailsModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/client/book-session', {
            onSuccess: () => {
                reset();
                setShowBookingForm(false);
                setSelectedCounselor(null);
            },
        });
    };

    // Filter counselors based on search
    const filteredCounselors = useMemo(() => {
        if (!searchQuery.trim()) return availableCounselors;

        return availableCounselors.filter(counselor => {
            const query = searchQuery.toLowerCase();
            switch (searchMode) {
                case 'name':
                    return counselor.name.toLowerCase().includes(query);
                case 'specialization':
                    return counselor.specialization.toLowerCase().includes(query);
                case 'all':
                default:
                    return counselor.name.toLowerCase().includes(query) ||
                           counselor.specialization.toLowerCase().includes(query) ||
                           counselor.email.toLowerCase().includes(query);
            }
        });
    }, [availableCounselors, searchQuery, searchMode]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'in_progress': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Book Session" />
            <div className="flex h-full flex-1 flex-col gap-4 sm:gap-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Book a Session</h1>
                        <p className="text-muted-foreground text-sm sm:text-base">Schedule a counseling session with a licensed professional</p>
                    </div>
                </div>

                {/* Available Counselors */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border bg-card p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <h3 className="text-lg font-semibold">Available Counselors</h3>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:flex-initial">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search counselors..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full sm:w-64 pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <select
                                    value={searchMode}
                                    onChange={(e) => setSearchMode(e.target.value as 'name' | 'specialization' | 'all')}
                                    className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    title="Search mode"
                                >
                                    <option value="all">All Fields</option>
                                    <option value="name">Name</option>
                                    <option value="specialization">Specialization</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                            {filteredCounselors.map((counselor) => (
                                <div key={counselor.id} className="flex flex-col p-4 border rounded-lg gap-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center space-x-4">
                                        <div className="rounded-lg bg-blue-600 p-2 flex-shrink-0">
                                            <Heart className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-semibold text-sm sm:text-base">{counselor.name}</h4>
                                            <p className="text-sm text-muted-foreground">{counselor.specialization}</p>
                                            <p className="text-xs text-muted-foreground truncate">{counselor.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        ))}
                                        <span className="text-xs text-muted-foreground ml-1">(4.9)</span>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <button
                                            onClick={() => handleViewProfile(counselor)}
                                            className="inline-flex items-center justify-center gap-2 rounded-md border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View Profile
                                        </button>
                                        <button
                                            onClick={() => handleCounselorSelect(counselor)}
                                            className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Book
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {availableCounselors.length === 0 && (
                            <div className="text-center py-8">
                                <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                <p className="text-muted-foreground">No counselors available at the moment</p>
                                <p className="text-sm text-muted-foreground">Please check back later or contact support</p>
                            </div>
                        )}
                    </div>

                    {/* My Sessions */}
                    <div className="rounded-xl border bg-card p-4 sm:p-6">
                        <h3 className="text-lg font-semibold mb-4">My Sessions</h3>

                        <div className="space-y-3">
                            {mySessions.map((session) => (
                                <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2">
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-sm sm:text-base">Session with {session.counselor_name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(session.scheduled_at).toLocaleDateString()} at {new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
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
                                        <button
                                            onClick={() => handleViewSessionDetails(session)}
                                            className="p-1 hover:bg-muted rounded-lg transition-colors"
                                            title="View Session Details"
                                        >
                                            <Eye className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {mySessions.length === 0 && (
                            <div className="text-center py-8">
                                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                <p className="text-muted-foreground">No sessions scheduled</p>
                                <p className="text-sm text-muted-foreground">Book your first session with a counselor</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Session Details Modal */}
                {showSessionDetailsModal && selectedSession && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-card border rounded-xl p-6 w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold">Session Details</h3>
                                <button
                                    onClick={() => setShowSessionDetailsModal(false)}
                                    className="p-2 hover:bg-muted rounded-full transition-colors"
                                    title="Close details"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Session Info */}
                                <div className="bg-muted/30 p-4 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-medium text-sm text-muted-foreground mb-1">Counselor</h4>
                                            <p className="font-semibold">{selectedSession.counselor_name}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm text-muted-foreground mb-1">Status</h4>
                                            <div className="flex items-center space-x-2">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(selectedSession.status)}`}>
                                                    {selectedSession.status.replace('_', ' ')}
                                                </span>
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                                    selectedSession.session_type === 'audio'
                                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                                }`}>
                                                    {selectedSession.session_type === 'audio' ? 'Audio Call' : 'Message Chat'}
                                                </span>
                                                {selectedSession.is_followup && (
                                                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                                                        Follow-up
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm text-muted-foreground mb-1">Date & Time</h4>
                                            <p className="font-semibold">
                                                {new Date(selectedSession.scheduled_at).toLocaleDateString()} at{' '}
                                                {new Date(selectedSession.scheduled_at).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm text-muted-foreground mb-1">Session ID</h4>
                                            <p className="font-mono text-sm">#{selectedSession.id}</p>
                                        </div>
                                        {selectedSession.is_followup && (
                                            <div>
                                                <h4 className="font-medium text-sm text-muted-foreground mb-1">Session Type</h4>
                                                <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                                                    Follow-up Session
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Session Actions */}
                                <div className="bg-muted/30 p-4 rounded-lg">
                                    <h4 className="font-medium mb-3">Session Actions</h4>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={() => {
                                                setShowSessionDetailsModal(false);
                                                // Navigate to active session page
                                                window.location.href = `/client/sessions/${selectedSession.id}/active`;
                                            }}
                                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                        >
                                            <span>Start Session</span>
                                        </button>
                                        {selectedSession.status === 'completed' && (
                                            <button
                                                onClick={() => {
                                                    setShowSessionDetailsModal(false);
                                                    // Could add mood logging here
                                                }}
                                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                                            >
                                                <Heart className="h-4 w-4" />
                                                Log Mood
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Session Notes */}
                                <div className="bg-muted/30 p-4 rounded-lg">
                                    <h4 className="font-medium mb-2">Session Notes</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedSession.notes || 'No notes available for this session.'}
                                    </p>
                                </div>

                                {/* Close Button */}
                                <div className="flex justify-end pt-4 border-t">
                                    <button
                                        onClick={() => setShowSessionDetailsModal(false)}
                                        className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Counselor Profile Modal */}
                {showProfileModal && profileCounselor && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-card border rounded-xl p-6 w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold">Counselor Profile</h3>
                                <button
                                    onClick={() => setShowProfileModal(false)}
                                    className="p-2 hover:bg-muted rounded-full transition-colors"
                                    title="Close profile"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Header */}
                                <div className="flex items-start space-x-4">
                                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Heart className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xl font-semibold">{profileCounselor.name}</h4>
                                        <p className="text-muted-foreground">{profileCounselor.specialization}</p>
                                        <p className="text-sm text-muted-foreground">{profileCounselor.email}</p>
                                    </div>
                                </div>

                                {/* Rating & Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                                        <div className="flex items-center justify-center space-x-1 mb-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="text-sm font-medium">{profileCounselor.rating || 4.9}</p>
                                        <p className="text-xs text-muted-foreground">Rating</p>
                                    </div>
                                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                                        <Users className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                                        <p className="text-sm font-medium">{profileCounselor.total_sessions || 150}+</p>
                                        <p className="text-xs text-muted-foreground">Sessions</p>
                                    </div>
                                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                                        <Award className="h-5 w-5 mx-auto mb-1 text-green-600" />
                                        <p className="text-sm font-medium">{profileCounselor.experience_years || 8}+</p>
                                        <p className="text-xs text-muted-foreground">Years Exp.</p>
                                    </div>
                                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                                        <MessageCircle className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                                        <p className="text-sm font-medium">{profileCounselor.total_ratings || 45}</p>
                                        <p className="text-xs text-muted-foreground">Reviews</p>
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="bg-muted/30 p-4 rounded-lg">
                                    <h5 className="font-medium mb-2">About</h5>
                                    <p className="text-sm text-muted-foreground">
                                        {profileCounselor.bio || `${profileCounselor.name} is a licensed ${profileCounselor.specialization.toLowerCase()} with extensive experience in providing compassionate and effective counseling services. They are committed to helping clients navigate life's challenges and achieve their personal goals.`}
                                    </p>
                                </div>

                                {/* Certifications */}
                                {(profileCounselor.certifications && profileCounselor.certifications.length > 0) && (
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <h5 className="font-medium mb-3">Certifications</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {profileCounselor.certifications.map((cert, index) => (
                                                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                    <Award className="h-3 w-3 mr-1" />
                                                    {cert}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Rating Section */}
                                <div className="bg-muted/30 p-4 rounded-lg">
                                    <h5 className="font-medium mb-3">Rate This Counselor</h5>
                                    {profileCounselor.has_user_rated ? (
                                        <p className="text-sm text-muted-foreground">You have already rated this counselor.</p>
                                    ) : (
                                        <RatingForm counselorId={profileCounselor.id} onSuccess={() => setShowProfileModal(false)} />
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-3 pt-4 border-t">
                                    <button
                                        onClick={() => {
                                            setShowProfileModal(false);
                                            handleCounselorSelect(profileCounselor);
                                        }}
                                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Book Session
                                    </button>
                                    <button
                                        onClick={() => setShowProfileModal(false)}
                                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Booking Form Modal */}
                {showBookingForm && selectedCounselor && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-card border rounded-xl p-4 sm:p-6 w-full max-w-md mx-4 shadow-2xl">
                            <h3 className="text-lg font-semibold mb-4">Book Session with {selectedCounselor.name}</h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Preferred Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        value={data.scheduled_at}
                                        onChange={(e) => setData('scheduled_at', e.target.value)}
                                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                        placeholder="Select date and time"
                                    />
                                    {errors.scheduled_at && (
                                        <p className="text-sm text-red-600 mt-1">{errors.scheduled_at}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Session Type</label>
                                    <div className="flex space-x-4">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                value="message"
                                                checked={data.session_type === 'message'}
                                                onChange={(e) => setData('session_type', e.target.value as 'message' | 'audio')}
                                                className="text-green-600 focus:ring-green-500"
                                            />
                                            <span className="text-sm">Message Chat</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                value="audio"
                                                checked={data.session_type === 'audio'}
                                                onChange={(e) => setData('session_type', e.target.value as 'message' | 'audio')}
                                                className="text-green-600 focus:ring-green-500"
                                            />
                                            <span className="text-sm">Audio Call</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                        placeholder="Any specific concerns or topics you'd like to discuss..."
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                        {processing ? 'Booking...' : 'Confirm Booking'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowBookingForm(false)}
                                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}