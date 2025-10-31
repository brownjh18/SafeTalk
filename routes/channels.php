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

// Public channel for group chat session notifications
Broadcast::channel('group-chat-sessions', function ($user) {
    return $user !== null; // Allow authenticated users
});

// Private channel for user-specific notifications
Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Private channel for group chat session notifications (participants only)
Broadcast::channel('group-chat-sessions-private', function ($user) {
    return $user !== null; // Allow authenticated users
});
