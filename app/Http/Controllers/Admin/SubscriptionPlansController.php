<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionPlansController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $plans = SubscriptionPlan::ordered()->paginate(15);

        return Inertia::render('admin/subscription-plans/index', [
            'plans' => $plans,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/subscription-plans/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|in:monthly,yearly',
            'session_limit' => 'required|integer|min:0',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        SubscriptionPlan::create($request->all());

        return redirect()->route('admin.subscription-plans.index')
                        ->with('success', 'Subscription plan created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(SubscriptionPlan $subscriptionPlan)
    {
        $subscriptionPlan->load('subscriptions.user');

        return Inertia::render('admin/subscription-plans/show', [
            'plan' => $subscriptionPlan,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SubscriptionPlan $subscriptionPlan)
    {
        return Inertia::render('admin/subscription-plans/edit', [
            'plan' => $subscriptionPlan,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SubscriptionPlan $subscriptionPlan)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|in:monthly,yearly',
            'session_limit' => 'required|integer|min:0',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $subscriptionPlan->update($request->all());

        return redirect()->route('admin.subscription-plans.index')
                        ->with('success', 'Subscription plan updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SubscriptionPlan $subscriptionPlan)
    {
        // Check if plan has active subscriptions
        if ($subscriptionPlan->subscriptions()->active()->exists()) {
            return back()->withErrors(['error' => 'Cannot delete plan with active subscriptions.']);
        }

        $subscriptionPlan->delete();

        return redirect()->route('admin.subscription-plans.index')
                        ->with('success', 'Subscription plan deleted successfully!');
    }
}
