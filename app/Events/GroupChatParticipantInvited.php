<?php

namespace App\Events;

use App\Models\GroupChatSession;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GroupChatParticipantInvited implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $groupChatSession;
    public $invitedUser;
    public $inviter;

    /**
     * Create a new event instance.
     */
    public function __construct(GroupChatSession $groupChatSession, User $invitedUser, User $inviter)
    {
        $this->groupChatSession = $groupChatSession;
        $this->invitedUser = $invitedUser;
        $this->inviter = $inviter;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.' . $this->invitedUser->id),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'participant.invited';
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
            'inviter' => [
                'id' => $this->inviter->id,
                'name' => $this->inviter->name,
            ],
        ];
    }
}
