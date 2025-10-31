<?php

namespace App\Listeners;

use App\Events\GroupChatSessionCreated;
use App\Events\GroupChatParticipantInvited;
use App\Events\GroupChatSessionScheduled;
use App\Models\AppNotification;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendGroupChatNotification implements ShouldQueue
{
    use InteractsWithQueue;

    protected $notificationService;

    /**
     * Create the event listener.
     */
    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Handle group chat session created event.
     */
    public function handleGroupChatSessionCreated(GroupChatSessionCreated $event): void
    {
        if ($event->isPublic) {
            // Notify all users about public session creation
            $users = User::where('id', '!=', $event->groupChatSession->creator_id)->get();
            foreach ($users as $user) {
                if ($this->shouldNotifyUser($user, 'group_chat_session_created')) {
                    AppNotification::create([
                        'user_id' => $user->id,
                        'type' => 'group_chat',
                        'title' => 'New Group Chat Session Available',
                        'message' => "A new group chat session '{$event->groupChatSession->title}' has been created by {$event->groupChatSession->creator->name}.",
                        'data' => [
                            'session_id' => $event->groupChatSession->id,
                            'action' => 'session_created',
                        ],
                    ]);
                }
            }
        }
    }

    /**
     * Handle group chat participant invited event.
     */
    public function handleGroupChatParticipantInvited(GroupChatParticipantInvited $event): void
    {
        if ($this->shouldNotifyUser($event->invitedUser, 'group_chat_invitation')) {
            AppNotification::create([
                'user_id' => $event->invitedUser->id,
                'type' => 'group_chat',
                'title' => 'Group Chat Invitation',
                'message' => "You have been invited to join '{$event->groupChatSession->title}' by {$event->inviter->name}.",
                'data' => [
                    'session_id' => $event->groupChatSession->id,
                    'inviter_id' => $event->inviter->id,
                    'action' => 'participant_invited',
                ],
            ]);
        }
    }

    /**
     * Handle group chat session scheduled event.
     */
    public function handleGroupChatSessionScheduled(GroupChatSessionScheduled $event): void
    {
        if ($event->isPublic) {
            // Notify all users about scheduled session
            $users = User::where('id', '!=', $event->groupChatSession->creator_id)->get();
            foreach ($users as $user) {
                if ($this->shouldNotifyUser($user, 'group_chat_session_scheduled')) {
                    AppNotification::create([
                        'user_id' => $user->id,
                        'type' => 'group_chat',
                        'title' => 'Group Chat Session Scheduled',
                        'message' => "Group chat session '{$event->groupChatSession->title}' is scheduled for {$event->scheduledAt}.",
                        'data' => [
                            'session_id' => $event->groupChatSession->id,
                            'scheduled_at' => $event->scheduledAt,
                            'action' => 'session_scheduled',
                        ],
                    ]);
                }
            }
        } else {
            // Notify participants only
            foreach ($event->groupChatSession->participants as $participant) {
                if ($this->shouldNotifyUser($participant, 'group_chat_session_scheduled')) {
                    AppNotification::create([
                        'user_id' => $participant->id,
                        'type' => 'group_chat',
                        'title' => 'Group Chat Session Scheduled',
                        'message' => "Group chat session '{$event->groupChatSession->title}' is scheduled for {$event->scheduledAt}.",
                        'data' => [
                            'session_id' => $event->groupChatSession->id,
                            'scheduled_at' => $event->scheduledAt,
                            'action' => 'session_scheduled',
                        ],
                    ]);
                }
            }
        }
    }

    /**
     * Check if user should be notified based on preferences.
     */
    private function shouldNotifyUser(User $user, string $notificationType): bool
    {
        return $this->notificationService->shouldNotifyUser($user, $notificationType);
    }
}
