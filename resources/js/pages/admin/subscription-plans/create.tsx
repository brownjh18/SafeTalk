import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function SubscriptionPlansCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        price: '',
        billing_cycle: 'monthly',
        session_limit: '',
        features: [''],
        is_active: true,
        sort_order: 0,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/subscription-plans');
    };

    const addFeature = () => {
        setData('features', [...data.features, '']);
    };

    const removeFeature = (index: number) => {
        const newFeatures = data.features.filter((_, i) => i !== index);
        setData('features', newFeatures);
    };

    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...data.features];
        newFeatures[index] = value;
        setData('features', newFeatures);
    };

    const breadcrumbs = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Subscription Plans',
            href: '/admin/subscription-plans',
        },
        {
            title: 'Create',
            href: '/admin/subscription-plans/create',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Subscription Plan" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create Subscription Plan</h1>
                        <p className="text-muted-foreground">
                            Set up a new subscription plan for your clients.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Essential details about the subscription plan.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Plan Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., Premium Plan"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Describe what this plan includes..."
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">Sort Order</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                        placeholder="0"
                                        min="0"
                                    />
                                    {errors.sort_order && (
                                        <p className="text-sm text-red-600">{errors.sort_order}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pricing & Limits */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing & Limits</CardTitle>
                                <CardDescription>
                                    Set the cost and usage limits for this plan.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            placeholder="29.99"
                                            required
                                        />
                                        {errors.price && (
                                            <p className="text-sm text-red-600">{errors.price}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="billing_cycle">Billing Cycle</Label>
                                        <Select
                                            value={data.billing_cycle}
                                            onValueChange={(value) => setData('billing_cycle', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                                <SelectItem value="yearly">Yearly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.billing_cycle && (
                                            <p className="text-sm text-red-600">{errors.billing_cycle}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="session_limit">Session Limit</Label>
                                    <Input
                                        id="session_limit"
                                        type="number"
                                        value={data.session_limit}
                                        onChange={(e) => setData('session_limit', e.target.value)}
                                        placeholder="Leave empty for unlimited"
                                        min="0"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Number of counseling sessions per billing cycle. Leave empty for unlimited.
                                    </p>
                                    {errors.session_limit && (
                                        <p className="text-sm text-red-600">{errors.session_limit}</p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', !!checked)}
                                    />
                                    <Label htmlFor="is_active">Active Plan</Label>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Active plans are visible to clients for subscription.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Features */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Plan Features
                                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Feature
                                </Button>
                            </CardTitle>
                            <CardDescription>
                                List the features and benefits included in this plan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        value={feature}
                                        onChange={(e) => updateFeature(index, e.target.value)}
                                        placeholder={`Feature ${index + 1}`}
                                        className="flex-1"
                                    />
                                    {data.features.length > 1 && (
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
                            {errors.features && (
                                <p className="text-sm text-red-600">{errors.features}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <a href="/admin/subscription-plans">Cancel</a>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Plan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}