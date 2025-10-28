<?php

namespace App\Http\Controllers;

use App\Models\CounselingSession;
use App\Models\Chat;
use App\Models\ProgressReport;
use App\Models\AppNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get client-specific data with eager loading
        $upcomingSessions = CounselingSession::with('counselor')
            ->where('client_id', $user->id)
            ->where('scheduled_at', '>', now())
            ->orderBy('scheduled_at')
            ->take(3)
            ->get();

        $recentChats = Chat::with(['counselingSession', 'sender'])
            ->whereHas('counselingSession', function($query) use ($user) {
                $query->where('client_id', $user->id);
            })
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $progressReports = ProgressReport::with('counselor')
            ->where('client_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        $notifications = AppNotification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('client/dashboard', [
            'upcomingSessions' => $upcomingSessions->map(function ($session) {
                return [
                    'id' => $session->id,
                    'counselor_id' => $session->counselor_id,
                    'scheduled_at' => $session->scheduled_at,
                    'status' => $session->status,
                    'counselor' => [
                        'name' => $session->counselor->name,
                        'email' => $session->counselor->email,
                    ],
                ];
            }),
            'recentChats' => $recentChats->map(function ($chat) use ($user) {
                return [
                    'id' => $chat->id,
                    'message' => $chat->message,
                    'created_at' => $chat->created_at,
                    'is_from_counselor' => $chat->sender_id !== $user->id,
                ];
            }),
            'progressReports' => $progressReports->map(function ($report) {
                return [
                    'id' => $report->id,
                    'title' => $report->title,
                    'content' => $report->content,
                    'created_at' => $report->created_at,
                ];
            }),
            'notifications' => $notifications->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'created_at' => $notification->created_at,
                    'is_read' => $notification->is_read,
                ];
            }),
        ]);
    }
}