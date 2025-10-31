import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Crown, Star } from 'lucide-react';

interface SubscriptionPlan {
    id: number;
    name: string;
    description: string;
    price: number;
    billing_cycle: 'monthly' | 'yearly';
    session_limit: number;
    features: string[];
    is_active: boolean;
}

interface Subscription {
    id: number;
    status: string;
    start_date: string;
    end_date: string;
    sessions_used: number;
    subscription_plan: SubscriptionPlan;
}

interface Props {
    currentSubscription: Subscription | null;
    plans: SubscriptionPlan[];
}

import AppLayout from '@/layouts/app-layout';

export default function SubscriptionIndex({ currentSubscription, plans }: Props) {
    const subscribeForm = useForm({
        plan_id: 0,
    });
    const upgradeForm = useForm({
        plan_id: 0,
    });
    const cancelForm = useForm({});

    const handleSubscribe = (planId: number) => {
        subscribeForm.setData('plan_id', planId);
        subscribeForm.post('/client/subscription');
    };

    const handleUpgrade = (planId: number) => {
        upgradeForm.setData('plan_id', planId);
        upgradeForm.put('/client/subscription');
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel your subscription?')) {
            cancelForm.delete('/client/subscription');
        }
    };

    const getPlanIcon = (planName: string) => {
        if (planName.toLowerCase().includes('premium')) return <Crown className="h-6 w-6 text-yellow-500" />;
        if (planName.toLowerCase().includes('pro')) return <Star className="h-6 w-6 text-blue-500" />;
        return <CheckCircle className="h-6 w-6 text-green-500" />;
    };

    const breadcrumbs = [
        {
            title: 'Dashboard',
            href: '/client/dashboard',
        },
        {
            title: 'Subscription',
            href: '/client/subscription',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Subscription" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Subscription</h1>
                        <p className="text-muted-foreground">
                            Manage your subscription plan and billing.
                        </p>
                    </div>
                </div>

                {/* Current Subscription Status */}
                {currentSubscription ? (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {getPlanIcon(currentSubscription.subscription_plan.name)}
                                Current Plan: {currentSubscription.subscription_plan.name}
                            </CardTitle>
                            <CardDescription>
                                Active subscription details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                                    <Badge variant="secondary" className="mt-1">
                                        {currentSubscription.status}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Price</p>
                                    <p className="text-lg font-semibold">
                                        ${currentSubscription.subscription_plan.price}/{currentSubscription.subscription_plan.billing_cycle}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Sessions Used</p>
                                    <p className="text-lg font-semibold">
                                        {currentSubscription.sessions_used} / {currentSubscription.subscription_plan.session_limit || 'Unlimited'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Next Billing</p>
                                    <p className="text-lg font-semibold">
                                        {new Date(currentSubscription.end_date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={cancelForm.processing}
                                >
                                    {cancelForm.processing ? 'Cancelling...' : 'Cancel Subscription'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-muted-foreground mb-4">
                                    You don't have an active subscription yet.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Choose a plan below to get started.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Available Plans */}
                {/* Available Plans */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <Card key={plan.id} className="relative">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {getPlanIcon(plan.name)}
                                    {plan.name}
                                </CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold">
                                        ${plan.price}
                                    </span>
                                    <span className="text-muted-foreground">
                                        /{plan.billing_cycle}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium mb-2">Features:</p>
                                    <ul className="space-y-1">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                        <li className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            {plan.session_limit ? `${plan.session_limit} sessions` : 'Unlimited sessions'}
                                        </li>
                                    </ul>
                                </div>

                                <div className="pt-4">
                                    {currentSubscription?.subscription_plan.id === plan.id ? (
                                        <Button disabled className="w-full">
                                            Current Plan
                                        </Button>
                                    ) : currentSubscription ? (
                                        <Button
                                            onClick={() => handleUpgrade(plan.id)}
                                            disabled={upgradeForm.processing}
                                            className="w-full"
                                        >
                                            {upgradeForm.processing ? 'Upgrading...' : 'Upgrade to This Plan'}
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => handleSubscribe(plan.id)}
                                            disabled={subscribeForm.processing}
                                            className="w-full"
                                        >
                                            {subscribeForm.processing ? 'Subscribing...' : 'Subscribe'}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
