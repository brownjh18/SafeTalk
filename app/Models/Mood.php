<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mood extends Model
{
    protected $fillable = [
        'user_id',
        'counseling_session_id',
        'mood_type',
        'mood_level',
        'notes',
        'logged_at',
        'activities',
        'triggers',
        'location',
        'weather',
        'energy_level',
        'sleep_quality',
        'stress_level',
    ];

    protected $casts = [
        'logged_at' => 'datetime',
        'mood_level' => 'integer',
        'activities' => 'array',
        'triggers' => 'array',
        'energy_level' => 'integer',
        'sleep_quality' => 'integer',
        'stress_level' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function counselingSession(): BelongsTo
    {
        return $this->belongsTo(CounselingSession::class);
    }
}
