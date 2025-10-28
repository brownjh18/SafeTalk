<?php

namespace App\Http\Controllers\Counselor;

use App\Models\ProgressReport;
use App\Models\CounselingSession;
use App\Models\Mood;
use App\Models\CounselorRating;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportsController extends \App\Http\Controllers\Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $reports = ProgressReport::with(['client', 'session'])
            ->whereHas('session', function ($query) use ($user) {
                $query->where('counselor_id', $user->id);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        // Enhanced stats for counselor dashboard
        $totalSessions = CounselingSession::where('counselor_id', $user->id)->count();
        $completedSessions = CounselingSession::where('counselor_id', $user->id)->where('status', 'completed')->count();
        $activeSessions = CounselingSession::where('counselor_id', $user->id)->where('status', 'in_progress')->count();

        // Client mood statistics for counselor's clients
        $clientIds = CounselingSession::where('counselor_id', $user->id)->pluck('client_id')->unique();
        $totalClientMoods = Mood::whereIn('user_id', $clientIds)->count();
        $averageClientMood = Mood::whereIn('user_id', $clientIds)->avg('mood_level');

        // Counselor's own ratings
        $counselorRatings = CounselorRating::where('counselor_id', $user->id)->get();
        $averageRating = $counselorRatings->avg('rating') ?? 0;
        $totalRatings = $counselorRatings->count();

        // Recent activity
        $recentSessions = CounselingSession::with('client')
            ->where('counselor_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $recentRatings = CounselorRating::with('client')
            ->where('counselor_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $stats = [
            // Session stats
            'total_sessions' => $totalSessions,
            'completed_sessions' => $completedSessions,
            'active_sessions' => $activeSessions,
            'completion_rate' => $totalSessions > 0 ? round(($completedSessions / $totalSessions) * 100, 1) : 0,

            // Progress reports
            'total_reports' => ProgressReport::whereHas('session', function ($query) use ($user) {
                $query->where('counselor_id', $user->id);
            })->count(),
            'this_month_reports' => ProgressReport::whereHas('session', function ($query) use ($user) {
                $query->where('counselor_id', $user->id);
            })->whereMonth('created_at', now()->month)->count(),

            // Client mood stats
            'client_moods' => $totalClientMoods,
            'average_client_mood' => round($averageClientMood ?? 0, 1),

            // Counselor ratings
            'average_rating' => round($averageRating, 1),
            'total_ratings' => $totalRatings,
        ];

        return Inertia::render('counselor/reports/index', [
            'reports' => $reports,
            'stats' => $stats,
            'recentSessions' => $recentSessions,
            'recentRatings' => $recentRatings,
        ]);
    }
}