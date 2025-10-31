import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    User,
    Mail,
    Shield,
    Heart,
    CheckCircle,
    XCircle,
    Calendar
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Users',
        href: '/users',
    },
];

interface UserShowProps {
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        verified: boolean;
        created_at: string;
        updated_at: string;
    };
}

export default function UserShow({ user }: UserShowProps) {
    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'counselor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'client': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin': return <Shield className="h-5 w-5" />;
            case 'counselor': return <Heart className="h-5 w-5" />;
            case 'client': return <User className="h-5 w-5" />;
            default: return <User className="h-5 w-5" />;
        }
    };

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: user.name, href: `/users/${user.id}` }]}>
            <Head title={`User: ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">User Details</h1>
                        <p className="text-muted-foreground">View user information and details</p>
                    </div>
                </div>

                {/* User Details Card */}
                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-start space-x-6">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                                {getRoleIcon(user.role)}
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold">{user.name}</h2>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium w-fit ${getRoleColor(user.role)}`}>
                                        {user.role}
                                    </span>
                                    <div className="flex items-center space-x-1">
                                        {user.verified ? (
                                            <>
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                <span className="text-sm text-green-600">Verified</span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="h-4 w-4 text-red-600" />
                                                <span className="text-sm text-red-600">Unverified</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <Mail className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Email</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Joined</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(user.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">User ID</p>
                                            <p className="text-sm text-muted-foreground">#{user.id}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Last Updated</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(user.updated_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
