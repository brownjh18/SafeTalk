<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class SubscriptionController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Get current active subscription
        $currentSubscription = Subscription::where('user_id', $user->id)
            ->active()
            ->with('subscriptionPlan')
            ->first();

        // Get all available plans
        $plans = SubscriptionPlan::active()->ordered()->get();

        return Inertia::render('client/subscription/index', [
            'currentSubscription' => $currentSubscription,
            'plans' => $plans,
        ]);
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
        ]);

        $user = Auth::user();
        $plan = SubscriptionPlan::findOrFail($request->plan_id);

        // Check if user already has an active subscription
        $existingSubscription = Subscription::where('user_id', $user->id)
            ->active()
            ->first();

        if ($existingSubscription) {
            return back()->withErrors(['error' => 'You already have an active subscription.']);
        }

        // Create Stripe checkout session
        Stripe::setApiKey(config('services.stripe.secret'));

        $checkoutSession = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => $plan->name,
                        'description' => $plan->description,
                    ],
                    'unit_amount' => $plan->price * 100, // Stripe expects amount in cents
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => route('client.subscription.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('client.subscription.index'),
            'metadata' => [
                'user_id' => $user->id,
                'plan_id' => $plan->id,
            ],
        ]);

        return Inertia::location($checkoutSession->url);
    }

    public function upgrade(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
        ]);

        $user = Auth::user();
        $newPlan = SubscriptionPlan::findOrFail($request->plan_id);

        // Get current subscription
        $currentSubscription = Subscription::where('user_id', $user->id)
            ->active()
            ->first();

        if (!$currentSubscription) {
            return back()->withErrors(['error' => 'No active subscription found.']);
        }

        $oldPlan = $currentSubscription->subscriptionPlan;

        // Create Stripe checkout session for upgrade
        Stripe::setApiKey(config('services.stripe.secret'));

        $checkoutSession = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => "Upgrade to {$newPlan->name}",
                        'description' => "Upgrade from {$oldPlan->name} to {$newPlan->name}",
                    ],
                    'unit_amount' => $newPlan->price * 100, // Stripe expects amount in cents
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => route('client.subscription.success') . '?session_id={CHECKOUT_SESSION_ID}&upgrade=1&subscription_id=' . $currentSubscription->id,
            'cancel_url' => route('client.subscription.index'),
            'metadata' => [
                'user_id' => $user->id,
                'plan_id' => $newPlan->id,
                'subscription_id' => $currentSubscription->id,
                'upgrade' => 'true',
            ],
        ]);

        return Inertia::location($checkoutSession->url);
    }

    public function success(Request $request)
    {
        $sessionId = $request->get('session_id');

        if (!$sessionId) {
            return redirect()->route('client.subscription.index')->withErrors(['error' => 'Invalid session.']);
        }

        try {
            Stripe::setApiKey(config('services.stripe.secret'));
            $session = Session::retrieve($sessionId);

            if ($session->payment_status === 'paid') {
                $userId = $session->metadata->user_id;
                $planId = $session->metadata->plan_id;

                $plan = SubscriptionPlan::findOrFail($planId);

                // Calculate subscription dates
                $startDate = now();
                $endDate = $plan->billing_cycle === 'yearly'
                    ? $startDate->copy()->addYear()
                    : $startDate->copy()->addMonth();

                // Check if this is an upgrade
                $isUpgrade = $request->get('upgrade') === '1';
                $subscriptionId = $request->get('subscription_id');

                if ($isUpgrade && $subscriptionId) {
                    // Handle upgrade
                    $subscription = Subscription::findOrFail($subscriptionId);
                    $oldPlan = $subscription->subscriptionPlan;

                    $subscription->update([
                        'subscription_plan_id' => $planId,
                    ]);

                    $invoiceNumber = 'INV-UPG-' . date('Y') . '-' . str_pad($subscription->id, 6, '0', STR_PAD_LEFT);
                    $notes = "Plan upgrade from {$oldPlan->name} to {$plan->name}";
                } else {
                    // Handle new subscription
                    $subscription = Subscription::create([
                        'user_id' => $userId,
                        'subscription_plan_id' => $planId,
                        'start_date' => $startDate,
                        'end_date' => $endDate,
                        'next_billing_date' => $endDate,
                        'auto_renew' => true,
                    ]);

                    $invoiceNumber = 'INV-' . date('Y') . '-' . str_pad($subscription->id, 6, '0', STR_PAD_LEFT);
                    $notes = null;
                }

                // Create invoice
                $invoice = \App\Models\Invoice::create([
                    'user_id' => $userId,
                    'subscription_id' => $subscription->id,
                    'invoice_number' => $invoiceNumber,
                    'total_amount' => $session->amount_total / 100, // Convert from cents
                    'status' => 'paid',
                    'issued_date' => $startDate,
                    'due_date' => $startDate->copy()->addDays(30),
                    'notes' => $notes,
                ]);

                // Create payment record
                \App\Models\Payment::create([
                    'user_id' => $userId,
                    'invoice_id' => $invoice->id,
                    'transaction_id' => $session->id,
                    'amount' => $session->amount_total / 100,
                    'currency' => strtoupper($session->currency),
                    'status' => 'completed',
                    'payment_method' => 'stripe',
                    'payment_date' => now(),
                    'paid_at' => now(),
                ]);

                $message = $isUpgrade
                    ? 'Subscription upgraded successfully! Payment has been processed.'
                    : 'Subscription activated successfully! Payment has been processed.';

                return redirect()->route('client.subscription.index')->with('success', $message);
            }

            return redirect()->route('client.subscription.index')->withErrors(['error' => 'Payment was not completed.']);

        } catch (\Exception $e) {
            return redirect()->route('client.subscription.index')->withErrors(['error' => 'An error occurred while processing your payment.']);
        }
    }

    public function cancel(Request $request)
    {
        $user = Auth::user();

        $subscription = Subscription::where('user_id', $user->id)
            ->active()
            ->first();

        if (!$subscription) {
            return back()->withErrors(['error' => 'No active subscription found.']);
        }

        $subscription->update([
            'status' => 'cancelled',
            'auto_renew' => false,
        ]);

        return back()->with('success', 'Subscription cancelled successfully.');
    }

}
