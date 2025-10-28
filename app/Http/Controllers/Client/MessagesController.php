<?php

namespace App\Http\Controllers\Client;

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

        // Get all sessions where this client has chats
        $sessionIds = Chat::whereHas('counselingSession', function($query) use ($user) {
            $query->where('client_id', $user->id);
        })->distinct()->pluck('session_id');

        $sessionsWithChats = CounselingSession::with(['counselor', 'chats' => function($query) {
            $query->orderBy('sent_at', 'desc')->take(1);
        }])
        ->whereIn('id', $sessionIds)
        ->where('client_id', $user->id)
        ->get()
        ->map(function ($session) {
            $lastMessage = $session->chats->first();
            $unreadCount = Chat::where('session_id', $session->id)
                ->where('sender_id', '!=', $session->client_id)
                ->where('is_read', false)
                ->count();

            return [
                'id' => $session->id,
                'counselor_name' => $session->counselor->name,
                'counselor_email' => $session->counselor->email,
                'last_message' => $lastMessage ? $lastMessage->message : 'No messages yet',
                'last_message_time' => $lastMessage ? $lastMessage->sent_at : null,
                'unread_count' => $unreadCount,
            ];
        });

        // Get all users for the search modal
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

        // Get messages for the first session if any exist
        $messages = [];
        if ($sessionsWithChats->isNotEmpty()) {
            $firstSession = $sessionsWithChats->first();
            $messages = Chat::with('sender')
                ->where('session_id', $firstSession['id'])
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
                        'is_from_client' => $chat->sender_id === $user->id,
                        'sender_name' => $chat->sender->name,
                    ];
                });
        }

        return Inertia::render('client/messages/index', [
            'sessionsWithChats' => $sessionsWithChats,
            'users' => $users,
            'messages' => $messages,
        ]);
    }

    public function show(Request $request, CounselingSession $session)
    {
        // Verify the session belongs to this client
        if ($session->client_id !== $request->user()->id) {
            abort(403);
        }

        // Mark messages as read
        Chat::where('session_id', $session->id)
            ->where('sender_id', '!=', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        // Check if this is the first time the client is accessing this session
        $hasStartedSession = Chat::where('session_id', $session->id)->exists();

        if (!$hasStartedSession) {
            // Send notification to counselor that client has started the session
            \App\Models\AppNotification::create([
                'user_id' => $session->counselor_id,
                'type' => 'session_started',
                'title' => 'Client Started Session',
                'message' => "{$request->user()->name} has started the counseling session scheduled for " . \Carbon\Carbon::parse($session->scheduled_at)->format('M j, Y \a\t g:i A'),
                'data' => [
                    'session_id' => $session->id,
                    'client_name' => $request->user()->name,
                    'scheduled_at' => $session->scheduled_at,
                ],
                'is_read' => false,
            ]);
        }

        // Redirect to index with session parameter
        return redirect()->route('client.messages.index', ['session' => $session->id]);
    }

    public function store(Request $request, CounselingSession $session)
    {
        // Verify the session belongs to this client
        if ($session->client_id !== $request->user()->id) {
            abort(403);
        }

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
}