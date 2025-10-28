<?php

namespace App\Http\Controllers\Admin;

use App\Models\CounselingSession;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SessionMonitoringController extends \App\Http\Controllers\Controller
{
    public function index(Request $request)
    {
        $sessions = CounselingSession::with(['client', 'counselor'])
            ->orderBy('scheduled_at', 'desc')
            ->paginate(20);

        $stats = [
            'total_sessions' => CounselingSession::count(),
            'active_sessions' => CounselingSession::where('status', 'in_progress')->count(),
            'completed_sessions' => CounselingSession::where('status', 'completed')->count(),
            'scheduled_sessions' => CounselingSession::where('status', 'scheduled')->count(),
        ];

        return Inertia::render('admin/sessions/index', [
            'sessions' => $sessions,
            'stats' => $stats,
        ]);
    }

    public function show(Request $request, $sessionId)
    {
        $session = CounselingSession::with(['client', 'counselor'])
            ->findOrFail($sessionId);

        // Get chat messages for this session
        $chats = \App\Models\Chat::where('session_id', $sessionId)
            ->orderBy('sent_at', 'asc')
            ->get()
            ->map(function ($chat) use ($session) {
                return [
                    'id' => $chat->id,
                    'message' => $chat->message,
                    'sent_at' => $chat->sent_at,
                    'is_from_counselor' => $chat->sender_id === $session->counselor_id,
                    'sender_name' => $chat->sender_id === $session->counselor_id ? $session->counselor->name : $session->client->name,
                ];
            });

        // Get progress reports for this session
        $progressReports = \App\Models\ProgressReport::where('session_id', $sessionId)
            ->orderBy('created_at', 'desc')
            ->get();

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
                'session_type' => $session->session_type,
                'created_at' => $session->created_at,
                'is_followup' => str_contains($session->notes ?? '', 'Follow-up:'),
            ],
        ]);
    }

    public function update(Request $request, $sessionId)
    {
        $request->validate([
            'status' => 'required|in:scheduled,in_progress,completed,cancelled',
            'notes' => 'nullable|string|max:500',
        ]);

        $session = CounselingSession::findOrFail($sessionId);
        $session->update($request->only(['status', 'notes']));

        return response()->json([
            'message' => 'Session updated successfully',
            'session' => $session,
        ]);
    }

    public function destroy(Request $request, $sessionId)
    {
        $session = CounselingSession::findOrFail($sessionId);
        $session->delete();

        return response()->json([
            'message' => 'Session deleted successfully',
        ]);
    }
}