<?php

namespace App\Http\Controllers\Client;

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
            ->where('client_id', $user->id)
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

        return Inertia::render('client/sessions/active', [
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
}
