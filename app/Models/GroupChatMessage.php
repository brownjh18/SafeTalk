<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GroupChatMessage extends Model
{
    protected $fillable = [
        'group_chat_session_id',
        'user_id',
        'message',
        'type',
    ];

    public static $rules = [
        'group_chat_session_id' => 'required|exists:group_chat_sessions,id',
        'user_id' => 'required|exists:users,id',
        'message' => 'required|string',
        'type' => 'required|in:text,audio',
    ];

    public function groupChatSession(): BelongsTo
    {
        return $this->belongsTo(GroupChatSession::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForSession($query, $sessionId)
    {
        return $query->where('group_chat_session_id', $sessionId);
    }

    public function scopeTextMessages($query)
    {
        return $query->where('type', 'text');
    }

    public function scopeAudioMessages($query)
    {
        return $query->where('type', 'audio');
    }
}
