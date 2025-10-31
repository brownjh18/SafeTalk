<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Get notifications for the authenticated user
     */
    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();
        $limit = $request->get('limit', 20);

        $notifications = AppNotification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'is_read' => $notification->is_read,
                    'created_at' => $notification->created_at->toISOString(),
                    'data' => $notification->data,
                ];
            });

        $unreadCount = AppNotification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Mark a specific notification as read
     */
    public function markAsRead(Request $request, AppNotification $notification): JsonResponse
    {
        // Ensure user can only mark their own notifications
        if ($notification->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $notification->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }

    /**
     * Mark all notifications as read for the authenticated user
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        AppNotification::where('user_id', auth()->id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }

    /**
     * Create a new notification
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:message,session,resource,announcement,system',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'data' => 'nullable|array',
        ]);

        $notification = AppNotification::create([
            'user_id' => $validated['user_id'],
            'type' => $validated['type'],
            'title' => $validated['title'],
            'message' => $validated['message'],
            'data' => $validated['data'] ?? null,
            'is_read' => false,
        ]);

        return response()->json($notification, 201);
    }

    /**
     * Create notifications for multiple users (useful for announcements)
     */
    public function storeBulk(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'type' => 'required|in:message,session,resource,announcement,system',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'data' => 'nullable|array',
        ]);

        $notifications = [];
        foreach ($validated['user_ids'] as $userId) {
            $notifications[] = AppNotification::create([
                'user_id' => $userId,
                'type' => $validated['type'],
                'title' => $validated['title'],
                'message' => $validated['message'],
                'data' => $validated['data'] ?? null,
                'is_read' => false,
            ]);
        }

        return response()->json($notifications, 201);
    }

    /**
     * Create a notification for a specific user role
     */
    public function storeForRole(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'role' => 'required|in:admin,counselor,client',
            'type' => 'required|in:message,session,resource,announcement,system',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'data' => 'nullable|array',
        ]);

        $users = \App\Models\User::where('role', $validated['role'])->get();

        $notifications = [];
        foreach ($users as $user) {
            $notifications[] = AppNotification::create([
                'user_id' => $user->id,
                'type' => $validated['type'],
                'title' => $validated['title'],
                'message' => $validated['message'],
                'data' => $validated['data'] ?? null,
                'is_read' => false,
            ]);
        }

        return response()->json($notifications, 201);
    }

    /**
     * Delete a notification
     */
    public function destroy(AppNotification $notification): JsonResponse
    {
        // Ensure user can only delete their own notifications
        if ($notification->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $notification->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Get user notification preferences
     */
    public function getPreferences(Request $request): JsonResponse
    {
        $user = auth()->user();
        $preferences = $this->notificationService->getUserPreferences($user);

        return response()->json([
            'preferences' => $preferences,
        ]);
    }

    /**
     * Update user notification preferences
     */
    public function updatePreferences(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'group_chat_session_created' => 'boolean',
            'group_chat_invitation' => 'boolean',
            'group_chat_session_scheduled' => 'boolean',
            'push_notifications' => 'boolean',
            'email_notifications' => 'boolean',
        ]);

        $user = auth()->user();
        $this->notificationService->updateUserPreferences($user, $validated);

        return response()->json([
            'success' => true,
            'preferences' => $this->notificationService->getUserPreferences($user),
        ]);
    }

    /**
     * Get notification templates
     */
    public function getTemplates(Request $request): JsonResponse
    {
        return response()->json([
            'templates' => $this->notificationService->getTemplates(),
        ]);
    }

    /**
     * Get unread notifications count
     */
    public function getUnreadCount(Request $request): JsonResponse
    {
        $user = auth()->user();
        $count = $this->notificationService->getUnreadCount($user);

        return response()->json([
            'unread_count' => $count,
        ]);
    }
}
