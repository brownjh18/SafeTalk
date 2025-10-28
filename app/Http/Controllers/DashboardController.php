<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\CounselingSession;
use App\Models\Chat;
use App\Models\Resource;
use App\Models\ProgressReport;
use App\Models\AppNotification;
use App\Models\Mood;
use App\Models\CounselorRating;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Enhanced statistics for admin dashboard
        $totalUsers = User::count();
        $totalCounselors = User::where('role', 'counselor')->count();
        $totalClients = User::where('role', 'client')->count();
        $verifiedCounselors = User::where('role', 'counselor')->where('verified', true)->count();

        $totalSessions = CounselingSession::count();
        $completedSessions = CounselingSession::where('status', 'completed')->count();
        $activeSessions = CounselingSession::where('status', 'in_progress')->count();

        // Mood and rating statistics
        $totalMoods = Mood::count();
        $averageMood = Mood::avg('mood_level');
        $totalRatings = CounselorRating::count();
        $averageRating = CounselorRating::avg('rating');

        $stats = [
            'users' => $totalUsers,
            'counselors' => $totalCounselors,
            'clients' => $totalClients,
            'verified_counselors' => $verifiedCounselors,
            'sessions' => $totalSessions,
            'completed_sessions' => $completedSessions,
            'active_sessions' => $activeSessions,
            'chats' => Chat::count(),
            'resources' => Resource::count(),
            'progress_reports' => ProgressReport::count(),
            'notifications' => AppNotification::count(),
            'moods' => $totalMoods,
            'average_mood' => round($averageMood ?? 0, 1),
            'ratings' => $totalRatings,
            'average_rating' => round($averageRating ?? 0, 1),
        ];

        // Session progress breakdown
        $projectProgress = [
            'completed' => CounselingSession::where('status', 'completed')->count(),
            'in_progress' => CounselingSession::where('status', 'in_progress')->count(),
            'planning' => CounselingSession::where('status', 'scheduled')->count(),
        ];

        // Recent activities (latest 5 sessions, progress reports, etc.)
        $recentProjects = CounselingSession::with(['client', 'counselor'])
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($session) {
                return [
                    'id' => $session->id,
                    'title' => 'Session with ' . ($session->client?->name ?? 'Unknown Client'),
                    'program' => $session->counselor?->name ?? 'No Counselor',
                    'facility' => 'SafeTalk',
                    'created_at' => $session->created_at->diffForHumans(),
                ];
            });

        $recentOutcomes = ProgressReport::with(['client', 'counselor'])
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($report) {
                return [
                    'id' => $report->id,
                    'title' => 'Progress Report for ' . ($report->client?->name ?? 'Unknown Client'),
                    'project' => $report->counselor?->name ?? 'No Counselor',
                    'created_at' => $report->created_at->diffForHumans(),
                ];
            });

        // Achievements or milestones (this could be based on specific criteria)
        $achievements = [
            [
                'title' => 'New Counselor Joined',
                'description' => 'Certified counselor added to the platform',
                'time' => now()->subHours(2)->diffForHumans(),
            ],
            [
                'title' => 'Session Completed',
                'description' => 'Client session successfully finished',
                'time' => now()->subHours(4)->diffForHumans(),
            ],
            [
                'title' => 'Resource Uploaded',
                'description' => 'New self-help guide added',
                'time' => now()->subDay()->diffForHumans(),
            ],
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'projectProgress' => $projectProgress,
            'recentProjects' => $recentProjects,
            'recentOutcomes' => $recentOutcomes,
            'achievements' => $achievements,
        ]);
    }

    public function activity()
    {
        // Fetch all recent activities from various models
        $recentProjects = CounselingSession::with(['client', 'counselor'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($session) {
                return [
                    'id' => $session->id,
                    'title' => 'Session with ' . ($session->client?->name ?? 'Unknown Client'),
                    'type' => 'Session',
                    'description' => 'New session scheduled',
                    'program' => $session->counselor?->name ?? 'No Counselor',
                    'facility' => 'SafeTalk',
                    'created_at' => $session->created_at->diffForHumans(),
                    'color' => 'green',
                ];
            });

        $recentOutcomes = ProgressReport::with(['client', 'counselor'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($report) {
                return [
                    'id' => $report->id,
                    'title' => 'Progress Report for ' . ($report->client?->name ?? 'Unknown Client'),
                    'type' => 'Progress Report',
                    'description' => 'New progress report added',
                    'project' => $report->counselor?->name ?? 'No Counselor',
                    'created_at' => $report->created_at->diffForHumans(),
                    'color' => 'blue',
                ];
            });

        // Add more activity types if needed, e.g., users, resources, etc.
        $recentParticipants = User::latest()->take(5)->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'title' => $user->name,
                'type' => 'User',
                'description' => 'New user registered',
                'created_at' => $user->created_at->diffForHumans(),
                'color' => 'orange',
            ];
        });

        // Combine all activities and sort by created_at
        $allActivities = $recentProjects->concat($recentOutcomes)->concat($recentParticipants)->sortByDesc('created_at')->values();

        return Inertia::render('activity', [
            'activities' => $allActivities,
        ]);
    }
}