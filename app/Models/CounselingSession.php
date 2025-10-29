<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CounselingSession extends Model
{
    protected $fillable = [
        'client_id',
        'counselor_id',
        'scheduled_at',
        'status',
        'notes',
        'session_type',
        'session_history',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'session_history' => 'array',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function counselor()
    {
        return $this->belongsTo(User::class, 'counselor_id');
    }

    public function chats()
    {
        return $this->hasMany(Chat::class, 'session_id');
    }

    /**
     * Find or create a counseling session for two users.
     * Logic:
     * - If one user is client and the other is counselor, map accordingly.
     * - Otherwise fall back to deterministic mapping using min/max ids.
     * Returns the CounselingSession model.
     */
    public static function getOrCreateForUsers($userA, $userB)
    {
        // If one is client and other is counselor map explicitly
        if ($userA->role === 'client' && $userB->role === 'counselor') {
            $clientId = $userA->id;
            $counselorId = $userB->id;
        } elseif ($userA->role === 'counselor' && $userB->role === 'client') {
            $clientId = $userB->id;
            $counselorId = $userA->id;
        } else {
            // Fallback deterministic mapping
            $clientId = min($userA->id, $userB->id);
            $counselorId = max($userA->id, $userB->id);
        }

        return self::firstOrCreate([
            'client_id' => $clientId,
            'counselor_id' => $counselorId,
        ], [
            'status' => 'scheduled',
            'scheduled_at' => now(),
        ]);
    }

    public function moods()
    {
        return $this->hasMany(Mood::class);
    }
}
