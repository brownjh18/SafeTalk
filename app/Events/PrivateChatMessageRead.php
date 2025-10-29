<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PrivateChatMessageRead implements ShouldBroadcast, ShouldQueue
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $readerId;
    public int $otherUserId;
    public int $sessionId;

    public function __construct(int $readerId, int $otherUserId, int $sessionId)
    {
        $this->readerId = $readerId;
        $this->otherUserId = $otherUserId;
        $this->sessionId = $sessionId;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('private-user.' . $this->otherUserId),
            new PrivateChannel('private-user.' . $this->readerId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'message.read';
    }

    public function broadcastWith(): array
    {
        return [
            'reader_id' => $this->readerId,
            'other_user_id' => $this->otherUserId,
            'session_id' => $this->sessionId,
        ];
    }
}
