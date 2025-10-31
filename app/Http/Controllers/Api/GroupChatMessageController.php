<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GroupChatMessage;
use App\Models\GroupChatSession;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class GroupChatMessageController extends Controller
{
    /**
     * Display a listing of messages for the specified session.
     */
    public function index(Request $request, $sessionId): JsonResponse
    {
        $user = $request->user();

        $session = GroupChatSession::where('id', $sessionId)
            ->where(function ($query) use ($user) {
                $query->where('creator_id', $user->id)
                      ->orWhereHas('participants', function ($subQuery) use ($user) {
                          $subQuery->where('user_id', $user->id)
                                   ->where('status', 'active');
                      });
            })
            ->first();

        if (!$session) {
            return response()->json(['message' => 'Group chat session not found'], 404);
        }

        $messages = GroupChatMessage::with('user:id,name,email')
            ->where('group_chat_session_id', $sessionId)
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return response()->json($messages);
    }

    /**
     * Store a newly created message in the specified session.
     */
    public function store(Request $request, $sessionId): JsonResponse
    {
        $user = $request->user();

        $session = GroupChatSession::where('id', $sessionId)
            ->where('is_active', true)
            ->where(function ($query) use ($user) {
                $query->where('creator_id', $user->id)
                      ->orWhereHas('participants', function ($subQuery) use ($user) {
                          $subQuery->where('user_id', $user->id)
                                   ->where('status', 'active');
                      });
            })
            ->first();

        if (!$session) {
            return response()->json(['message' => 'Group chat session not found or inactive'], 404);
        }

        $validated = $request->validate([
            'message' => 'required|string|max:1000',
            'type' => 'required|in:text,audio',
        ]);

        $message = GroupChatMessage::create([
            'group_chat_session_id' => $sessionId,
            'user_id' => $user->id,
            'message' => $validated['message'],
            'type' => $validated['type'],
        ]);

        return response()->json([
            'message' => $message->load('user:id,name,email'),
            'success' => true
        ], 201);
    }

    /**
     * Upload a file for the specified session.
     */
    public function upload(Request $request, $sessionId): JsonResponse
    {
        $user = $request->user();

        $session = GroupChatSession::where('id', $sessionId)
            ->where('is_active', true)
            ->where(function ($query) use ($user) {
                $query->where('creator_id', $user->id)
                      ->orWhereHas('participants', function ($subQuery) use ($user) {
                          $subQuery->where('user_id', $user->id)
                                   ->where('status', 'active');
                      });
            })
            ->first();

        if (!$session) {
            return response()->json(['message' => 'Group chat session not found or inactive'], 404);
        }

        $validated = $request->validate([
            'file' => 'required|file|max:10240|mimes:jpg,jpeg,png,gif,pdf,doc,docx,txt,audio/mpeg,audio/wav',
            'type' => 'required|in:audio,file',
        ]);

        $file = $request->file('file');
        $path = $file->store('group-chat-files', 'public');

        $message = GroupChatMessage::create([
            'group_chat_session_id' => $sessionId,
            'user_id' => $user->id,
            'message' => $file->getClientOriginalName(),
            'type' => $validated['type'],
            'file_path' => $path,
            'file_size' => $file->getSize(),
            'file_mime_type' => $file->getMimeType(),
        ]);

        return response()->json([
            'message' => $message->load('user:id,name,email'),
            'file_url' => Storage::url($path),
            'success' => true
        ], 201);
    }

    /**
     * Remove the specified message from storage.
     */
    public function destroy(Request $request, $sessionId, $messageId): JsonResponse
    {
        $user = $request->user();

        $message = GroupChatMessage::where('id', $messageId)
            ->where('group_chat_session_id', $sessionId)
            ->where('user_id', $user->id)
            ->first();

        if (!$message) {
            return response()->json(['message' => 'Message not found'], 404);
        }

        // Delete file if it exists
        if ($message->file_path) {
            Storage::disk('public')->delete($message->file_path);
        }

        $message->delete();

        return response()->json([
            'message' => 'Message deleted successfully'
        ]);
    }
}