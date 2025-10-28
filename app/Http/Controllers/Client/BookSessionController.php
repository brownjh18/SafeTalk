<?php

namespace App\Http\Controllers\Client;

use App\Models\CounselingSession;
use App\Models\User;
use App\Models\AppNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookSessionController extends \App\Http\Controllers\Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get available counselors with ratings
        $availableCounselors = User::where('role', 'counselor')
            ->where('verified', true)
            ->with(['counselorRatings'])
            ->get()
            ->map(function ($counselor) use ($user) {
                $averageRating = $counselor->counselorRatings->avg('rating') ?? 0;
                $totalRatings = $counselor->counselorRatings->count();

                // Check if user has already rated this counselor
                $hasUserRated = $counselor->counselorRatings->where('client_id', $user->id)->isNotEmpty();

                return [
                    'id' => $counselor->id,
                    'name' => $counselor->name,
                    'email' => $counselor->email,
                    'specialization' => 'General Mental Health', // In real app, this would be from counselor profile
                    'rating' => round($averageRating, 1),
                    'total_ratings' => $totalRatings,
                    'experience_years' => 8, // In real app, this would be from counselor profile
                    'total_sessions' => 150, // In real app, this would be calculated
                    'bio' => "Experienced counselor specializing in mental health support and personal development.",
                    'certifications' => ['Licensed Professional Counselor', 'CBT Certified'],
                    'has_user_rated' => $hasUserRated,
                ];
            });

        // Get user's existing sessions
        $mySessions = CounselingSession::with('counselor')
            ->where('client_id', $user->id)
            ->orderBy('scheduled_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($session) {
                return [
                    'id' => $session->id,
                    'counselor_name' => $session->counselor->name,
                    'scheduled_at' => $session->scheduled_at,
                    'status' => $session->status,
                    'is_followup' => str_contains($session->notes ?? '', 'Follow-up'),
                ];
            });

        return Inertia::render('client/book-session/index', [
            'availableCounselors' => $availableCounselors,
            'mySessions' => $mySessions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'counselor_id' => 'required|exists:users,id',
            'scheduled_at' => 'required|date|after:now',
            'notes' => 'nullable|string|max:500',
        ]);

        $user = $request->user();

        // Check if counselor is verified
        $counselor = User::where('id', $request->counselor_id)
            ->where('role', 'counselor')
            ->where('verified', true)
            ->first();

        if (!$counselor) {
            return back()->withErrors(['counselor_id' => 'Selected counselor is not available.']);
        }

        // Create the session
        $session = CounselingSession::create([
            'client_id' => $user->id,
            'counselor_id' => $request->counselor_id,
            'scheduled_at' => $request->scheduled_at,
            'status' => 'scheduled',
            'notes' => $request->notes,
        ]);

        // Send notification to counselor
        AppNotification::create([
            'user_id' => $request->counselor_id,
            'title' => 'New Session Request',
            'message' => "{$user->name} has requested a counseling session with you for " . date('M j, Y \a\t g:i A', strtotime($request->scheduled_at)),
            'type' => 'session_request',
            'data' => [
                'session_id' => $session->id,
                'client_id' => $user->id,
                'client_name' => $user->name,
                'scheduled_at' => $request->scheduled_at,
            ],
        ]);

        return redirect()->back()->with('success', 'Session booked successfully! Counselor has been notified.');
    }
}