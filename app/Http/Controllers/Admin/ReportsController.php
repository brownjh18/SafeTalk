<?php

namespace App\Http\Controllers\Admin;

use App\Models\CounselingSession;
use App\Models\User;
use App\Models\ProgressReport;
use App\Models\Mood;
use App\Models\CounselorRating;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportsController extends \App\Http\Controllers\Controller
{
    public function index(Request $request)
    {
        $totalUsers = User::count();
        $totalCounselors = User::where('role', 'counselor')->count();
        $totalClients = User::where('role', 'client')->count();
        $verifiedCounselors = User::where('role', 'counselor')->where('verified', true)->count();

        $totalSessions = CounselingSession::count();
        $completedSessions = CounselingSession::where('status', 'completed')->count();
        $activeSessions = CounselingSession::where('status', 'in_progress')->count();

        $totalProgressReports = ProgressReport::count();
        $thisMonthSessions = CounselingSession::whereMonth('created_at', now()->month)->count();

        // Mood statistics
        $totalMoods = Mood::count();
        $activeClientsWithMoods = Mood::distinct('user_id')->count('user_id');
        $averageMood = Mood::avg('mood_level');

        // Mood distribution
        $moodDistribution = [];
        for ($i = 1; $i <= 10; $i++) {
            $moodDistribution[$i] = Mood::where('mood_level', $i)->count();
        }

        // Counselor ratings statistics
        $totalRatings = CounselorRating::count();
        $averageRating = CounselorRating::avg('rating');
        $counselorsWithRatings = CounselorRating::distinct('counselor_id')->count('counselor_id');

        // Rating distribution
        $ratingDistribution = [];
        for ($i = 1; $i <= 5; $i++) {
            $ratingDistribution[$i] = CounselorRating::where('rating', $i)->count();
        }

        // Top rated counselors
        $topRatedCounselors = User::where('role', 'counselor')
            ->with(['counselorRatings'])
            ->get()
            ->map(function ($counselor) {
                $averageRating = $counselor->counselorRatings->avg('rating') ?? 0;
                $totalRatings = $counselor->counselorRatings->count();

                return [
                    'id' => $counselor->id,
                    'name' => $counselor->name,
                    'email' => $counselor->email,
                    'average_rating' => round($averageRating, 1),
                    'total_ratings' => $totalRatings,
                    'verified' => $counselor->verified,
                ];
            })
            ->filter(function ($counselor) {
                return $counselor['total_ratings'] > 0;
            })
            ->sortByDesc('average_rating')
            ->take(5)
            ->values();

        // Recent ratings
        $recentRatings = CounselorRating::with(['counselor', 'client'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($rating) {
                return [
                    'id' => $rating->id,
                    'counselor_name' => $rating->counselor->name,
                    'client_name' => $rating->anonymous ? 'Anonymous' : $rating->client->name,
                    'rating' => $rating->rating,
                    'review' => $rating->review,
                    'created_at' => $rating->created_at,
                ];
            });

        $recentSessions = CounselingSession::with(['client', 'counselor'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('admin/reports/index', [
            'stats' => [
                'total_users' => $totalUsers,
                'total_counselors' => $totalCounselors,
                'total_clients' => $totalClients,
                'verified_counselors' => $verifiedCounselors,
                'total_sessions' => $totalSessions,
                'completed_sessions' => $completedSessions,
                'active_sessions' => $activeSessions,
                'total_progress_reports' => $totalProgressReports,
                'this_month_sessions' => $thisMonthSessions,
                'total_moods' => $totalMoods,
                'active_clients_with_moods' => $activeClientsWithMoods,
                'average_mood' => $averageMood,
                'mood_distribution' => $moodDistribution,
                // Counselor ratings statistics
                'total_ratings' => $totalRatings,
                'average_rating' => $averageRating,
                'counselors_with_ratings' => $counselorsWithRatings,
                'rating_distribution' => $ratingDistribution,
            ],
            'recentSessions' => $recentSessions,
            'topRatedCounselors' => $topRatedCounselors,
            'recentRatings' => $recentRatings,
        ]);
    }
}