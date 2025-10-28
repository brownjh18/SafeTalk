<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MessagesController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Get all conversations for the current user
        $sessionsWithChats = Chat::where(function ($query) use ($user) {
            $query->where('sender_id', $user->id)
                  ->orWhere('receiver_id', $user->id);
        })
        ->selectRaw('
            CASE
                WHEN sender_id = ? THEN receiver_id
                ELSE sender_id
            END as other_user_id,
            MAX(sent_at) as last_message_time,
            COUNT(CASE WHEN receiver_id = ? AND is_read = 0 THEN 1 END) as unread_count
        ', [$user->id, $user->id])
        ->groupBy('other_user_id')
        ->with(['sender', 'receiver'])
        ->get()
        ->map(function ($chat) use ($user) {
            $otherUserId = $chat->other_user_id;
            $otherUser = User::find($otherUserId);

            if (!$otherUser) {
                return null; // Skip if user doesn't exist
            }

            // Get the last message for this conversation
            $lastMessage = Chat::where(function ($query) use ($user, $otherUser) {
                $query->where(function ($q) use ($user, $otherUser) {
                    $q->where('sender_id', $user->id)->where('receiver_id', $otherUser->id);
                })->orWhere(function ($q) use ($user, $otherUser) {
                    $q->where('sender_id', $otherUser->id)->where('receiver_id', $user->id);
                });
            })->latest('sent_at')->first();

            return [
                'id' => $otherUser->id,
                'client_name' => $otherUser->name,
                'client_email' => $otherUser->email,
                'last_message' => $lastMessage ? $lastMessage->message : 'No messages yet',
                'last_message_time' => $lastMessage ? $lastMessage->sent_at : null,
                'unread_count' => $chat->unread_count,
                'other_user' => $otherUser,
            ];
        })->filter(); // Remove null entries

        // Get all users for search functionality
        $users = User::where('id', '!=', $user->id)->get(['id', 'name', 'email', 'role', 'verified']);

        return Inertia::render('messages/index', [
            'sessionsWithChats' => $sessionsWithChats,
            'users' => $users,
        ]);
    }

    public function show($userId)
    {
        $user = Auth::user();
        $otherUser = User::findOrFail($userId);

        // Mark messages as read
        Chat::where('sender_id', $otherUser->id)
            ->where('receiver_id', $user->id)
            ->update(['is_read' => true]);

        // Get messages between the two users
        $messages = Chat::where(function ($query) use ($user, $otherUser) {
            $query->where(function ($q) use ($user, $otherUser) {
                $q->where('sender_id', $user->id)->where('receiver_id', $otherUser->id);
            })->orWhere(function ($q) use ($user, $otherUser) {
                $q->where('sender_id', $otherUser->id)->where('receiver_id', $user->id);
            });
        })
        ->with(['sender', 'receiver'])
        ->orderBy('sent_at', 'asc')
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
                'is_from_user' => $chat->sender_id === $user->id,
                'sender_name' => $chat->sender->name,
            ];
        });

        return Inertia::render('messages/show', [
            'messages' => $messages,
            'otherUser' => $otherUser,
        ]);
    }

    public function store(Request $request, $userId)
    {
        $request->validate([
            'message' => 'nullable|string|max:1000',
            'file' => 'nullable|file|max:10240', // 10MB max
        ]);

        $user = Auth::user();
        $otherUser = User::findOrFail($userId);

        // Find or create a counseling session for the conversation
        $session = \App\Models\CounselingSession::firstOrCreate([
            'client_id' => min($user->id, $otherUser->id),
            'counselor_id' => max($user->id, $otherUser->id),
        ], [
            'status' => 'scheduled',
            'scheduled_at' => now(),
        ]);

        $messageData = [
            'session_id' => $session->id,
            'sender_id' => $user->id,
            'receiver_id' => $otherUser->id,
            'is_read' => false,
            'sent_at' => now(),
        ];

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('chats', $fileName, 'public');

            $messageData['file_path'] = $filePath;
            $messageData['file_name'] = $file->getClientOriginalName();
            $messageData['file_size'] = $file->getSize();
            $messageData['file_type'] = $file->getMimeType();
        }

        if ($request->message) {
            $messageData['message'] = $request->message;
        }

        Chat::create($messageData);

        return back();
    }

    public function startConversation(Request $request)
    {
        $request->validate([
            'other_user_id' => 'required|exists:users,id',
        ]);

        $user = Auth::user();
        $otherUser = User::findOrFail($request->other_user_id);

        // Check if conversation already exists
        $existingChat = Chat::where(function ($query) use ($user, $otherUser) {
            $query->where(function ($q) use ($user, $otherUser) {
                $q->where('sender_id', $user->id)->where('receiver_id', $otherUser->id);
            })->orWhere(function ($q) use ($user, $otherUser) {
                $q->where('sender_id', $otherUser->id)->where('receiver_id', $user->id);
            });
        })->exists();

        if (!$existingChat) {
            // Find or create a counseling session for the conversation
            $session = \App\Models\CounselingSession::firstOrCreate([
                'client_id' => min($user->id, $otherUser->id),
                'counselor_id' => max($user->id, $otherUser->id),
            ], [
                'status' => 'scheduled',
                'scheduled_at' => now(),
            ]);

            // Create initial conversation message
            Chat::create([
                'session_id' => $session->id,
                'sender_id' => $user->id,
                'receiver_id' => $otherUser->id,
                'message' => 'Hi! I\'ve started a conversation with you.',
                'is_read' => false,
                'sent_at' => now(),
            ]);
        }

        return redirect()->back()->with('success', 'Conversation started successfully');
    }
}