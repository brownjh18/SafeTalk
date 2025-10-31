<?php

namespace App\Events;

use App\Models\GroupChatSession;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GroupChatSessionScheduled implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $groupChatSession;
    public $scheduledAt;
    public $isPublic;

    /**
     * Create a new event instance.
     */
    public function __construct(GroupChatSession $groupChatSession, $scheduledAt, bool $isPublic = false)
    {
        $this->groupChatSession = $groupChatSession;
        $this->scheduledAt = $scheduledAt;
        $this->isPublic = $isPublic;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        if ($this->isPublic) {
            return [
                new Channel('group-chat-sessions'),
            ];
        }

        // Broadcast to all participants
        $channels = [];
        foreach ($this->groupChatSession->participants as $participant) {
            $channels[] = new PrivateChannel('user.' . $participant->id);
        }

        return $channels;
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'session.scheduled';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'session' => [
                'id' => $this->groupChatSession->id,
                'title' => $this->groupChatSession->title,
                'description' => $this->groupChatSession->description,
                'creator' => $this->groupChatSession->creator->name,
                'mode' => $this->groupChatSession->mode,
                'max_participants' => $this->groupChatSession->max_participants,
            ],
            'scheduled_at' => $this->scheduledAt,
        ];
    }
}
