import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import programs from '@/routes/programs';
import projects from '@/routes/projects';
import facilities from '@/routes/facilities';
import services from '@/routes/services';
import equipment from '@/routes/equipment';
import participants from '@/routes/participants';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Briefcase,
    Folder,
    Settings,
    Building2,
    Users,
    Target,
    Wrench,
    Plus,
    TrendingUp,
    Activity,
    Clock,
    GraduationCap,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    Calendar,
    CheckCircle,
    AlertCircle,
    Info,
    Zap,
    Award,
    BookOpen,
    Lightbulb
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardCardProps {
    title: string;
    description: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    color?: string;
}

function DashboardCard({ title, description, href, icon: Icon, count, color = "blue" }: DashboardCardProps) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
        green: "bg-green-50 text-green-600 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800",
        purple: "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800",
        orange: "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800",
        red: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-800",
        teal: "bg-teal-50 text-teal-600 border-teal-200 dark:bg-teal-950 dark:text-teal-400 dark:border-teal-800",
        pink: "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-950 dark:text-pink-400 dark:border-pink-800",
    };

    return (
        <Link
            href={href}
            className={`group relative overflow-hidden rounded-xl border p-6 transition-all hover:shadow-lg hover:-translate-y-1 ${colorClasses[color as keyof typeof colorClasses]}`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className={`rounded-lg p-2 ${colorClasses[color as keyof typeof colorClasses].replace('bg-', 'bg-').replace('text-', 'text-').split(' ')[0]}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{title}</h3>
                        <p className="text-sm opacity-75">{description}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {count !== undefined && (
                        <span className="text-2xl font-bold">{count}</span>
                    )}
                    <Plus className="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
        </Link>
    );
}

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Capstone Project Dashboard</h1>
                        <p className="text-muted-foreground">Unified platform for student teams running real-world projects at government facilities</p>
                        <div className="flex items-center space-x-2 mt-2">
                            <GraduationCap className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-blue-600 font-medium">Aligned with Uganda NDPIII & Digital Transformation Roadmap</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Last updated: {new Date().toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Enhanced Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-lg bg-blue-600 p-2">
                                    <Briefcase className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Programs</p>
                                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">5</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center text-green-600 text-sm font-medium">
                                    <ArrowUpRight className="h-4 w-4 mr-1" />
                                    +12%
                                </div>
                                <p className="text-xs text-blue-600 dark:text-blue-400">vs last month</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                            <p className="text-xs text-blue-600 dark:text-blue-400">NDPIII Aligned Programs</p>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950 dark:to-green-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-lg bg-green-600 p-2">
                                    <Folder className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Student Projects</p>
                                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">23</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center text-green-600 text-sm font-medium">
                                    <ArrowUpRight className="h-4 w-4 mr-1" />
                                    +8%
                                </div>
                                <p className="text-xs text-green-600 dark:text-green-400">vs last month</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                            <p className="text-xs text-green-600 dark:text-green-400">4IR Innovation Projects</p>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950 dark:to-purple-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-lg bg-purple-600 p-2">
                                    <Building2 className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Gov't Facilities</p>
                                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">8</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center text-red-600 text-sm font-medium">
                                    <ArrowDownRight className="h-4 w-4 mr-1" />
                                    -2%
                                </div>
                                <p className="text-xs text-purple-600 dark:text-purple-400">maintenance</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
                            <p className="text-xs text-purple-600 dark:text-purple-400">Active Partner Sites</p>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950 dark:to-orange-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-lg bg-orange-600 p-2">
                                    <Users className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Participants</p>
                                    <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">147</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center text-green-600 text-sm font-medium">
                                    <ArrowUpRight className="h-4 w-4 mr-1" />
                                    +15%
                                </div>
                                <p className="text-xs text-orange-600 dark:text-orange-400">new enrollments</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-800">
                            <p className="text-xs text-orange-600 dark:text-orange-400">Students & Mentors</p>
                        </div>
                    </div>
                </div>

                {/* Project Progress Overview */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">Project Progress</h2>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-muted-foreground">This Month</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <span className="font-medium">Completed</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-green-600 h-2 rounded-full" style={{width: '35%'}}></div>
                                    </div>
                                    <span className="text-sm font-medium">8/23</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Clock className="h-5 w-5 text-yellow-600" />
                                    <span className="font-medium">In Progress</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-yellow-600 h-2 rounded-full" style={{width: '45%'}}></div>
                                    </div>
                                    <span className="text-sm font-medium">10/23</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Info className="h-5 w-5 text-blue-600" />
                                    <span className="font-medium">Planning</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '20%'}}></div>
                                    </div>
                                    <span className="text-sm font-medium">5/23</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">Recent Achievements</h2>
                            <button className="p-2 hover:bg-muted rounded-lg">
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
                                <Award className="h-5 w-5 text-yellow-600 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-sm">NDPIII Milestone Reached</p>
                                    <p className="text-xs text-muted-foreground">Digital Health Program completed Phase 2</p>
                                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                                <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-sm">New Innovation Approved</p>
                                    <p className="text-xs text-muted-foreground">IoT Smart Agriculture System</p>
                                    <p className="text-xs text-muted-foreground mt-1">4 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                                <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-sm">Equipment Upgraded</p>
                                    <p className="text-xs text-muted-foreground">3D Printer calibration completed</p>
                                    <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Module Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <DashboardCard
                        title="Programs"
                        description="NDPIII-aligned innovation programs"
                        href={programs.index().url}
                        icon={Briefcase}
                        count={5}
                        color="blue"
                    />
                    <DashboardCard
                        title="Projects"
                        description="4IR student projects at government facilities"
                        href={projects.index().url}
                        icon={Folder}
                        count={23}
                        color="green"
                    />
                    <DashboardCard
                        title="Facilities"
                        description="Government partner sites and labs"
                        href={facilities.index().url}
                        icon={Building2}
                        count={8}
                        color="purple"
                    />
                    <DashboardCard
                        title="Services"
                        description="Technical services and training programs"
                        href={services.index().url}
                        icon={Settings}
                        count={12}
                        color="orange"
                    />
                    <DashboardCard
                        title="Equipment"
                        description="Lab equipment and prototyping tools"
                        href={equipment.index().url}
                        icon={Wrench}
                        count={34}
                        color="red"
                    />
                    <DashboardCard
                        title="Participants"
                        description="Students, mentors, and industry partners"
                        href={participants.index().url}
                        icon={Users}
                        count={147}
                        color="indigo"
                    />
                    <DashboardCard
                        title="Outcomes"
                        description="Project deliverables and commercialization"
                        href={projects.index().url}
                        icon={Target}
                        count={18}
                        color="teal"
                    />
                    <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-slate-50 to-gray-100/50 dark:from-slate-950 dark:to-gray-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <BookOpen className="h-8 w-8 text-slate-600 dark:text-slate-400 mx-auto mb-2" />
                                <p className="font-medium text-slate-700 dark:text-slate-300">Documentation</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Guides & Resources</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Recent Activity */}
                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Recent Capstone Activity</h2>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Activity className="h-4 w-4" />
                            <span>Live Updates</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800">
                            <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <p className="font-semibold text-green-800 dark:text-green-200">New 4IR Project Approved</p>
                                    <span className="text-xs bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">New</span>
                                </div>
                                <p className="text-sm text-green-700 dark:text-green-300 mb-2">IoT Smart Agriculture System with soil moisture sensors</p>
                                <div className="flex items-center space-x-4 text-xs text-green-600 dark:text-green-400">
                                    <span>📁 3 outcomes expected</span>
                                    <span>👥 6 participants</span>
                                    <span>⏱️ 2 hours ago</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border border-blue-200 dark:border-blue-800">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <p className="font-semibold text-blue-800 dark:text-blue-200">Students Assigned to Facility</p>
                                    <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">Assignment</span>
                                </div>
                                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">8 Computer Science students joined Makerere Innovation Lab</p>
                                <div className="flex items-center space-x-4 text-xs text-blue-600 dark:text-blue-400">
                                    <span>🏢 Makerere Innovation Lab</span>
                                    <span>👨‍🏫 2 supervisors</span>
                                    <span>⏱️ 4 hours ago</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 border border-orange-200 dark:border-orange-800">
                            <div className="w-3 h-3 bg-orange-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <p className="font-semibold text-orange-800 dark:text-orange-200">Equipment Maintenance Completed</p>
                                    <span className="text-xs bg-orange-200 dark:bg-orange-800 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full">Maintenance</span>
                                </div>
                                <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">CNC machines and 3D printers calibrated and ready for prototyping</p>
                                <div className="flex items-center space-x-4 text-xs text-orange-600 dark:text-orange-400">
                                    <span>🔧 5 machines serviced</span>
                                    <span>⚡ All systems operational</span>
                                    <span>⏱️ 1 day ago</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 border border-purple-200 dark:border-purple-800">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <p className="font-semibold text-purple-800 dark:text-purple-200">NDPIII Program Milestone</p>
                                    <span className="text-xs bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">Milestone</span>
                                </div>
                                <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">Digital Health Innovation Program successfully completed Phase 2</p>
                                <div className="flex items-center space-x-4 text-xs text-purple-600 dark:text-purple-400">
                                    <span>🏆 Phase 2/4 completed</span>
                                    <span>📊 85% deliverables met</span>
                                    <span>⏱️ 2 days ago</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                        <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                            View All Activity →
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
