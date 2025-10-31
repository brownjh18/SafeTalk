import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Eye, Trash2, CheckCircle, XCircle, X, Power, PowerOff } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface SubscriptionPlan {
    id: number;
    name: string;
    description: string;
    price: number;
    billing_cycle: 'monthly' | 'yearly';
    session_limit: number;
    features: string[];
    is_active: boolean;
    sort_order: number;
    created_at: string;
}

interface Props {
    plans: {
        data: SubscriptionPlan[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

import AppLayout from '@/layouts/app-layout';

export default function SubscriptionPlansIndex({ plans }: Props) {
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        price: '',
        billing_cycle: 'monthly',
        session_limit: '',
        features: [''],
        is_active: true,
        sort_order: 0,
    });

    const breadcrumbs = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Subscription Plans',
            href: '/admin/subscription-plans',
        },
    ];

    const handleView = (plan: SubscriptionPlan) => {
        setSelectedPlan(plan);
        setShowViewModal(true);
    };

    const handleEdit = (plan: SubscriptionPlan) => {
        setSelectedPlan(plan);
        setEditForm({
            name: plan.name,
            description: plan.description,
            price: plan.price.toString(),
            billing_cycle: plan.billing_cycle,
            session_limit: plan.session_limit?.toString() || '',
            features: plan.features.length > 0 ? plan.features : [''],
            is_active: plan.is_active,
            sort_order: plan.sort_order,
        });
        setShowEditModal(true);
    };

    const handleToggleActive = (plan: SubscriptionPlan) => {
        router.put(`/admin/subscription-plans/${plan.id}`, {
            ...plan,
            is_active: !plan.is_active,
        }, {
            onSuccess: () => {
                // Refresh the page or update local state
                window.location.reload();
            },
        });
    };

    const handleDelete = (plan: SubscriptionPlan) => {
        setSelectedPlan(plan);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedPlan) return;

        router.delete(`/admin/subscription-plans/${selectedPlan.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedPlan(null);
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlan) return;

        router.put(`/admin/subscription-plans/${selectedPlan.id}`, editForm, {
            onSuccess: () => {
                setShowEditModal(false);
                setSelectedPlan(null);
            },
        });
    };

    const addFeature = () => {
        setEditForm(prev => ({
            ...prev,
            features: [...prev.features, '']
        }));
    };

    const removeFeature = (index: number) => {
        setEditForm(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const updateFeature = (index: number, value: string) => {
        setEditForm(prev => ({
            ...prev,
            features: prev.features.map((feature, i) => i === index ? value : feature)
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subscription Plans" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
                        <p className="text-muted-foreground">
                            Manage subscription plans and pricing.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/subscription-plans/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Plan
                        </Link>
                    </Button>
                </div>

                {/* Plans Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {plans.data.map((plan) => (
                        <Card key={plan.id} className="relative">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        {plan.name}
                                    </CardTitle>
                                    <Badge variant={plan.is_active ? "default" : "secondary"}>
                                        {plan.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                                <CardDescription>{plan.description}</CardDescription>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold">
                                        ${plan.price}
                                    </span>
                                    <span className="text-muted-foreground">
                                        /{plan.billing_cycle}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium mb-2">Plan Details:</p>
                                    <ul className="space-y-1 text-sm">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            {plan.session_limit ? `${plan.session_limit} sessions` : 'Unlimited sessions'}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            {plan.billing_cycle} billing
                                        </li>
                                        {plan.features.slice(0, 2).map((feature, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                        {plan.features.length > 2 && (
                                            <li className="text-muted-foreground">
                                                +{plan.features.length - 2} more features
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                <div className="flex gap-1 pt-2">
                                    <Button variant="outline" size="sm" onClick={() => handleView(plan)} title="View Plan">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleEdit(plan)} title="Edit Plan">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleToggleActive(plan)}
                                        title={plan.is_active ? "Deactivate Plan" : "Activate Plan"}
                                        className={plan.is_active ? "text-green-600 hover:text-green-700" : "text-gray-600 hover:text-gray-700"}
                                    >
                                        {plan.is_active ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDelete(plan)} title="Delete Plan" className="text-red-600 hover:text-red-700">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {plans.data.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No subscription plans yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Create your first subscription plan to get started.
                            </p>
                            <Button asChild>
                                <Link href="/admin/subscription-plans/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Plan
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* View Modal */}
                <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                {selectedPlan?.name}
                            </DialogTitle>
                            <DialogDescription>
                                View subscription plan details
                            </DialogDescription>
                        </DialogHeader>

                        {selectedPlan && (
                            <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <h4 className="font-semibold mb-2">Basic Information</h4>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-medium">Name:</span> {selectedPlan.name}</p>
                                            <p><span className="font-medium">Description:</span> {selectedPlan.description}</p>
                                            <p><span className="font-medium">Status:</span>
                                                <Badge variant={selectedPlan.is_active ? "default" : "secondary"} className="ml-2">
                                                    {selectedPlan.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </p>
                                            <p><span className="font-medium">Sort Order:</span> {selectedPlan.sort_order}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">Pricing & Limits</h4>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-medium">Price:</span> ${selectedPlan.price}</p>
                                            <p><span className="font-medium">Billing Cycle:</span> {selectedPlan.billing_cycle}</p>
                                            <p><span className="font-medium">Session Limit:</span> {selectedPlan.session_limit || 'Unlimited'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">Features</h4>
                                    <ul className="space-y-1">
                                        {selectedPlan.features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="text-xs text-muted-foreground">
                                    Created: {new Date(selectedPlan.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Edit Modal */}
                <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Edit className="h-5 w-5" />
                                Edit Subscription Plan
                            </DialogTitle>
                            <DialogDescription>
                                Update subscription plan details
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleEditSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold">Basic Information</h4>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit-name">Plan Name</Label>
                                        <Input
                                            id="edit-name"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit-description">Description</Label>
                                        <Textarea
                                            id="edit-description"
                                            value={editForm.description}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit-sort_order">Sort Order</Label>
                                        <Input
                                            id="edit-sort_order"
                                            type="number"
                                            value={editForm.sort_order}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                                            min="0"
                                        />
                                    </div>
                                </div>

                                {/* Pricing & Limits */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold">Pricing & Limits</h4>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-price">Price</Label>
                                            <Input
                                                id="edit-price"
                                                type="number"
                                                step="0.01"
                                                value={editForm.price}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="edit-billing_cycle">Billing Cycle</Label>
                                            <Select
                                                value={editForm.billing_cycle}
                                                onValueChange={(value) => setEditForm(prev => ({ ...prev, billing_cycle: value }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="monthly">Monthly</SelectItem>
                                                    <SelectItem value="yearly">Yearly</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit-session_limit">Session Limit</Label>
                                        <Input
                                            id="edit-session_limit"
                                            type="number"
                                            value={editForm.session_limit}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, session_limit: e.target.value }))}
                                            placeholder="Leave empty for unlimited"
                                            min="0"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="edit-is_active"
                                            checked={editForm.is_active}
                                            onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, is_active: !!checked }))}
                                        />
                                        <Label htmlFor="edit-is_active">Active Plan</Label>
                                    </div>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold">Plan Features</h4>
                                    <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Feature
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    {editForm.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                value={feature}
                                                onChange={(e) => updateFeature(index, e.target.value)}
                                                placeholder={`Feature ${index + 1}`}
                                                className="flex-1"
                                            />
                                            {editForm.features.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeFeature(index)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Update Plan
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-red-600">
                                <Trash2 className="h-5 w-5" />
                                Delete Subscription Plan
                            </DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete "{selectedPlan?.name}"? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex justify-end gap-4 mt-6">
                            <Button type="button" variant="outline" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </Button>
                            <Button type="button" variant="destructive" onClick={confirmDelete}>
                                Delete Plan
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
