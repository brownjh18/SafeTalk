import AppLayout from '@/layouts/app-layout';
import usersRoutes from '@/routes/users';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Users,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    CheckCircle,
    XCircle,
    MoreHorizontal,
    ChevronDown,
    UserCheck,
    UserX,
    Shield,
    Heart,
    User,
    X
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Users',
        href: usersRoutes.index().url,
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    verified: boolean;
    created_at: string;
}

interface UsersIndexProps {
    users: User[];
    success?: string;
}

export default function UsersIndex({ users = [], success }: UsersIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All Roles');
    const [filterStatus, setFilterStatus] = useState('All Status');
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [loadingUserProfile, setLoadingUserProfile] = useState(false);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch = searchTerm === '' ||
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole = filterRole === 'All Roles' || user.role === filterRole.toLowerCase();

            const matchesStatus = filterStatus === 'All Status' ||
                (filterStatus === 'Verified' && user.verified) ||
                (filterStatus === 'Unverified' && !user.verified);

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchTerm, filterRole, filterStatus]);

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

    const handleDelete = (userId: number) => {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            router.delete(usersRoutes.destroy(userId).url, {
                onSuccess: () => {
                    // Success message will be handled by the server redirect
                },
            });
        }
    };

    const handleVerify = (userId: number) => {
        if (confirm('Are you sure you want to verify this user?')) {
            router.post(usersRoutes.verify(userId).url, {}, {
                onSuccess: () => {
                    // Success message will be handled by the server redirect
                },
            });
        }
    };

    const handleViewUserProfile = async (userId: number) => {
        setSelectedUser(null);
        setLoadingUserProfile(true);
        setShowUserProfile(true);

        try {
            const response = await fetch(`http://127.0.0.1:8000/users/${userId}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setSelectedUser(data);
            } else {
                console.error('Failed to fetch user profile:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        } finally {
            setLoadingUserProfile(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Success Message */}
                {success && (
                    <Alert className="mb-4">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">User Management</h1>
                        <p className="text-muted-foreground">Manage admins, counselors, and clients</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link
                            href={usersRoutes.create().url}
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            Add User
                        </Link>
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
                        <Filter className="h-4 w-4 text-muted-foreground" />
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
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            title="Filter by status"
                        >
                            <option>All Status</option>
                            <option>Verified</option>
                            <option>Unverified</option>
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
                                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Joined</th>
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
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-red-600" />
                                                )}
                                                <span className="text-sm">
                                                    {user.verified ? 'Verified' : 'Unverified'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {user.created_at}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleViewUserProfile(user.id)}
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                    title="View User Profile"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <Link
                                                    href={usersRoutes.edit(user.id).url}
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                    title="Edit User"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                {!user.verified && (
                                                    <button
                                                        onClick={() => handleVerify(user.id)}
                                                        className="p-2 hover:bg-green-100 hover:text-green-600 rounded-lg transition-colors"
                                                        title="Verify User"
                                                    >
                                                        <UserCheck className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* User Profile Modal */}
                {showUserProfile && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-card border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold">User Profile</h3>
                                    <button
                                        onClick={() => setShowUserProfile(false)}
                                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                                        title="Close dialog"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                {loadingUserProfile ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <span className="ml-2">Loading user profile...</span>
                                    </div>
                                ) : selectedUser ? (
                                    <div className="space-y-6">
                                        {/* Profile Header */}
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                <span className="text-2xl font-bold text-blue-600">
                                                    {selectedUser.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-semibold">{selectedUser.name}</h4>
                                                <p className="text-muted-foreground">{selectedUser.email}</p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                                        selectedUser.verified
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                    }`}>
                                                        {selectedUser.verified ? 'Verified' : 'Unverified'}
                                                    </span>
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                                        selectedUser.role === 'admin'
                                                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                            : selectedUser.role === 'counselor'
                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                    }`}>
                                                        {selectedUser.role}
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
                                                        <span className="text-sm">{new Date(selectedUser.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium">Last Updated:</span>
                                                        <span className="text-sm">{new Date(selectedUser.updated_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium">Role:</span>
                                                        <span className="text-sm capitalize">{selectedUser.role}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h5 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Quick Actions</h5>
                                                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                                                    <Link
                                                        href={usersRoutes.edit(selectedUser.id).url}
                                                        className="w-full text-left p-2 hover:bg-muted rounded-lg transition-colors block"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <Edit className="h-4 w-4" />
                                                            <span className="text-sm">Edit User</span>
                                                        </div>
                                                    </Link>
                                                    {!selectedUser.verified && (
                                                        <button
                                                            onClick={() => {
                                                                setShowUserProfile(false);
                                                                handleVerify(selectedUser.id);
                                                            }}
                                                            className="w-full text-left p-2 hover:bg-green-100 hover:text-green-600 rounded-lg transition-colors"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <UserCheck className="h-4 w-4" />
                                                                <span className="text-sm">Verify User</span>
                                                            </div>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Info */}
                                        <div className="bg-muted/30 p-4 rounded-lg">
                                            <p className="text-sm text-muted-foreground">
                                                This is a quick preview of the user's profile. For more detailed management options,
                                                use the edit button above.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                                        <p className="text-red-600">Failed to load user profile</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            {users.length === 0 ? 'No users found' : 'No users match your search'}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {users.length === 0
                                ? 'Get started by adding your first user'
                                : 'Try adjusting your search terms or filters'
                            }
                        </p>
                        {users.length === 0 && (
                            <Link
                                href={usersRoutes.create().url}
                                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4" />
                                Add User
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
