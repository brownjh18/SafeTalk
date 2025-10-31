<?php

namespace App\Services;

use App\Models\AppNotification;
use App\Models\User;
use Illuminate\Support\Facades\Notification;

class NotificationService
{
    /**
     * Default notification preferences.
     */
    const DEFAULT_PREFERENCES = [
        'group_chat_session_created' => true,
        'group_chat_invitation' => true,
        'group_chat_session_scheduled' => true,
        'push_notifications' => true,
        'email_notifications' => false,
    ];

    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Send notification to a user.
     */
    public function sendToUser(User $user, string $type, string $title, string $message, array $data = []): AppNotification
    {
        return AppNotification::create([
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => $data,
        ]);
    }

    /**
     * Send notification to multiple users.
     */
    public function sendToUsers(array $users, string $type, string $title, string $message, array $data = []): array
    {
        $notifications = [];
        foreach ($users as $user) {
            if ($this->shouldNotifyUser($user, $type)) {
                $notifications[] = $this->sendToUser($user, $type, $title, $message, $data);
            }
        }
        return $notifications;
    }

    /**
     * Get notification templates.
     */
    public function getTemplates(): array
    {
        return [
            'group_chat_session_created' => [
                'title' => 'New Group Chat Session Available',
                'message' => 'A new group chat session "{title}" has been created by {creator}.',
            ],
            'group_chat_invitation' => [
                'title' => 'Group Chat Invitation',
                'message' => 'You have been invited to join "{title}" by {inviter}.',
            ],
            'group_chat_session_scheduled' => [
                'title' => 'Group Chat Session Scheduled',
                'message' => 'Group chat session "{title}" is scheduled for {scheduled_at}.',
            ],
            'group_chat_session_started' => [
                'title' => 'Group Chat Session Started',
                'message' => 'Group chat session "{title}" has started.',
            ],
            'group_chat_participant_joined' => [
                'title' => 'New Participant Joined',
                'message' => '{participant} has joined the group chat session "{title}".',
            ],
        ];
    }

    /**
     * Get user notification preferences.
     */
    public function getUserPreferences(User $user): array
    {
        return array_merge(self::DEFAULT_PREFERENCES, $user->notification_preferences ?? []);
    }

    /**
     * Update user notification preferences.
     */
    public function updateUserPreferences(User $user, array $preferences): bool
    {
        $user->notification_preferences = array_merge($this->getUserPreferences($user), $preferences);
        return $user->save();
    }

    /**
     * Check if user should be notified based on preferences.
     */
    public function shouldNotifyUser(User $user, string $notificationType): bool
    {
        $preferences = $this->getUserPreferences($user);
        return $preferences[$notificationType] ?? true;
    }

    /**
     * Send push notification using PushNotificationService.
     */
    public function sendPushNotification(User $user, string $title, string $message, array $data = []): void
    {
        if ($this->shouldNotifyUser($user, 'push_notifications')) {
            $pushService = app(\App\Services\PushNotificationService::class);
            $pushService->sendToUser($user, $title, $message, $data);
        }
    }

    /**
     * Send email notification (placeholder for future implementation).
     */
    public function sendEmailNotification(User $user, string $title, string $message, array $data = []): void
    {
        // TODO: Implement email notification service
        if ($this->shouldNotifyUser($user, 'email_notifications')) {
            // Implementation would go here
        }
    }

    /**
     * Mark notification as read.
     */
    public function markAsRead(AppNotification $notification): bool
    {
        $notification->is_read = true;
        return $notification->save();
    }

    /**
     * Mark all user notifications as read.
     */
    public function markAllAsRead(User $user): int
    {
        return AppNotification::where('user_id', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);
    }

    /**
     * Get unread notifications count for user.
     */
    public function getUnreadCount(User $user): int
    {
        return AppNotification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();
    }
}
