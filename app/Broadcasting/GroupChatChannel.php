<?php

namespace App\Broadcasting;

use App\Models\GroupChatSession;
use App\Models\User;

class GroupChatChannel
{
    /**
     * Create a new channel instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Authenticate the user's access to the channel.
     */
    public function join(User $user, $sessionId): array|bool
    {
        $session = GroupChatSession::where('id', $sessionId)
            ->where('is_active', true)
            ->where(function ($query) use ($user) {
                $query->where('creator_id', $user->id)
                      ->orWhereHas('participants', function ($subQuery) use ($user) {
                          $subQuery->where('user_id', $user->id);
                      });
            })
            ->first();

        if (!$session) {
            return false;
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ];
    }
}
