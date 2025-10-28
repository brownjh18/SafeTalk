<?php

namespace App\Http\Controllers\Counselor;

use App\Http\Controllers\Controller;
use App\Models\CounselingSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ActiveSessionController extends Controller
{
    public function show(Request $request, $sessionId)
    {
        $user = Auth::user();

        $session = CounselingSession::where('id', $sessionId)
            ->where('counselor_id', $user->id)
            ->with(['client', 'counselor'])
            ->firstOrFail();

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

        return Inertia::render('counselor/sessions/active', [
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
            ],
            'chats' => $chats,
            'currentUser' => $user,
        ]);
    }

    public function updateNotes(Request $request, $sessionId)
    {
        $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();

        $session = CounselingSession::where('id', $sessionId)
            ->where('counselor_id', $user->id)
            ->firstOrFail();

        $session->update([
            'notes' => $request->notes,
        ]);

        return Inertia::render('counselor/sessions/active', [
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
            ],
            'chats' => [],
            'currentUser' => $user,
            'flash' => [
                'message' => 'Session notes updated successfully.',
                'type' => 'success',
            ],
        ]);
    }

    public function endSession(Request $request, $sessionId)
    {
        $user = Auth::user();

        $session = CounselingSession::where('id', $sessionId)
            ->where('counselor_id', $user->id)
            ->firstOrFail();

        $session->update([
            'status' => 'completed',
        ]);

        // TODO: Add session end logic (notifications, cleanup, etc.)

        return redirect()->route('counselor.sessions.index')
            ->with('success', 'Session ended successfully.');
    }

    public function markCompleted(Request $request, $sessionId)
    {
        $user = Auth::user();

        $session = CounselingSession::where('id', $sessionId)
            ->where('counselor_id', $user->id)
            ->firstOrFail();

        $session->update([
            'status' => 'completed',
        ]);

        return Inertia::render('counselor/sessions/active', [
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
            ],
            'chats' => [],
            'currentUser' => $user,
            'flash' => [
                'message' => 'Session marked as completed.',
                'type' => 'success',
            ],
        ]);
    }

    public function requestFollowup(Request $request, $sessionId)
    {
        $request->validate([
            'scheduled_at' => 'required|date|after:now',
            'notes' => 'nullable|string|max:500',
        ]);

        $user = Auth::user();

        $session = CounselingSession::where('id', $sessionId)
            ->where('counselor_id', $user->id)
            ->firstOrFail();

        // Create follow-up session
        CounselingSession::create([
            'client_id' => $session->client_id,
            'counselor_id' => $session->counselor_id,
            'scheduled_at' => $request->scheduled_at,
            'status' => 'scheduled',
            'notes' => $request->notes ? "Follow-up: " . $request->notes : "Follow-up session",
            'session_type' => $session->session_type,
        ]);

        // Redirect to sessions page after scheduling follow-up
        return redirect()->route('counselor.sessions.index')
            ->with('success', 'Follow-up session scheduled successfully.');
    }
}
