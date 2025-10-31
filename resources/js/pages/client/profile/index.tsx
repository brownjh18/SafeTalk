import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    User,
    Mail,
    Phone,
    Calendar,
    Edit,
    Save
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/client/dashboard',
    },
    {
        title: 'My Profile',
        href: '/client/profile',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    date_of_birth?: string;
    address?: string;
    emergency_contact?: string;
    created_at: string;
}

interface ClientProfileProps {
    user: User;
}

export default function ClientProfile({ user }: ClientProfileProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        date_of_birth: user.date_of_birth || '',
        address: user.address || '',
        emergency_contact: user.emergency_contact || '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // In a real app, send data to backend
        setIsEditing(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Profile" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">My Profile</h1>
                        <p className="text-muted-foreground">Manage your personal information and preferences</p>
                    </div>
                    <button 
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                </div>

                {/* Profile Card */}
                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{user.name}</h2>
                            <p className="text-muted-foreground">Client since {new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="text-sm font-medium">{user.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="text-sm font-medium flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        {user.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="text-sm font-medium flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        {user.phone || 'Not provided'}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        value={formData.date_of_birth}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="text-sm font-medium flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {user.date_of_birth || 'Not provided'}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Address</label>
                                {isEditing ? (
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="text-sm font-medium">{user.address || 'Not provided'}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Emergency Contact</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="emergency_contact"
                                        value={formData.emergency_contact}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="text-sm font-medium">{user.emergency_contact || 'Not provided'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
