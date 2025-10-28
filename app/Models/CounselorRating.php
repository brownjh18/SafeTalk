<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CounselorRating extends Model
{
    protected $fillable = [
        'counselor_id',
        'client_id',
        'counseling_session_id',
        'rating',
        'review',
        'anonymous',
    ];

    protected $casts = [
        'rating' => 'integer',
        'anonymous' => 'boolean',
    ];

    public function counselor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'counselor_id');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function counselingSession(): BelongsTo
    {
        return $this->belongsTo(CounselingSession::class);
    }
}
