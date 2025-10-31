<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PushNotificationService
{
    protected $fcmServerKey;
    protected $fcmUrl = 'https://fcm.googleapis.com/fcm/send';

    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        $this->fcmServerKey = config('services.fcm.server_key');
    }

    /**
     * Send push notification to a single user.
     */
    public function sendToUser(User $user, string $title, string $message, array $data = []): bool
    {
        if (!$user->fcm_token) {
            Log::info("No FCM token for user {$user->id}");
            return false;
        }

        return $this->sendToTokens([$user->fcm_token], $title, $message, $data);
    }

    /**
     * Send push notification to multiple users.
     */
    public function sendToUsers(array $users, string $title, string $message, array $data = []): array
    {
        $tokens = [];
        foreach ($users as $user) {
            if ($user instanceof User && $user->fcm_token) {
                $tokens[] = $user->fcm_token;
            }
        }

        if (empty($tokens)) {
            Log::info("No FCM tokens found for users");
            return ['success' => 0, 'failure' => 0];
        }

        return $this->sendToTokens($tokens, $title, $message, $data);
    }

    /**
     * Send push notification to FCM tokens.
     */
    public function sendToTokens(array $tokens, string $title, string $message, array $data = []): array
    {
        if (!$this->fcmServerKey) {
            Log::error('FCM server key not configured');
            return ['success' => 0, 'failure' => count($tokens)];
        }

        $payload = [
            'registration_ids' => $tokens,
            'notification' => [
                'title' => $title,
                'body' => $message,
                'icon' => '/favicon.ico',
                'click_action' => config('app.url'),
            ],
            'data' => $data,
        ];

        try {
            $response = Http::withHeaders([
                'Authorization' => 'key=' . $this->fcmServerKey,
                'Content-Type' => 'application/json',
            ])->post($this->fcmUrl, $payload);

            $result = $response->json();

            Log::info('FCM notification sent', [
                'success' => $result['success'] ?? 0,
                'failure' => $result['failure'] ?? 0,
                'tokens_count' => count($tokens),
            ]);

            return [
                'success' => $result['success'] ?? 0,
                'failure' => $result['failure'] ?? 0,
            ];
        } catch (\Exception $e) {
            Log::error('FCM notification failed', [
                'error' => $e->getMessage(),
                'tokens_count' => count($tokens),
            ]);

            return ['success' => 0, 'failure' => count($tokens)];
        }
    }

    /**
     * Send desktop notification (browser notification).
     */
    public function sendDesktopNotification(User $user, string $title, string $message, array $data = []): void
    {
        // For desktop notifications, we can use Web Push API or service workers
        // This is a placeholder for browser-based desktop notifications
        // Implementation would depend on the frontend setup
    }

    /**
     * Send mobile notification (iOS/Android).
     */
    public function sendMobileNotification(User $user, string $title, string $message, array $data = []): bool
    {
        // Check if user has mobile FCM token
        if (!$user->mobile_fcm_token) {
            return false;
        }

        return $this->sendToTokens([$user->mobile_fcm_token], $title, $message, $data)['success'] > 0;
    }

    /**
     * Subscribe user to push notifications.
     */
    public function subscribeUser(User $user, string $token, string $type = 'web'): bool
    {
        $column = $type === 'mobile' ? 'mobile_fcm_token' : 'fcm_token';
        $user->$column = $token;
        return $user->save();
    }

    /**
     * Unsubscribe user from push notifications.
     */
    public function unsubscribeUser(User $user, string $type = 'web'): bool
    {
        $column = $type === 'mobile' ? 'mobile_fcm_token' : 'fcm_token';
        $user->$column = null;
        return $user->save();
    }

    /**
     * Check if user is subscribed to push notifications.
     */
    public function isSubscribed(User $user, string $type = 'web'): bool
    {
        $column = $type === 'mobile' ? 'mobile_fcm_token' : 'fcm_token';
        return !empty($user->$column);
    }
}
