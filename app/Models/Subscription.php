<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subscription extends Model
{
    protected $fillable = [
        'user_id',
        'subscription_plan_id',
        'status',
        'start_date',
        'end_date',
        'next_billing_date',
        'sessions_used',
        'auto_renew',
        'metadata',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'next_billing_date' => 'date',
        'sessions_used' => 'integer',
        'auto_renew' => 'boolean',
        'metadata' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subscriptionPlan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeExpired($query)
    {
        return $query->where('status', 'expired');
    }

    public function isActive(): bool
    {
        return $this->status === 'active' &&
               ($this->end_date === null || $this->end_date->isFuture());
    }

    public function canUseSession(): bool
    {
        if (!$this->isActive()) {
            return false;
        }

        // Check session limit
        if ($this->subscriptionPlan->session_limit > 0) {
            return $this->sessions_used < $this->subscriptionPlan->session_limit;
        }

        return true; // Unlimited sessions
    }

    public function incrementSessionsUsed(): void
    {
        $this->increment('sessions_used');
    }

    public function getRemainingSessionsAttribute()
    {
        if ($this->subscriptionPlan->session_limit === 0) {
            return 'Unlimited';
        }

        return max(0, $this->subscriptionPlan->session_limit - $this->sessions_used);
    }
}
