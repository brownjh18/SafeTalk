<?php

namespace App\Http\Controllers;

use App\Services\PushNotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PushNotificationController extends Controller
{
    protected $pushService;

    public function __construct(PushNotificationService $pushService)
    {
        $this->pushService = $pushService;
    }

    /**
     * Subscribe user to push notifications.
     */
    public function subscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => 'required|string',
            'type' => 'in:web,mobile',
        ]);

        $user = auth()->user();
        $type = $validated['type'] ?? 'web';

        $success = $this->pushService->subscribeUser($user, $validated['token'], $type);

        return response()->json([
            'success' => $success,
            'message' => $success ? 'Subscribed to push notifications' : 'Failed to subscribe',
        ]);
    }

    /**
     * Unsubscribe user from push notifications.
     */
    public function unsubscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'in:web,mobile',
        ]);

        $user = auth()->user();
        $type = $validated['type'] ?? 'web';

        $success = $this->pushService->unsubscribeUser($user, $type);

        return response()->json([
            'success' => $success,
            'message' => $success ? 'Unsubscribed from push notifications' : 'Failed to unsubscribe',
        ]);
    }

    /**
     * Check subscription status.
     */
    public function status(Request $request): JsonResponse
    {
        $user = auth()->user();
        $type = $request->get('type', 'web');

        $isSubscribed = $this->pushService->isSubscribed($user, $type);

        return response()->json([
            'subscribed' => $isSubscribed,
            'type' => $type,
        ]);
    }

    /**
     * Send test push notification.
     */
    public function test(Request $request): JsonResponse
    {
        $user = auth()->user();

        $success = $this->pushService->sendToUser(
            $user,
            'Test Notification',
            'This is a test push notification from SafeTalk.',
            ['type' => 'test']
        );

        return response()->json([
            'success' => $success,
            'message' => 'Test notification sent',
        ]);
    }
}
