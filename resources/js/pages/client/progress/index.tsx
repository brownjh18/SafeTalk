import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    FileText,
    Calendar,
    TrendingUp,
    Eye,
    Download
} from 'lucide-react';
import { useState, useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/client/dashboard',
    },
    {
        title: 'Progress Reports',
        href: '/client/progress',
    },
];

interface ProgressReport {
    id: number;
    session_id: number;
    notes: string;
    progress_level: string;
    created_at: string;
    session: {
        scheduled_at: string;
        counselor: {
            name: string;
            email: string;
        };
    };
}

interface ReportStats {
    total_reports: number;
    this_month: number;
}

interface ClientProgressProps {
    reports: {
        data: ProgressReport[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: ReportStats;
}

export default function ClientProgress({ reports, stats }: ClientProgressProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMonth, setFilterMonth] = useState('All Time');

    const filteredReports = useMemo(() => {
        return reports.data.filter((report) => {
            const matchesSearch = searchTerm === '' ||
                report.session.counselor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.session.counselor.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesMonth = filterMonth === 'All Time' || 
                new Date(report.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) === filterMonth;

            return matchesSearch && matchesMonth;
        });
    }, [reports.data, searchTerm, filterMonth]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Progress" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">My Progress</h1>
                        <p className="text-muted-foreground">Track your counseling progress and session outcomes</p>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        <Download className="h-4 w-4" />
                        Export Reports
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                                <p className="text-2xl font-bold">{stats.total_reports}</p>
                            </div>
                            <FileText className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                                <p className="text-2xl font-bold">{stats.this_month}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search by counselor name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-input bg-background pl-3 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <select
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option>All Time</option>
                            <option>October 2025</option>
                            <option>September 2025</option>
                        </select>
                    </div>
                </div>

                {/* Reports List */}
                <div className="rounded-xl border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-4">All Reports</h3>

                    <div className="space-y-4">
                        {filteredReports.map((report) => (
                            <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <p className="font-medium">{report.session.counselor.name}</p>
                                            <span className="text-sm text-muted-foreground">counselor</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{report.session.counselor.email}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Session: {new Date(report.session.scheduled_at).toLocaleDateString()}
                                        </p>
                                        {report.notes && (
                                            <p className="text-xs text-muted-foreground mt-1">{report.notes}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                        {report.progress_level}
                                    </span>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">
                                            {new Date(report.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button className="p-1.5 hover:bg-muted rounded-lg" title="View Details">
                                        <Eye className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredReports.length === 0 && (
                        <div className="text-center py-8">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">No reports found matching your criteria</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}