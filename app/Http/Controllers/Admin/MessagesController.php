<?php

namespace App\Http\Controllers\Admin;

use App\Models\Chat;
use App\Models\CounselingSession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MessagesController extends \App\Http\Controllers\Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // For admin, only show conversations that actually exist (have messages)
        $adminConversations = collect();

        // Get all sessions where admin is involved (as counselor or client)
        $sessions = CounselingSession::where(function($query) use ($user) {
            $query->where('counselor_id', $user->id)->orWhere('client_id', $user->id);
        })->get();

        foreach ($sessions as $session) {
            // Determine the other user in the conversation
            $otherUserId = $session->counselor_id === $user->id ? $session->client_id : $session->counselor_id;
            $otherUser = User::find($otherUserId);

            if ($otherUser) {
                // Check for messages in this session
                $lastMessage = Chat::where('session_id', $session->id)
                    ->orderBy('sent_at', 'desc')
                    ->first();

                // Only include conversations that have at least one message
                if ($lastMessage) {
                    $unreadCount = Chat::where('session_id', $session->id)
                        ->where('sender_id', '!=', $user->id)
                        ->where('is_read', false)
                        ->count();

                    $adminConversations->push([
                        'id' => $session->id,
                        'client_name' => $otherUser->name,
                        'client_email' => $otherUser->email,
                        'last_message' => $lastMessage->message,
                        'last_message_time' => $lastMessage->sent_at,
                        'unread_count' => $unreadCount,
                        'role' => $otherUser->role,
                        'has_messages' => true,
                    ]);
                }
            }
        }

        // Get all users for starting new conversations (admin can message anyone)
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

        // Get messages for the first conversation if any exist
        $messages = [];
        if ($adminConversations->isNotEmpty()) {
            $firstConversation = $adminConversations->first();
            $messages = Chat::with('sender')
                ->where('session_id', $firstConversation['id'])
                ->orderBy('sent_at')
                ->get()
                ->map(function ($chat) use ($user) {
                    return [
                        'id' => $chat->id,
                        'message' => $chat->message,
                        'file_path' => $chat->file_path,
                        'file_name' => $chat->file_name,
                        'file_size' => $chat->file_size,
                        'file_type' => $chat->file_type,
                        'sent_at' => $chat->sent_at,
                        'is_from_admin' => $chat->sender_id === $user->id,
                        'sender_name' => $chat->sender->name,
                    ];
                });
        }

        return Inertia::render('admin/messages/index', [
            'sessionsWithChats' => $adminConversations->toArray(),
            'users' => $users->toArray(),
            'messages' => $messages,
        ]);
    }

    public function show(Request $request, CounselingSession $session)
    {
        // Admin can view any session, no restrictions

        // Mark messages as read for admin
        Chat::where('session_id', $session->id)
            ->where('sender_id', '!=', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        // Redirect to index with session parameter
        return redirect()->route('admin.messages.index', ['session' => $session->id]);
    }

    public function store(Request $request, CounselingSession $session)
    {
        $request->validate([
            'message' => 'nullable|string|max:1000',
            'file' => 'nullable|file|max:10240', // 10MB max
        ]);

        $chatData = [
            'session_id' => $session->id,
            'sender_id' => $request->user()->id,
            'sent_at' => now(),
            'is_read' => false,
        ];

        // Handle file upload
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('chat_files', $fileName, 'public');

            $chatData['file_path'] = $filePath;
            $chatData['file_name'] = $file->getClientOriginalName();
            $chatData['file_size'] = $file->getSize();
            $chatData['file_type'] = $file->getMimeType();
        }

        // Add message if provided
        if ($request->filled('message')) {
            $chatData['message'] = $request->message;
        }

        Chat::create($chatData);

        return redirect()->back();
    }

    public function startConversation(Request $request)
    {
        $request->validate([
            'other_user_id' => 'required|exists:users,id',
        ]);

        $user = $request->user();
        $otherUser = User::findOrFail($request->other_user_id);

        // Check if a session already exists between admin and this user
        $existingSession = CounselingSession::where(function($query) use ($user, $otherUser) {
            $query->where('counselor_id', $user->id)->where('client_id', $otherUser->id);
        })->orWhere(function($query) use ($user, $otherUser) {
            $query->where('counselor_id', $otherUser->id)->where('client_id', $user->id);
        })->first();

        if (!$existingSession) {
            // Create a new session for admin-to-user communication
            $existingSession = CounselingSession::create([
                'counselor_id' => $user->id, // Admin as counselor
                'client_id' => $otherUser->id,
                'status' => 'scheduled',
                'scheduled_at' => now(),
            ]);
        }

        return response()->json(['session_id' => $existingSession->id]);
    }
}
