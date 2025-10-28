<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Mood;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MoodController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $moods = Mood::where('user_id', $user->id)
            ->orderBy('mood_date', 'desc')
            ->get();

        return Inertia::render('client/moods/index', [
            'moods' => $moods,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'mood_level' => 'required|integer|min:1|max:10',
            'mood_type' => 'required|in:daily,post_session',
            'counseling_session_id' => 'nullable|exists:counseling_sessions,id',
            'notes' => 'nullable|string|max:1000',
            'activities' => 'nullable|array',
            'activities.*' => 'string|max:255',
            'triggers' => 'nullable|array',
            'triggers.*' => 'string|max:255',
            'location' => 'nullable|string|max:255',
            'weather' => 'nullable|string|max:255',
            'energy_level' => 'nullable|integer|min:1|max:10',
            'sleep_quality' => 'nullable|integer|min:1|max:10',
            'stress_level' => 'nullable|integer|min:1|max:10',
        ]);

        $user = Auth::user();

        // Prevent duplicate daily mood entries for the same day
        if ($request->mood_type === 'daily') {
            $existingMood = Mood::where('user_id', $user->id)
                ->where('mood_type', 'daily')
                ->whereDate('logged_at', now()->toDateString())
                ->first();

            if ($existingMood) {
                return back()->withErrors(['general' => 'You have already logged a daily mood today.']);
            }
        }

        Mood::create([
            'user_id' => $user->id,
            'mood_level' => $request->mood_level,
            'mood_type' => $request->mood_type,
            'counseling_session_id' => $request->counseling_session_id,
            'notes' => $request->notes,
            'logged_at' => now(),
            'activities' => $request->activities,
            'triggers' => $request->triggers,
            'location' => $request->location,
            'weather' => $request->weather,
            'energy_level' => $request->energy_level,
            'sleep_quality' => $request->sleep_quality,
            'stress_level' => $request->stress_level,
        ]);

        return back()->with('success', 'Mood logged successfully!');
    }

    public function statistics()
    {
        $user = Auth::user();

        $moods = Mood::where('user_id', $user->id)
            ->orderBy('mood_date', 'desc')
            ->get();

        // Calculate statistics
        $stats = [
            'total_entries' => $moods->count(),
            'average_mood' => $moods->avg('mood_level'),
            'highest_mood' => $moods->max('mood_level'),
            'lowest_mood' => $moods->min('mood_level'),
            'recent_trend' => $this->calculateTrend($moods->take(7)), // Last 7 entries
            'daily_moods' => $moods->where('mood_type', 'daily')->count(),
            'post_session_moods' => $moods->where('mood_type', 'post_session')->count(),
        ];

        return Inertia::render('client/moods/statistics', [
            'statistics' => $stats,
            'moods' => $moods,
        ]);
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
