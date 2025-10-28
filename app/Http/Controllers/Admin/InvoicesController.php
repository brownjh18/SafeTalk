<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoicesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $invoices = Invoice::with(['user', 'subscription.subscriptionPlan'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        // Calculate stats
        $stats = [
            'total_invoices' => Invoice::count(),
            'paid_invoices' => Invoice::where('status', 'paid')->count(),
            'pending_invoices' => Invoice::where('status', 'pending')->count(),
            'overdue_invoices' => Invoice::where('status', 'overdue')->count(),
            'total_revenue' => Invoice::where('status', 'paid')->sum('total_amount'),
        ];

        return Inertia::render('admin/invoices/index', [
            'invoices' => $invoices,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // This might not be needed as invoices are typically auto-generated
        abort(404);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // This might not be needed as invoices are typically auto-generated
        abort(404);
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        $invoice->load(['user', 'subscription.subscriptionPlan', 'payments']);

        return Inertia::render('admin/invoices/show', [
            'invoice' => $invoice,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoice $invoice)
    {
        return Inertia::render('admin/invoices/edit', [
            'invoice' => $invoice->load(['user', 'subscription.subscriptionPlan']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invoice $invoice)
    {
        $request->validate([
            'status' => 'required|in:pending,paid,overdue,cancelled',
            'notes' => 'nullable|string|max:1000',
        ]);

        $invoice->update($request->only(['status', 'notes']));

        return redirect()->route('admin.invoices.index')
                        ->with('success', 'Invoice updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        // Only allow deletion of cancelled invoices
        if ($invoice->status !== 'cancelled') {
            return back()->withErrors(['error' => 'Only cancelled invoices can be deleted.']);
        }

        $invoice->delete();

        return redirect()->route('admin.invoices.index')
                        ->with('success', 'Invoice deleted successfully!');
    }
}
