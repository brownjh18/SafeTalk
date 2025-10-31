<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Chat extends Model
{
    protected $fillable = [
        'session_id',
        'sender_id',
        'receiver_id',
        'message',
        'sent_at',
        'is_read',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'is_read' => 'boolean',
    ];

    public function session(): BelongsTo
    {
        return $this->belongsTo(CounselingSession::class, 'session_id');
    }

    public function counselingSession(): BelongsTo
    {
        return $this->belongsTo(CounselingSession::class, 'session_id');
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
