import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Target } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Props {
    stats?: {
        total_revenue: number;
        monthly_revenue: number;
        yearly_revenue: number;
        active_subscriptions: number;
        total_clients: number;
        average_revenue_per_user: number;
        churn_rate: number;
        growth_rate: number;
        top_plans: Array<{
            name: string;
            revenue: number;
            subscribers: number;
        }>;
        revenue_by_month: Array<{
            month: string;
            revenue: number;
        }>;
    };
}

export default function FinancialIndex({ stats }: Props) {
    const defaultStats = {
        total_revenue: 0,
        monthly_revenue: 0,
        yearly_revenue: 0,
        active_subscriptions: 0,
        total_clients: 0,
        average_revenue_per_user: 0,
        churn_rate: 0,
        growth_rate: 0,
        top_plans: [],
        revenue_by_month: [],
    };

    const currentStats = stats || defaultStats;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatPercentage = (value: number) => {
        return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
    };

    const breadcrumbs = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Financial Overview',
            href: '/admin/financial',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Financial Overview" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Financial Overview</h1>
                        <p className="text-muted-foreground">
                            Comprehensive financial analytics and business insights.
                        </p>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(currentStats.total_revenue)}</div>
                            <p className="text-xs text-muted-foreground">
                                All-time revenue
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(currentStats.monthly_revenue)}</div>
                            <p className="text-xs text-muted-foreground">
                                This month's revenue
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{currentStats.active_subscriptions}</div>
                            <p className="text-xs text-muted-foreground">
                                Currently active
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Revenue/User</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(currentStats.average_revenue_per_user)}</div>
                            <p className="text-xs text-muted-foreground">
                                Per active user
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Growth Metrics */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Growth Metrics
                            </CardTitle>
                            <CardDescription>
                                Business growth and retention indicators
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Monthly Growth</span>
                                <Badge variant={currentStats.growth_rate >= 0 ? "default" : "destructive"}>
                                    {formatPercentage(currentStats.growth_rate)}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Churn Rate</span>
                                <Badge variant={currentStats.churn_rate <= 5 ? "default" : "destructive"}>
                                    {formatPercentage(currentStats.churn_rate)}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Total Clients</span>
                                <span className="text-sm font-bold">{currentStats.total_clients}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Top Performing Plans
                            </CardTitle>
                            <CardDescription>
                                Revenue by subscription plan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {currentStats.top_plans.length > 0 ? (
                                <div className="space-y-3">
                                    {currentStats.top_plans.map((plan, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium">{plan.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {plan.subscribers} subscribers
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold">{formatCurrency(plan.revenue)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">No plan data available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Revenue Chart Placeholder */}
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Trends</CardTitle>
                        <CardDescription>
                            Monthly revenue over time
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {currentStats.revenue_by_month.length > 0 ? (
                            <div className="h-64 flex items-center justify-center">
                                <div className="text-center">
                                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">
                                        Revenue chart visualization would be displayed here
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Integration with charting library (Chart.js, Recharts, etc.) needed
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No revenue data yet</h3>
                                <p className="text-muted-foreground">
                                    Revenue trends will appear here once payments start coming in.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Financial Summary */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Yearly Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{formatCurrency(currentStats.yearly_revenue)}</div>
                            <p className="text-sm text-muted-foreground mt-2">
                                Total revenue for this year
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Projection</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {formatCurrency(currentStats.monthly_revenue * 12)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                Annual projection based on current month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Health Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {currentStats.churn_rate <= 5 && currentStats.growth_rate >= 0 ? '🟢 Good' :
                                 currentStats.churn_rate <= 10 ? '🟡 Fair' : '🔴 Needs Attention'}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                Based on churn rate and growth metrics
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
