<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\GroupChatController;
use App\Http\Controllers\Api\GroupChatParticipantController;
use App\Http\Controllers\Api\GroupChatMessageController;
use App\Http\Controllers\Api\GroupChatJoinRequestController;
use App\Http\Controllers\Api\GroupChatAttendanceController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PushNotificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Group Chat API Routes
Route::middleware(['auth:sanctum'])->prefix('group-chats')->group(function () {
    // Group Chat Sessions
    Route::get('/', [GroupChatController::class, 'index'])->name('api.group-chats.index');
    Route::post('/', [GroupChatController::class, 'store'])->name('api.group-chats.store');
    Route::get('/{sessionId}', [GroupChatController::class, 'show'])->name('api.group-chats.show');
    Route::put('/{sessionId}', [GroupChatController::class, 'update'])->name('api.group-chats.update');
    Route::delete('/{sessionId}', [GroupChatController::class, 'destroy'])->name('api.group-chats.destroy');
    Route::post('/{sessionId}/end', [GroupChatController::class, 'end'])->name('api.group-chats.end');
    Route::post('/{sessionId}/start', [GroupChatController::class, 'start'])->name('api.group-chats.start');

    // Participants Management
    Route::get('/{sessionId}/participants', [GroupChatParticipantController::class, 'index'])->name('api.group-chats.participants.index');
    Route::post('/{sessionId}/participants/{userId}/invite', [GroupChatParticipantController::class, 'invite'])->name('api.group-chats.participants.invite');
    Route::post('/{sessionId}/participants/{userId}/accept', [GroupChatParticipantController::class, 'accept'])->name('api.group-chats.participants.accept');
    Route::post('/{sessionId}/participants/{userId}/decline', [GroupChatParticipantController::class, 'decline'])->name('api.group-chats.participants.decline');
    Route::delete('/{sessionId}/participants/{userId}', [GroupChatParticipantController::class, 'remove'])->name('api.group-chats.participants.remove');
    Route::post('/{sessionId}/participants/{userId}/mute', [GroupChatParticipantController::class, 'mute'])->name('api.group-chats.participants.mute');
    Route::post('/{sessionId}/participants/{userId}/unmute', [GroupChatParticipantController::class, 'unmute'])->name('api.group-chats.participants.unmute');

    // Messages
    Route::get('/{sessionId}/messages', [GroupChatMessageController::class, 'index'])->name('api.group-chats.messages.index');
    Route::post('/{sessionId}/messages', [GroupChatMessageController::class, 'store'])->name('api.group-chats.messages.store');
    Route::post('/{sessionId}/messages/upload', [GroupChatMessageController::class, 'upload'])->name('api.group-chats.messages.upload');
    Route::delete('/{sessionId}/messages/{messageId}', [GroupChatMessageController::class, 'destroy'])->name('api.group-chats.messages.destroy');

    // Join Requests
    Route::get('/{sessionId}/join-requests', [GroupChatJoinRequestController::class, 'index'])->name('api.group-chats.join-requests.index');
    Route::post('/{sessionId}/join-requests', [GroupChatJoinRequestController::class, 'store'])->name('api.group-chats.join-requests.store');
    Route::post('/{sessionId}/join-requests/{requestId}/approve', [GroupChatJoinRequestController::class, 'approve'])->name('api.group-chats.join-requests.approve');
    Route::post('/{sessionId}/join-requests/{requestId}/reject', [GroupChatJoinRequestController::class, 'reject'])->name('api.group-chats.join-requests.reject');

    // Attendance
    Route::get('/{sessionId}/attendance', [GroupChatAttendanceController::class, 'index'])->name('api.group-chats.attendance.index');
    Route::post('/{sessionId}/attendance/check-in', [GroupChatAttendanceController::class, 'checkIn'])->name('api.group-chats.attendance.check-in');
    Route::post('/{sessionId}/attendance/check-out', [GroupChatAttendanceController::class, 'checkOut'])->name('api.group-chats.attendance.check-out');
    Route::get('/{sessionId}/attendance/report', [GroupChatAttendanceController::class, 'report'])->name('api.group-chats.attendance.report');
});

// Notification API Routes
Route::middleware(['auth:sanctum'])->prefix('notifications')->group(function () {
    Route::get('/', [NotificationController::class, 'index'])->name('api.notifications.index');
    Route::post('/{notification}/read', [NotificationController::class, 'markAsRead'])->name('api.notifications.mark-as-read');
    Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('api.notifications.mark-all-read');
    Route::delete('/{notification}', [NotificationController::class, 'destroy'])->name('api.notifications.destroy');
    Route::get('/preferences', [NotificationController::class, 'getPreferences'])->name('api.notifications.preferences');
    Route::put('/preferences', [NotificationController::class, 'updatePreferences'])->name('api.notifications.update-preferences');
    Route::get('/templates', [NotificationController::class, 'getTemplates'])->name('api.notifications.templates');
    Route::get('/unread-count', [NotificationController::class, 'getUnreadCount'])->name('api.notifications.unread-count');
});

// Push Notification API Routes
Route::middleware(['auth:sanctum'])->prefix('push-notifications')->group(function () {
    Route::post('/subscribe', [PushNotificationController::class, 'subscribe'])->name('api.push-notifications.subscribe');
    Route::post('/unsubscribe', [PushNotificationController::class, 'unsubscribe'])->name('api.push-notifications.unsubscribe');
    Route::get('/status', [PushNotificationController::class, 'status'])->name('api.push-notifications.status');
    Route::post('/test', [PushNotificationController::class, 'test'])->name('api.push-notifications.test');
});