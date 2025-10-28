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

    public function moods()
    {
        return $this->hasMany(Mood::class);
    }
}
