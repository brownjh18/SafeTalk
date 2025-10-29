<?php

namespace App\Events;

use App\Models\Chat;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PrivateChatMessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Chat $message;

    /**
     * Create a new event instance.
     */
    public function __construct(Chat $message)
    {
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     * We'll broadcast to both the sender and receiver private channels so both clients can react.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('private-user.' . $this->message->receiver_id),
            new PrivateChannel('private-user.' . $this->message->sender_id),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'message.sent';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'message' => $this->message->loadMissing('sender:id,name'),
            'session_id' => $this->message->session_id,
        ];
    }
}
