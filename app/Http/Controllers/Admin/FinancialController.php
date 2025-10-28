<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinancialController extends Controller
{
    public function index()
    {
        // Monthly revenue data for the last 12 months
        $monthlyRevenue = $this->getMonthlyRevenue();

        // Current financial overview - now using real payment data
        $overview = [
            'total_revenue' => Payment::where('status', 'completed')->sum('amount'),
            'monthly_revenue' => Payment::where('status', 'completed')
                ->where('paid_at', '>=', now()->startOfMonth())
                ->sum('amount'),
            'yearly_revenue' => Payment::where('status', 'completed')
                ->where('paid_at', '>=', now()->startOfYear())
                ->sum('amount'),
            'pending_invoices' => Invoice::where('status', 'pending')->count(),
            'overdue_invoices' => Invoice::where('status', 'overdue')->count(),
            'active_subscriptions' => Subscription::where('status', 'active')->count(),
            'total_clients' => Subscription::distinct('user_id')->count('user_id'),
        ];

        // Recent payments
        $recentPayments = Payment::with(['user', 'invoice'])
            ->completed()
            ->orderBy('paid_at', 'desc')
            ->limit(10)
            ->get();

        // Top revenue sources (subscription plans)
        $topPlans = Subscription::with('subscriptionPlan')
            ->selectRaw('subscription_plan_id, COUNT(*) as count, SUM(subscription_plans.price) as revenue')
            ->join('subscription_plans', 'subscriptions.subscription_plan_id', '=', 'subscription_plans.id')
            ->groupBy('subscription_plan_id')
            ->orderBy('revenue', 'desc')
            ->limit(5)
            ->get();

        // Calculate additional stats for the frontend
        $stats = [
            'total_revenue' => $overview['total_revenue'],
            'monthly_revenue' => $overview['monthly_revenue'],
            'yearly_revenue' => $overview['yearly_revenue'],
            'active_subscriptions' => $overview['active_subscriptions'],
            'total_clients' => $overview['total_clients'],
            'average_revenue_per_user' => $overview['total_clients'] > 0 ? $overview['total_revenue'] / $overview['total_clients'] : 0,
            'churn_rate' => $this->calculateChurnRate(),
            'growth_rate' => $this->calculateGrowthRate(),
            'top_plans' => $topPlans->map(function ($plan) {
                return [
                    'name' => $plan->subscriptionPlan->name ?? 'Unknown',
                    'revenue' => (float) $plan->revenue,
                    'subscribers' => (int) $plan->count,
                ];
            }),
            'revenue_by_month' => $monthlyRevenue,
        ];

        return Inertia::render('admin/financial/index', [
            'stats' => $stats,
            'overview' => $overview,
            'monthlyRevenue' => $monthlyRevenue,
            'recentPayments' => $recentPayments,
            'topPlans' => $topPlans,
        ]);
    }

    private function getMonthlyRevenue()
    {
        $data = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $revenue = Payment::where('status', 'completed')
                ->whereYear('paid_at', $date->year)
                ->whereMonth('paid_at', $date->month)
                ->sum('amount');

            $data[] = [
                'month' => $date->format('M Y'),
                'revenue' => (float) $revenue,
            ];
        }
        return $data;
    }

    private function calculateChurnRate()
    {
        // Simple churn rate calculation: cancelled subscriptions / total subscriptions in the last month
        $totalSubscriptions = Subscription::where('created_at', '>=', now()->subMonth())->count();
        $cancelledSubscriptions = Subscription::where('cancelled_at', '>=', now()->subMonth())->count();

        return $totalSubscriptions > 0 ? ($cancelledSubscriptions / $totalSubscriptions) * 100 : 0;
    }

    private function calculateGrowthRate()
    {
        // Monthly growth rate: (current month - previous month) / previous month * 100
        $currentMonth = Payment::where('status', 'completed')
            ->where('paid_at', '>=', now()->startOfMonth())
            ->sum('amount');

        $previousMonth = Payment::where('status', 'completed')
            ->where('paid_at', '>=', now()->subMonths(1)->startOfMonth())
            ->where('paid_at', '<', now()->startOfMonth())
            ->sum('amount');

        return $previousMonth > 0 ? (($currentMonth - $previousMonth) / $previousMonth) * 100 : 0;
    }
}
