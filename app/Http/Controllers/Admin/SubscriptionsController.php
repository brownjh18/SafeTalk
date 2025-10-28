<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subscriptions = Subscription::with(['user', 'subscriptionPlan'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        // Calculate comprehensive stats
        $stats = [
            'total_subscriptions' => Subscription::count(),
            'active_subscriptions' => Subscription::active()->count(),
            'total_revenue' => Subscription::with('subscriptionPlan')
                ->get()
                ->sum(function ($subscription) {
                    return $subscription->subscriptionPlan->price ?? 0;
                }),
            'monthly_revenue' => Subscription::with('subscriptionPlan')
                ->where('created_at', '>=', now()->startOfMonth())
                ->get()
                ->sum(function ($subscription) {
                    return $subscription->subscriptionPlan->price ?? 0;
                }),
        ];

        return Inertia::render('admin/subscriptions/index', [
            'subscriptions' => $subscriptions,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $plans = SubscriptionPlan::active()->ordered()->get();
        $clients = User::where('role', 'client')->get(['id', 'name', 'email']);

        return Inertia::render('admin/subscriptions/create', [
            'plans' => $plans,
            'clients' => $clients,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'subscription_plan_id' => 'required|exists:subscription_plans,id',
            'start_date' => 'required|date',
            'auto_renew' => 'boolean',
        ]);

        $plan = SubscriptionPlan::findOrFail($request->subscription_plan_id);

        // Check if user already has an active subscription
        $existingSubscription = Subscription::where('user_id', $request->user_id)
            ->active()
            ->first();

        if ($existingSubscription) {
            return back()->withErrors(['user_id' => 'User already has an active subscription.']);
        }

        // Calculate end date based on billing cycle
        $startDate = \Carbon\Carbon::parse($request->start_date);
        $endDate = $plan->billing_cycle === 'yearly'
            ? $startDate->copy()->addYear()
            : $startDate->copy()->addMonth();

        $nextBillingDate = $request->auto_renew ? $endDate : null;

        Subscription::create([
            'user_id' => $request->user_id,
            'subscription_plan_id' => $request->subscription_plan_id,
            'start_date' => $request->start_date,
            'end_date' => $endDate,
            'next_billing_date' => $nextBillingDate,
            'auto_renew' => $request->auto_renew ?? true,
        ]);

        return redirect()->route('admin.subscriptions.index')
                        ->with('success', 'Subscription created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Subscription $subscription)
    {
        $subscription->load(['user', 'subscriptionPlan', 'invoices.payments']);

        return Inertia::render('admin/subscriptions/show', [
            'subscription' => $subscription,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Subscription $subscription)
    {
        $plans = SubscriptionPlan::active()->ordered()->get();

        return Inertia::render('admin/subscriptions/edit', [
            'subscription' => $subscription->load(['user', 'subscriptionPlan']),
            'plans' => $plans,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Subscription $subscription)
    {
        $request->validate([
            'subscription_plan_id' => 'required|exists:subscription_plans,id',
            'status' => 'required|in:active,cancelled,suspended',
            'end_date' => 'nullable|date',
            'auto_renew' => 'boolean',
        ]);

        $subscription->update($request->only([
            'subscription_plan_id',
            'status',
            'end_date',
            'auto_renew',
        ]));

        return redirect()->route('admin.subscriptions.index')
                        ->with('success', 'Subscription updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subscription $subscription)
    {
        // Check if subscription has unpaid invoices
        if ($subscription->invoices()->where('status', '!=', 'paid')->exists()) {
            return back()->withErrors(['error' => 'Cannot delete subscription with unpaid invoices.']);
        }

        $subscription->delete();

        return redirect()->route('admin.subscriptions.index')
                        ->with('success', 'Subscription deleted successfully!');
    }
}
