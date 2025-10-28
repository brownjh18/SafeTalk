<?php

namespace App\Http\Controllers\Counselor;

use App\Models\CounselingSession;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SessionsController extends \App\Http\Controllers\Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $sessions = CounselingSession::with(['client', 'counselor'])
            ->where('counselor_id', $user->id)
            ->orderBy('scheduled_at', 'desc')
            ->paginate(15)
            ->through(function ($session) {
                return [
                    'id' => $session->id,
                    'client' => [
                        'id' => $session->client->id,
                        'name' => $session->client->name,
                        'email' => $session->client->email,
                    ],
                    'counselor' => [
                        'id' => $session->counselor->id,
                        'name' => $session->counselor->name,
                        'email' => $session->counselor->email,
                    ],
                    'scheduled_at' => $session->scheduled_at,
                    'status' => $session->status,
                    'notes' => $session->notes,
                    'session_type' => $session->session_type,
                    'created_at' => $session->created_at,
                    'is_followup' => str_contains($session->notes ?? '', 'Follow-up'),
                ];
            });

        $stats = [
            'total_sessions' => CounselingSession::where('counselor_id', $user->id)->count(),
            'upcoming_sessions' => CounselingSession::where('counselor_id', $user->id)
                ->where('scheduled_at', '>', now())
                ->count(),
            'completed_sessions' => CounselingSession::where('counselor_id', $user->id)
                ->where('status', 'completed')
                ->count(),
        ];

        // Get counselor's clients for the create dialog
        $clients = User::where('role', 'client')
            ->whereHas('counselingSessions', function ($query) use ($user) {
                $query->where('counselor_id', $user->id);
            })
            ->orWhereDoesntHave('counselingSessions')
            ->get()
            ->map(function ($client) {
                return [
                    'id' => $client->id,
                    'name' => $client->name,
                    'email' => $client->email,
                ];
            });

        return Inertia::render('counselor/sessions/index', [
            'sessions' => $sessions,
            'stats' => $stats,
            'clients' => $clients,
        ]);
    }

    public function create(Request $request)
    {
        $user = $request->user();

        // Get counselor's clients
        $clients = User::where('role', 'client')
            ->whereHas('counselingSessions', function ($query) use ($user) {
                $query->where('counselor_id', $user->id);
            })
            ->orWhereDoesntHave('counselingSessions')
            ->get()
            ->map(function ($client) {
                return [
                    'id' => $client->id,
                    'name' => $client->name,
                    'email' => $client->email,
                ];
            });

        return Inertia::render('counselor/sessions/create', [
            'clients' => $clients,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:users,id',
            'scheduled_at' => 'required|date|after:now',
            'notes' => 'nullable|string|max:500',
        ]);

        $user = $request->user();

        // Verify the client belongs to this counselor
        $client = User::where('id', $request->client_id)
            ->where('role', 'client')
            ->first();

        if (!$client) {
            return back()->withErrors(['client_id' => 'Invalid client selected.']);
        }

        $session = CounselingSession::create([
            'client_id' => $request->client_id,
            'counselor_id' => $user->id,
            'scheduled_at' => $request->scheduled_at,
            'status' => 'scheduled',
            'notes' => $request->notes,
        ]);

        // Send notification to client
        \App\Models\AppNotification::create([
            'user_id' => $request->client_id,
            'type' => 'session_scheduled',
            'title' => 'New Session Scheduled',
            'message' => "You have a new counseling session scheduled with {$user->name} on " . \Carbon\Carbon::parse($request->scheduled_at)->format('M j, Y \a\t g:i A'),
            'data' => [
                'session_id' => $session->id,
                'counselor_name' => $user->name,
                'scheduled_at' => $request->scheduled_at,
            ],
            'is_read' => false,
        ]);

        return redirect()->route('counselor.sessions.index')->with('success', 'Session scheduled successfully!');
    }

    public function show(Request $request, $sessionId)
    {
        $user = $request->user();

        $session = CounselingSession::with(['client', 'counselor'])
            ->where('id', $sessionId)
            ->where('counselor_id', $user->id)
            ->first();

        if (!$session) {
            abort(404, 'Session not found');
        }


        return response()->json([
            'session' => [
                'id' => $session->id,
                'client' => [
                    'id' => $session->client->id,
                    'name' => $session->client->name,
                    'email' => $session->client->email,
                ],
                'counselor' => [
                    'id' => $session->counselor->id,
                    'name' => $session->counselor->name,
                    'email' => $session->counselor->email,
                ],
                'scheduled_at' => $session->scheduled_at,
                'status' => $session->status,
                'notes' => $session->notes,
                'created_at' => $session->created_at,
                'is_followup' => str_contains($session->notes ?? '', 'Follow-up:'),
            ],
        ]);
    }

    public function destroy(Request $request, $sessionId)
    {
        $user = $request->user();

        $session = CounselingSession::where('id', $sessionId)
            ->where('counselor_id', $user->id)
            ->first();

        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        // Only allow deletion of scheduled sessions (not completed ones)
        if ($session->status === 'completed') {
            return response()->json(['error' => 'Cannot delete completed sessions'], 403);
        }

        $session->delete();

        return response()->json(['message' => 'Session deleted successfully']);
    }
}