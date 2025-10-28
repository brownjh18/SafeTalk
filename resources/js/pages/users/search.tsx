import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    Search,
    MessageCircle,
    User,
    Shield,
    Heart,
    Mail,
    Plus
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Find Users',
        href: '/users/search',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    verified: boolean;
}

interface UsersSearchProps {
    users: User[];
    currentUser: {
        id: number;
        role: string;
    };
}

export default function UsersSearch({ users = [], currentUser }: UsersSearchProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All Roles');

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            // Don't show current user
            if (user.id === currentUser.id) return false;

            const matchesSearch = searchTerm === '' ||
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole = filterRole === 'All Roles' || user.role === filterRole.toLowerCase();

            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, filterRole, currentUser.id]);

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
            case 'admin': return <Shield className="h-4 w-4" />;
            case 'counselor': return <Heart className="h-4 w-4" />;
            case 'client': return <User className="h-4 w-4" />;
            default: return <User className="h-4 w-4" />;
        }
    };

    const handleStartConversation = (userId: number) => {
        router.post('/conversations/start', {
            other_user_id: userId,
        }, {
            onSuccess: (response: any) => {
                // Redirect to the conversation
                const conversation = response.props?.conversation;
                if (conversation && conversation.id) {
                    if (currentUser.role === 'client') {
                        router.visit(`/client/messages/${conversation.id}`);
                    } else if (currentUser.role === 'counselor') {
                        router.visit(`/counselor/messages/${conversation.id}`);
                    }
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Find Users" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Find Users</h1>
                        <p className="text-muted-foreground">Search and connect with other users</p>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            title="Filter by role"
                        >
                            <option>All Roles</option>
                            <option>Admin</option>
                            <option>Counselor</option>
                            <option>Client</option>
                        </select>
                    </div>
                </div>

                {/* Users List */}
                <div className="rounded-lg border bg-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">User</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Role</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                                    <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="rounded-lg bg-blue-600 p-2">
                                                    {getRoleIcon(user.role)}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium w-fit ${getRoleColor(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                {user.verified ? (
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                                        <span className="text-sm text-green-600">Verified</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                                        <span className="text-sm text-red-600">Unverified</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleStartConversation(user.id)}
                                                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                                >
                                                    <MessageCircle className="h-4 w-4" />
                                                    Start Chat
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Empty State */}
                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            {users.length === 0 ? 'No users found' : 'No users match your search'}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {users.length === 0
                                ? 'There are no other users in the system yet'
                                : 'Try adjusting your search terms or filters'
                            }
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}