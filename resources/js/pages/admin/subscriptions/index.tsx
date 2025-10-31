import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Calendar, DollarSign, Users, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';

interface Subscription {
    id: number;
    status: string;
    start_date: string;
    end_date: string;
    sessions_used: number;
    auto_renew: boolean;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    subscription_plan: {
        id: number;
        name: string;
        price: number;
        billing_cycle: string;
        session_limit: number;
    };
}

interface Props {
    subscriptions: {
        data: Subscription[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats?: {
        total_subscriptions: number;
        active_subscriptions: number;
        total_revenue: number;
        monthly_revenue: number;
    };
}

export default function SubscriptionsIndex({ subscriptions, stats }: Props) {
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

    const defaultStats = {
        total_subscriptions: 0,
        active_subscriptions: 0,
        total_revenue: 0,
        monthly_revenue: 0,
    };

    const currentStats = stats || defaultStats;

    const handleView = (subscription: Subscription) => {
        setSelectedSubscription(subscription);
        setShowViewModal(true);
    };
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-800">Active</Badge>;
            case 'cancelled':
                return <Badge variant="secondary">Cancelled</Badge>;
            case 'expired':
                return <Badge variant="destructive">Expired</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const breadcrumbs = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Subscriptions',
            href: '/admin/subscriptions',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subscriptions" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
                        <p className="text-muted-foreground">
                            Manage user subscriptions and billing.
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{currentStats.total_subscriptions}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{currentStats.active_subscriptions}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(currentStats.total_revenue)}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(currentStats.monthly_revenue)}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Subscriptions Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Subscriptions</CardTitle>
                        <CardDescription>
                            A list of all user subscriptions in the system.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Sessions Used</TableHead>
                                    <TableHead>Revenue</TableHead>
                                    <TableHead>Next Billing</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subscriptions.data.map((subscription) => (
                                    <TableRow key={subscription.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src="" />
                                                    <AvatarFallback>
                                                        {subscription.user.name.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{subscription.user.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {subscription.user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{subscription.subscription_plan.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {formatCurrency(subscription.subscription_plan.price)}/{subscription.subscription_plan.billing_cycle}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(subscription.status)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {subscription.sessions_used} / {subscription.subscription_plan.session_limit || '∞'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {formatCurrency(subscription.subscription_plan.price)}
                                        </TableCell>
                                        <TableCell>
                                            {subscription.end_date ? (
                                                <div className="text-sm">
                                                    {new Date(subscription.end_date).toLocaleDateString()}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm" onClick={() => handleView(subscription)} title="View Details">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {subscriptions.data.length === 0 && (
                            <div className="text-center py-8">
                                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No subscriptions yet</h3>
                                <p className="text-muted-foreground">
                                    Users will appear here once they subscribe to plans.
                                </p>
                            </div>
                        )}

                {/* View Details Modal */}
                <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                Subscription Details
                            </DialogTitle>
                            <DialogDescription>
                                Detailed information about this subscription
                            </DialogDescription>
                        </DialogHeader>

                        {selectedSubscription && (
                            <div className="space-y-6">
                                {/* User Information */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <h4 className="font-semibold mb-3">User Information</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src="" />
                                                    <AvatarFallback>
                                                        {selectedSubscription.user.name.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{selectedSubscription.user.name}</div>
                                                    <div className="text-sm text-muted-foreground">{selectedSubscription.user.email}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-3">Subscription Status</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">Status:</span>
                                                {getStatusBadge(selectedSubscription.status)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">Auto Renew:</span>
                                                <Badge variant={selectedSubscription.auto_renew ? "default" : "secondary"}>
                                                    {selectedSubscription.auto_renew ? "Enabled" : "Disabled"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Plan Information */}
                                <div>
                                    <h4 className="font-semibold mb-3">Plan Details</h4>
                                    <Card>
                                        <CardContent className="pt-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div>
                                                    <h5 className="font-medium mb-2">Plan Information</h5>
                                                    <div className="space-y-1 text-sm">
                                                        <p><span className="font-medium">Name:</span> {selectedSubscription.subscription_plan.name}</p>
                                                        <p><span className="font-medium">Price:</span> {formatCurrency(selectedSubscription.subscription_plan.price)}</p>
                                                        <p><span className="font-medium">Billing Cycle:</span> {selectedSubscription.subscription_plan.billing_cycle}</p>
                                                        <p><span className="font-medium">Session Limit:</span> {selectedSubscription.subscription_plan.session_limit || 'Unlimited'}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h5 className="font-medium mb-2">Usage Statistics</h5>
                                                    <div className="space-y-1 text-sm">
                                                        <p><span className="font-medium">Sessions Used:</span> {selectedSubscription.sessions_used}</p>
                                                        <p><span className="font-medium">Sessions Remaining:</span> {
                                                            selectedSubscription.subscription_plan.session_limit
                                                                ? selectedSubscription.subscription_plan.session_limit - selectedSubscription.sessions_used
                                                                : 'Unlimited'
                                                        }</p>
                                                        <p><span className="font-medium">Usage Rate:</span> {
                                                            selectedSubscription.subscription_plan.session_limit
                                                                ? `${Math.round((selectedSubscription.sessions_used / selectedSubscription.subscription_plan.session_limit) * 100)}%`
                                                                : 'N/A'
                                                        }</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Dates and Timeline */}
                                <div>
                                    <h4 className="font-semibold mb-3">Subscription Timeline</h4>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm">Start Date</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-lg font-semibold">
                                                    {new Date(selectedSubscription.start_date).toLocaleDateString()}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(selectedSubscription.start_date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm">End Date</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-lg font-semibold">
                                                    {selectedSubscription.end_date ? new Date(selectedSubscription.end_date).toLocaleDateString() : 'N/A'}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {selectedSubscription.end_date ?
                                                        new Date(selectedSubscription.end_date).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        }) : 'No end date set'
                                                    }
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm">Days Remaining</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {selectedSubscription.end_date ? (
                                                    <>
                                                        <div className="text-lg font-semibold">
                                                            {Math.max(0, Math.ceil((new Date(selectedSubscription.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(selectedSubscription.end_date) < new Date() ? 'Expired' : 'Active'}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <div className="text-lg font-semibold">∞</div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>

                                {/* Financial Information */}
                                <div>
                                    <h4 className="font-semibold mb-3">Financial Summary</h4>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm">Total Paid</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">
                                                    {formatCurrency(selectedSubscription.subscription_plan.price)}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    For {selectedSubscription.subscription_plan.billing_cycle} plan
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm">Cost per Session</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">
                                                    {selectedSubscription.subscription_plan.session_limit
                                                        ? formatCurrency(selectedSubscription.subscription_plan.price / selectedSubscription.subscription_plan.session_limit)
                                                        : 'N/A'
                                                    }
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {selectedSubscription.subscription_plan.session_limit
                                                        ? `Based on ${selectedSubscription.subscription_plan.session_limit} session limit`
                                                        : 'Unlimited sessions'
                                                    }
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>

                                {/* Metadata */}
                                <div className="text-xs text-muted-foreground border-t pt-4">
                                    <p>Subscription ID: {selectedSubscription.id}</p>
                                    <p>Created: {new Date(selectedSubscription.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
