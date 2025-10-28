<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\CounselingSession;
use App\Models\Chat;
use App\Models\AppNotification;
use App\Models\Mood;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CounselorDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get counselor-specific data with eager loading
        $todaySessions = CounselingSession::with('client')
            ->where('counselor_id', $user->id)
            ->whereDate('scheduled_at', today())
            ->orderBy('scheduled_at')
            ->get();

        $pendingChats = Chat::whereHas('counselingSession', function($query) use ($user) {
            $query->where('counselor_id', $user->id);
        })
        ->where('sender_id', '!=', $user->id)
        ->where('is_read', false)
        ->count();

        $totalClients = CounselingSession::where('counselor_id', $user->id)
            ->distinct('client_id')
            ->count();

        $notifications = AppNotification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Mood statistics for counselor's clients
        $counselorClients = CounselingSession::where('counselor_id', $user->id)
            ->distinct('client_id')
            ->pluck('client_id');

        $totalMoods = Mood::whereIn('user_id', $counselorClients)->count();
        $activeClients = Mood::whereIn('user_id', $counselorClients)
            ->distinct('user_id')
            ->count('user_id');
        $averageMood = Mood::whereIn('user_id', $counselorClients)->avg('mood_level');

        // Clients needing attention (low mood scores in recent entries)
        $clientsNeedingAttention = 0;
        foreach ($counselorClients as $clientId) {
            $recentMoods = Mood::where('user_id', $clientId)
                ->orderBy('created_at', 'desc')
                ->take(3)
                ->get();

            if ($recentMoods->count() >= 2) {
                $averageRecentMood = $recentMoods->avg('mood_level');
                if ($averageRecentMood <= 3) {
                    $clientsNeedingAttention++;
                }
            }
        }

        return Inertia::render('counselor/dashboard', [
            'todaySessions' => $todaySessions->map(function ($session) {
                return [
                    'id' => $session->id,
                    'client_id' => $session->client_id,
                    'scheduled_at' => $session->scheduled_at,
                    'status' => $session->status,
                    'client' => [
                        'name' => $session->client->name,
                        'email' => $session->client->email,
                    ],
                ];
            }),
            'pendingChats' => $pendingChats,
            'totalClients' => $totalClients,
            'notifications' => $notifications->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'created_at' => $notification->created_at,
                    'is_read' => $notification->is_read,
                ];
            }),
            'moodStats' => [
                'total_moods' => $totalMoods,
                'active_clients' => $activeClients,
                'average_mood' => $averageMood,
                'clients_needing_attention' => $clientsNeedingAttention,
            ],
        ]);
    }
}