import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Activity, Clock } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'All Activity',
        href: '/activity',
    },
];

interface ActivityItem {
    id: string;
    title: string;
    type: string;
    description: string;
    program?: string;
    facility?: string;
    project?: string;
    created_at: string;
    color: string;
}

interface ActivityProps {
    activities: ActivityItem[];
}

export default function ActivityPage({ activities }: ActivityProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Activity" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">All Activity</h1>
                        <p className="text-muted-foreground">Complete log of recent activities across all modules</p>
                        <div className="flex items-center space-x-2 mt-2">
                            <Activity className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-blue-600 font-medium">Live Updates</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Last updated: {new Date().toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Activity List */}
                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Recent Activities</h2>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Activity className="h-4 w-4" />
                            <span>{activities.length} activities</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {activities.map((activity) => {
                            const colorClasses = {
                                green: "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800",
                                blue: "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800",
                                orange: "bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800",
                            };
                            const textClasses = {
                                green: "text-green-800 dark:text-green-200",
                                blue: "text-blue-800 dark:text-blue-200",
                                orange: "text-orange-800 dark:text-orange-200",
                            };
                            const bgClasses = {
                                green: "bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300",
                                blue: "bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300",
                                orange: "bg-orange-200 dark:bg-orange-800 text-orange-700 dark:text-orange-300",
                            };
                            const subTextClasses = {
                                green: "text-green-700 dark:text-green-300",
                                blue: "text-blue-700 dark:text-blue-300",
                                orange: "text-orange-700 dark:text-orange-300",
                            };
                            const subTextClasses2 = {
                                green: "text-green-600 dark:text-green-400",
                                blue: "text-blue-600 dark:text-blue-400",
                                orange: "text-orange-600 dark:text-orange-400",
                            };
                            const dotClasses = {
                                green: "bg-green-500",
                                blue: "bg-blue-500",
                                orange: "bg-orange-500",
                            };
                            return (
                                <div key={activity.id} className={`flex items-start space-x-4 p-4 rounded-lg ${colorClasses[activity.color as keyof typeof colorClasses]}`}>
                                    <div className={`w-3 h-3 ${dotClasses[activity.color as keyof typeof dotClasses]} rounded-full mt-2`}></div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <p className={`font-semibold ${textClasses[activity.color as keyof typeof textClasses]}`}>{activity.title}</p>
                                            <span className={`text-xs ${bgClasses[activity.color as keyof typeof bgClasses]} px-2 py-0.5 rounded-full`}>{activity.type}</span>
                                        </div>
                                        <p className={`text-sm ${subTextClasses[activity.color as keyof typeof subTextClasses]} mb-2`}>{activity.description}</p>
                                        {activity.program && <p className={`text-xs ${subTextClasses2[activity.color as keyof typeof subTextClasses2]}`}>Program: {activity.program}</p>}
                                        {activity.facility && <p className={`text-xs ${subTextClasses2[activity.color as keyof typeof subTextClasses2]}`}>Facility: {activity.facility}</p>}
                                        {activity.project && <p className={`text-xs ${subTextClasses2[activity.color as keyof typeof subTextClasses2]}`}>Project: {activity.project}</p>}
                                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                                            <span>⏱️ {activity.created_at}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
