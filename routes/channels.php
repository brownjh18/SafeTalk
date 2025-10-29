<?php

use App\Broadcasting\GroupChatChannel;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('group-chat.{sessionId}', GroupChatChannel::class);

// Private channel for direct (one-to-one) messages. Only the authenticated user may listen to their own channel.
Broadcast::channel('private-user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
