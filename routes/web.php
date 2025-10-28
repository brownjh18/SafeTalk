<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CounselorDashboardController;
use App\Http\Controllers\ClientDashboardController;
use App\Http\Controllers\GroupChatController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', UserController::class);
    Route::post('users/{user}/verify', [UserController::class, 'verify'])->name('users.verify');

    // Global Messages routes
    Route::get('messages', [\App\Http\Controllers\MessagesController::class, 'index'])->name('messages.index');
    Route::get('messages/{userId}', [\App\Http\Controllers\MessagesController::class, 'show'])->name('messages.show');
    Route::post('messages/{userId}', [\App\Http\Controllers\MessagesController::class, 'store'])->name('messages.store');
    Route::post('conversations/start', [\App\Http\Controllers\MessagesController::class, 'startConversation'])->name('conversations.start');

    // Group Chat routes
    Route::prefix('group-chats')->group(function () {
        Route::get('/', [GroupChatController::class, 'index'])->name('group-chats.index');
        Route::get('/create', [GroupChatController::class, 'create'])->name('group-chats.create');
        Route::post('/', [GroupChatController::class, 'store'])->name('group-chats.store');
        Route::get('/{sessionId}', [GroupChatController::class, 'show'])->name('group-chats.show');
        Route::get('/{sessionId}/chat', [GroupChatController::class, 'chat'])->name('group-chats.chat');
        Route::post('/{sessionId}/join', [GroupChatController::class, 'join'])->name('group-chats.join');
        Route::post('/{sessionId}/leave', [GroupChatController::class, 'leave'])->name('group-chats.leave');
        Route::post('/{sessionId}/reenter', [GroupChatController::class, 'reenter'])->name('group-chats.reenter');
        Route::post('/{sessionId}/end', [GroupChatController::class, 'end'])->name('group-chats.end');
        Route::post('/{sessionId}/start', [GroupChatController::class, 'start'])->name('group-chats.start');
        Route::delete('/{sessionId}', [GroupChatController::class, 'destroy'])->name('group-chats.destroy');
        Route::put('/{sessionId}', [GroupChatController::class, 'update'])->name('group-chats.update');
        Route::post('/{sessionId}/messages', [GroupChatController::class, 'sendMessage'])->name('group-chats.messages.send');
        Route::get('/{sessionId}/messages', [GroupChatController::class, 'getMessages'])->name('group-chats.messages.index');
        Route::post('/{sessionId}/webrtc-signaling', [GroupChatController::class, 'handleWebRTCSignaling'])->name('group-chats.webrtc.signaling');
        Route::post('/{sessionId}/remove-participant/{userId}', [GroupChatController::class, 'removeParticipant'])->name('group-chats.remove-participant');
        Route::post('/{sessionId}/approve-participant/{userId}', [GroupChatController::class, 'approveParticipant'])->name('group-chats.approve-participant');
        Route::post('/{sessionId}/reject-participant/{userId}', [GroupChatController::class, 'rejectParticipant'])->name('group-chats.reject-participant');
        Route::post('/{sessionId}/readd-participant/{userId}', [GroupChatController::class, 'readdParticipant'])->name('group-chats.readd-participant');
    });

    // Legacy conversation routes (for backward compatibility)
    Route::get('users/search', [\App\Http\Controllers\ConversationController::class, 'search'])->name('users.search');

    // Notification routes
    Route::get('notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications', [\App\Http\Controllers\NotificationController::class, 'store'])->name('notifications.store');
    Route::post('notifications/bulk', [\App\Http\Controllers\NotificationController::class, 'storeBulk'])->name('notifications.store-bulk');
    Route::post('notifications/role', [\App\Http\Controllers\NotificationController::class, 'storeForRole'])->name('notifications.store-role');
    Route::post('notifications/{notification}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.mark-read');
    Route::post('notifications/mark-all-read', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
    Route::delete('notifications/{notification}', [\App\Http\Controllers\NotificationController::class, 'destroy'])->name('notifications.destroy');

    // Role-specific dashboard routes
    Route::middleware(['role:counselor'])->group(function () {
        Route::get('counselor/dashboard', [CounselorDashboardController::class, 'index'])->name('counselor.dashboard');
        Route::get('counselor/clients', [\App\Http\Controllers\Counselor\ClientsController::class, 'index'])->name('counselor.clients.index');
        Route::get('counselor/sessions', [\App\Http\Controllers\Counselor\SessionsController::class, 'index'])->name('counselor.sessions.index');
        Route::get('counselor/sessions/create', [\App\Http\Controllers\Counselor\SessionsController::class, 'create'])->name('counselor.sessions.create');
        Route::post('counselor/sessions', [\App\Http\Controllers\Counselor\SessionsController::class, 'store'])->name('counselor.sessions.store');
        Route::get('counselor/sessions/{session}', [\App\Http\Controllers\Counselor\SessionsController::class, 'show'])->name('counselor.sessions.show');
        Route::delete('counselor/sessions/{session}', [\App\Http\Controllers\Counselor\SessionsController::class, 'destroy'])->name('counselor.sessions.destroy');
        Route::get('counselor/messages', [\App\Http\Controllers\Counselor\MessagesController::class, 'index'])->name('counselor.messages.index');
        Route::get('counselor/sessions/{session}/active', [\App\Http\Controllers\Counselor\ActiveSessionController::class, 'show'])->name('counselor.sessions.active');
        Route::get('counselor/messages/{session}', [\App\Http\Controllers\Counselor\MessagesController::class, 'show'])->name('counselor.messages.show');
        Route::post('counselor/messages/{session}', [\App\Http\Controllers\Counselor\MessagesController::class, 'store'])->name('counselor.messages.store');
        Route::resource('counselor/resources', \App\Http\Controllers\Counselor\ResourcesController::class, ['as' => 'counselor']);
        Route::get('counselor/sessions/{session}/active', [\App\Http\Controllers\Counselor\ActiveSessionController::class, 'show'])->name('counselor.sessions.active.show');
        Route::patch('counselor/sessions/{session}/notes', [\App\Http\Controllers\Counselor\ActiveSessionController::class, 'updateNotes'])->name('counselor.sessions.active.update-notes');
        Route::post('counselor/sessions/{session}/end', [\App\Http\Controllers\Counselor\ActiveSessionController::class, 'endSession'])->name('counselor.sessions.active.end');
        Route::post('counselor/sessions/{session}/complete', [\App\Http\Controllers\Counselor\ActiveSessionController::class, 'markCompleted'])->name('counselor.sessions.active.complete');
        Route::post('counselor/sessions/{session}/followup', [\App\Http\Controllers\Counselor\ActiveSessionController::class, 'requestFollowup'])->name('counselor.sessions.active.followup');
        Route::get('counselor/reports', [\App\Http\Controllers\Counselor\ReportsController::class, 'index'])->name('counselor.reports.index');
        Route::get('counselor/announcements', [\App\Http\Controllers\Counselor\AnnouncementsController::class, 'index'])->name('counselor.announcements.index');
        Route::get('counselor/moods', [\App\Http\Controllers\Counselor\MoodController::class, 'index'])->name('counselor.moods.index');
        Route::get('counselor/moods/{client}', [\App\Http\Controllers\Counselor\MoodController::class, 'show'])->name('counselor.moods.show');
        Route::get('counselor/moods/{client}', [\App\Http\Controllers\Counselor\MoodController::class, 'show'])->name('counselor.moods.show');
    });

    Route::middleware(['role:client'])->group(function () {
        Route::get('client/dashboard', [ClientDashboardController::class, 'index'])->name('client.dashboard');
        Route::get('client/book-session', [\App\Http\Controllers\Client\BookSessionController::class, 'index'])->name('client.book-session.index');
        Route::post('client/book-session', [\App\Http\Controllers\Client\BookSessionController::class, 'store'])->name('client.book-session.store');
        Route::get('client/subscription', [\App\Http\Controllers\Client\SubscriptionController::class, 'index'])->name('client.subscription.index');
        Route::post('client/subscription', [\App\Http\Controllers\Client\SubscriptionController::class, 'subscribe'])->name('client.subscription.subscribe');
        Route::get('client/subscription/success', [\App\Http\Controllers\Client\SubscriptionController::class, 'success'])->name('client.subscription.success');
        Route::put('client/subscription', [\App\Http\Controllers\Client\SubscriptionController::class, 'upgrade'])->name('client.subscription.upgrade');
        Route::delete('client/subscription', [\App\Http\Controllers\Client\SubscriptionController::class, 'cancel'])->name('client.subscription.cancel');
        Route::get('client/messages', [\App\Http\Controllers\Client\MessagesController::class, 'index'])->name('client.messages.index');
        Route::get('client/sessions/{session}/active', [\App\Http\Controllers\Client\ActiveSessionController::class, 'show'])->name('client.sessions.active');
        Route::get('client/messages/{session}', [\App\Http\Controllers\Client\MessagesController::class, 'show'])->name('client.messages.show');
        Route::post('client/messages/{session}', [\App\Http\Controllers\Client\MessagesController::class, 'store'])->name('client.messages.store');
        Route::get('client/resources', [\App\Http\Controllers\Client\ResourcesController::class, 'index'])->name('client.resources.index');
        Route::post('client/counselors/{counselor}/rate', [\App\Http\Controllers\Client\CounselorRatingController::class, 'store'])->name('client.counselors.rate');
        Route::get('client/progress', [\App\Http\Controllers\Client\ProgressController::class, 'index'])->name('client.progress.index');
        Route::get('client/profile', [\App\Http\Controllers\Client\ProfileController::class, 'index'])->name('client.profile.index');
        Route::get('client/announcements', [\App\Http\Controllers\Client\AnnouncementsController::class, 'index'])->name('client.announcements.index');
        Route::get('client/moods', [\App\Http\Controllers\Client\MoodController::class, 'index'])->name('client.moods.index');
        Route::post('client/moods', [\App\Http\Controllers\Client\MoodController::class, 'store'])->name('client.moods.store');
        Route::get('client/moods/statistics', [\App\Http\Controllers\Client\MoodController::class, 'statistics'])->name('client.moods.statistics');
    });

    // Admin routes
    Route::middleware(['role:admin'])->group(function () {
        Route::get('admin/financial', [\App\Http\Controllers\Admin\FinancialController::class, 'index'])->name('admin.financial.index');
        Route::resource('admin/subscription-plans', \App\Http\Controllers\Admin\SubscriptionPlansController::class, ['as' => 'admin']);
        Route::resource('admin/subscriptions', \App\Http\Controllers\Admin\SubscriptionsController::class, ['as' => 'admin']);
        Route::resource('admin/invoices', \App\Http\Controllers\Admin\InvoicesController::class, ['as' => 'admin']);
        Route::resource('admin/payments', \App\Http\Controllers\Admin\PaymentsController::class, ['as' => 'admin']);
        Route::get('admin/sessions', [\App\Http\Controllers\Admin\SessionMonitoringController::class, 'index'])->name('admin.sessions.index');
        Route::get('admin/sessions/{session}', [\App\Http\Controllers\Admin\SessionMonitoringController::class, 'show'])->name('admin.sessions.show');
        Route::put('admin/sessions/{session}', [\App\Http\Controllers\Admin\SessionMonitoringController::class, 'update'])->name('admin.sessions.update');
        Route::delete('admin/sessions/{session}', [\App\Http\Controllers\Admin\SessionMonitoringController::class, 'destroy'])->name('admin.sessions.destroy');
        Route::get('admin/messages', [\App\Http\Controllers\Admin\MessagesController::class, 'index'])->name('admin.messages.index');
        Route::get('admin/messages/{session}', [\App\Http\Controllers\Admin\MessagesController::class, 'show'])->name('admin.messages.show');
        Route::post('admin/messages/{session}', [\App\Http\Controllers\Admin\MessagesController::class, 'store'])->name('admin.messages.store');
        Route::post('admin/conversations/start', [\App\Http\Controllers\Admin\MessagesController::class, 'startConversation'])->name('admin.conversations.start');
        Route::get('admin/reports', [\App\Http\Controllers\Admin\ReportsController::class, 'index'])->name('admin.reports.index');
        Route::get('admin/moods', [\App\Http\Controllers\Admin\MoodController::class, 'index'])->name('admin.moods.index');
        Route::get('admin/announcements', [\App\Http\Controllers\Admin\AnnouncementsController::class, 'index'])->name('admin.announcements.index');
        Route::post('admin/announcements', [\App\Http\Controllers\Admin\AnnouncementsController::class, 'store'])->name('admin.announcements.store');
        Route::resource('admin/resources', \App\Http\Controllers\Admin\ResourcesController::class, ['as' => 'admin']);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
