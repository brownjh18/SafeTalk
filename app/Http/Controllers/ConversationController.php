<?php

namespace App\Http\Controllers;

use App\Models\CounselingSession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ConversationController extends Controller
{
    public function search(Request $request)
    {
        $user = $request->user();

        // Get all users except current user
        $users = User::where('id', '!=', $user->id)
            ->orderBy('name')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'verified' => $user->verified,
                ];
            });

        return Inertia::render('users/search', [
            'users' => $users,
            'currentUser' => [
                'id' => $user->id,
                'role' => $user->role,
            ],
        ]);
    }

    public function start(Request $request)
    {
        $request->validate([
            'other_user_id' => 'required|exists:users,id',
        ]);

        $user = $request->user();
        $otherUser = User::findOrFail($request->other_user_id);

        // Prevent starting conversation with self
        if ($user->id === $otherUser->id) {
            return redirect()->back()->with('error', 'Cannot start conversation with yourself');
        }

        // Determine roles and create session accordingly
        if ($user->role === 'client' && $otherUser->role === 'counselor') {
            // Client starting conversation with counselor
            $session = CounselingSession::firstOrCreate([
                'client_id' => $user->id,
                'counselor_id' => $otherUser->id,
            ], [
                'status' => 'scheduled',
                'scheduled_at' => now(),
            ]);
        } elseif ($user->role === 'counselor' && $otherUser->role === 'client') {
            // Counselor starting conversation with client
            $session = CounselingSession::firstOrCreate([
                'client_id' => $otherUser->id,
                'counselor_id' => $user->id,
            ], [
                'status' => 'scheduled',
                'scheduled_at' => now(),
            ]);
        } elseif ($user->role === 'counselor' && $otherUser->role === 'counselor') {
            // Counselor to counselor - create session with first as client, second as counselor
            $session = CounselingSession::firstOrCreate([
                'client_id' => min($user->id, $otherUser->id),
                'counselor_id' => max($user->id, $otherUser->id),
            ], [
                'status' => 'scheduled',
                'scheduled_at' => now(),
            ]);
        } elseif ($user->role === 'client' && $otherUser->role === 'client') {
            // Client to client - create session with first as client, second as counselor
            $session = CounselingSession::firstOrCreate([
                'client_id' => min($user->id, $otherUser->id),
                'counselor_id' => max($user->id, $otherUser->id),
            ], [
                'status' => 'scheduled',
                'scheduled_at' => now(),
            ]);
        } else {
            // Admin or other combinations
            $session = CounselingSession::firstOrCreate([
                'client_id' => min($user->id, $otherUser->id),
                'counselor_id' => max($user->id, $otherUser->id),
            ], [
                'status' => 'scheduled',
                'scheduled_at' => now(),
            ]);
        }

        // Redirect to the appropriate messages page based on user role
        if ($user->role === 'client') {
            return redirect()->route('client.messages.index', ['session' => $session->id])->with('success', 'Conversation started successfully');
        } elseif ($user->role === 'counselor') {
            return redirect()->route('counselor.messages.index', ['session' => $session->id])->with('success', 'Conversation started successfully');
        } else {
            // Admin or other roles
            return redirect()->back()->with('success', 'Conversation started successfully')->with('conversation', $session);
        }
    }
}