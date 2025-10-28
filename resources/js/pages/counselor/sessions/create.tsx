import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    Calendar,
    Clock,
    UserCheck,
    Heart,
    CheckCircle,
    ArrowLeft
} from 'lucide-react';
import { Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/counselor/dashboard',
    },
    {
        title: 'Sessions',
        href: '/counselor/sessions',
    },
    {
        title: 'Schedule Session',
        href: '/counselor/sessions/create',
    },
];

interface Client {
    id: number;
    name: string;
    email: string;
}

interface CreateSessionProps {
    clients: Client[];
}

export default function CreateSession({ clients }: CreateSessionProps) {
    const { data, setData, post, processing, reset, errors } = useForm({
        client_id: '',
        scheduled_at: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/counselor/sessions', {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedule Session" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <Link
                            href="/counselor/sessions"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Sessions
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-bold">Schedule New Session</h1>
                        <p className="text-muted-foreground text-sm sm:text-base">Book a counseling session with one of your clients</p>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-2xl">
                    <div className="rounded-xl border bg-card p-4 sm:p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="client-select" className="block text-sm font-medium mb-2">Select Client</label>
                                <select
                                    id="client-select"
                                    value={data.client_id}
                                    onChange={(e) => setData('client_id', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Choose a client...</option>
                                    {clients.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.name} ({client.email})
                                        </option>
                                    ))}
                                </select>
                                {errors.client_id && (
                                    <p className="text-sm text-red-600 mt-1">{errors.client_id}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="session-datetime" className="block text-sm font-medium mb-2">Session Date & Time</label>
                                <input
                                    id="session-datetime"
                                    type="datetime-local"
                                    value={data.scheduled_at}
                                    onChange={(e) => setData('scheduled_at', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    placeholder="Select date and time"
                                />
                                {errors.scheduled_at && (
                                    <p className="text-sm text-red-600 mt-1">{errors.scheduled_at}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Session Notes (Optional)</label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={4}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Any specific topics or concerns to address in this session..."
                                />
                                {errors.notes && (
                                    <p className="text-sm text-red-600 mt-1">{errors.notes}</p>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <CheckCircle className="h-4 w-4" />
                                    {processing ? 'Scheduling...' : 'Schedule Session'}
                                </button>
                                <Link
                                    href="/counselor/sessions"
                                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}