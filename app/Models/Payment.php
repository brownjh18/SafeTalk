<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'payment_id',
        'user_id',
        'invoice_id',
        'amount',
        'currency',
        'payment_method',
        'status',
        'gateway',
        'gateway_response',
        'paid_at',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'gateway_response' => 'array',
        'paid_at' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeRefunded($query)
    {
        return $query->where('status', 'refunded');
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    public function markAsCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'paid_at' => now(),
        ]);

        // Mark invoice as paid if this completes the payment
        if ($this->invoice) {
            $this->invoice->markAsPaid();
        }
    }

    public function markAsFailed(): void
    {
        $this->update(['status' => 'failed']);
    }

    public function getFormattedAmountAttribute()
    {
        return $this->currency . ' ' . number_format($this->amount, 2);
    }

    public function getStatusBadgeAttribute()
    {
        return match($this->status) {
            'completed' => 'success',
            'pending' => 'warning',
            'failed' => 'destructive',
            'refunded' => 'secondary',
            default => 'secondary',
        };
    }

    public function getPaymentMethodLabelAttribute()
    {
        return match($this->payment_method) {
            'card' => 'Credit/Debit Card',
            'bank_transfer' => 'Bank Transfer',
            'paypal' => 'PayPal',
            default => ucfirst(str_replace('_', ' ', $this->payment_method)),
        };
    }
}
