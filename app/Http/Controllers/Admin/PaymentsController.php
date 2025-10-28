<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payments = Payment::with(['user', 'invoice'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        // Calculate stats
        $stats = [
            'total_payments' => Payment::count(),
            'successful_payments' => Payment::whereIn('status', ['completed', 'success'])->count(),
            'failed_payments' => Payment::whereIn('status', ['failed', 'cancelled'])->count(),
            'total_amount' => Payment::whereIn('status', ['completed', 'success'])->sum('amount'),
            'monthly_amount' => Payment::whereIn('status', ['completed', 'success'])
                ->where('payment_date', '>=', now()->startOfMonth())
                ->sum('amount'),
        ];

        return Inertia::render('admin/payments/index', [
            'payments' => $payments,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // This might not be needed as payments are typically auto-generated
        abort(404);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // This might not be needed as payments are typically auto-generated
        abort(404);
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        $payment->load(['user', 'invoice']);

        return Inertia::render('admin/payments/show', [
            'payment' => $payment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment)
    {
        return Inertia::render('admin/payments/edit', [
            'payment' => $payment->load(['user', 'invoice']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payment $payment)
    {
        $request->validate([
            'status' => 'required|in:pending,completed,failed,refunded',
            'notes' => 'nullable|string|max:1000',
        ]);

        $oldStatus = $payment->status;
        $payment->update($request->only(['status', 'notes']));

        // Handle status changes
        if ($request->status === 'completed' && $oldStatus !== 'completed') {
            $payment->markAsCompleted();
        } elseif ($request->status === 'failed' && $oldStatus !== 'failed') {
            $payment->markAsFailed();
        }

        return redirect()->route('admin.payments.index')
                        ->with('success', 'Payment updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        // Only allow deletion of failed payments
        if ($payment->status !== 'failed') {
            return back()->withErrors(['error' => 'Only failed payments can be deleted.']);
        }

        $payment->delete();

        return redirect()->route('admin.payments.index')
                        ->with('success', 'Payment deleted successfully!');
    }
}
