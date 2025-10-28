<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mood;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MoodController extends Controller
{
    public function index()
    {
        // Get all moods with user information
        $moods = Mood::with('user:id,name,email')
            ->orderBy('mood_date', 'desc')
            ->paginate(20);

        // Calculate overall statistics
        $stats = [
            'total_moods' => Mood::count(),
            'total_clients' => User::where('role', 'client')->count(),
            'active_clients' => Mood::distinct('user_id')->count('user_id'),
            'average_mood' => Mood::avg('mood_level'),
            'mood_distribution' => $this->getMoodDistribution(),
            'recent_activity' => $this->getRecentActivity(),
        ];

        return Inertia::render('admin/moods/index', [
            'moods' => $moods->items(),
            'statistics' => $stats,
        ]);
    }

    private function getMoodDistribution()
    {
        $distribution = [];
        for ($i = 1; $i <= 10; $i++) {
            $distribution[$i] = Mood::where('mood_level', $i)->count();
        }
        return $distribution;
    }

    private function getRecentActivity()
    {
        return Mood::with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($mood) {
                return [
                    'id' => $mood->id,
                    'user_name' => $mood->user->name,
                    'mood_level' => $mood->mood_level,
                    'mood_type' => $mood->mood_type,
                    'created_at' => $mood->created_at,
                ];
            });
    }
}
