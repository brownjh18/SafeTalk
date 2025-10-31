<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupChatSession extends Model
{
    protected $fillable = [
        'title',
        'description',
        'creator_id',
        'mode',
        'max_participants',
        'is_active',
        'is_private',
    ];

    public static $rules = [
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'creator_id' => 'required|exists:users,id',
        'mode' => 'required|string',
        'max_participants' => 'nullable|integer|min:1',
        'is_active' => 'boolean',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function participants()
    {
        return $this->belongsToMany(User::class, 'group_chat_participants', 'group_chat_session_id', 'user_id')
                    ->withPivot('joined_at', 'role')
                    ->withTimestamps();
    }

    public function messages()
    {
        return $this->hasMany(GroupChatMessage::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}