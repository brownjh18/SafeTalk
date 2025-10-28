<?php

namespace App\Http\Controllers\Counselor;

use App\Http\Controllers\Controller;
use App\Models\Mood;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MoodController extends Controller
{
    public function index()
    {
        $counselor = Auth::user();

        // Get all clients assigned to this counselor
        $clients = User::where('role', 'client')
            ->whereHas('counselingSessions', function ($query) use ($counselor) {
                $query->where('counselor_id', $counselor->id);
            })
            ->with(['moods' => function ($query) {
                $query->orderBy('mood_date', 'desc')->limit(10);
            }])
            ->get();

        // Calculate mood statistics for counselor's clients
        $stats = [
            'total_clients' => $clients->count(),
            'active_clients_with_moods' => $clients->filter(fn($client) => $client->moods->count() > 0)->count(),
            'total_mood_entries' => $clients->sum(fn($client) => $client->moods->count()),
            'average_mood' => $clients->flatMap->moods->avg('mood_level') ?? 0,
            'clients_needing_attention' => $this->getClientsNeedingAttention($clients),
        ];

        return Inertia::render('counselor/moods/index', [
            'clients' => $clients,
            'statistics' => $stats,
        ]);
    }

    public function show(User $client)
    {
        // Ensure counselor has access to this client
        $counselor = Auth::user();
        $hasAccess = $client->counselingSessions()
            ->where('counselor_id', $counselor->id)
            ->exists();

        if (!$hasAccess) {
            abort(403, 'Unauthorized access to client data.');
        }

        $moods = Mood::where('user_id', $client->id)
            ->orderBy('mood_date', 'desc')
            ->get();

        // Calculate client-specific statistics
        $stats = [
            'total_entries' => $moods->count(),
            'average_mood' => $moods->avg('mood_level'),
            'highest_mood' => $moods->max('mood_level'),
            'lowest_mood' => $moods->min('mood_level'),
            'recent_trend' => $this->calculateTrend($moods->take(7)),
            'daily_moods' => $moods->where('mood_type', 'daily')->count(),
            'post_session_moods' => $moods->where('mood_type', 'post_session')->count(),
            'last_mood_entry' => $moods->first()?->mood_date,
        ];

        return Inertia::render('counselor/moods/show', [
            'client' => $client,
            'moods' => $moods,
            'statistics' => $stats,
        ]);
    }

    private function getClientsNeedingAttention($clients)
    {
        return $clients->filter(function ($client) {
            $recentMoods = $client->moods->take(3); // Last 3 mood entries
            if ($recentMoods->isEmpty()) return false;

            $averageMood = $recentMoods->avg('mood_level');
            return $averageMood <= 3; // Low mood threshold
        })->count();
    }

    private function calculateTrend($recentMoods)
    {
        if ($recentMoods->count() < 2) {
            return 'insufficient_data';
        }

        $firstHalf = $recentMoods->take(floor($recentMoods->count() / 2))->avg('mood_level');
        $secondHalf = $recentMoods->skip(floor($recentMoods->count() / 2))->avg('mood_level');

        if ($secondHalf > $firstHalf + 0.5) {
            return 'improving';
        } elseif ($secondHalf < $firstHalf - 0.5) {
            return 'declining';
        } else {
            return 'stable';
        }
    }
}
