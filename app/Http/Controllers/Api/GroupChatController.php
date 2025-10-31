<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GroupChatSession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class GroupChatController extends Controller
{
    /**
     * Display a listing of group chat sessions.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = GroupChatSession::with(['creator', 'participants']);

        if ($user->role === 'counselor') {
            // Counselors see all sessions they created
            $query->where('creator_id', $user->id);
        } else {
            // Clients see all active sessions
            $query->where('is_active', true);
        }

        $sessions = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->through(function ($session) use ($user) {
                $isCreator = $session->creator_id === $user->id;
                $isParticipant = $session->participants->contains('id', $user->id);

                // Determine user's join status for this session
                $userJoinStatus = 'none';
                if ($user->role === 'counselor' && $session->creator_id === $user->id) {
                    // Creator is always active
                    $userJoinStatus = 'active';
                } elseif ($user->role !== 'counselor') {
                    $participantRecord = $session->participants()->where('user_id', $user->id)->first();
                    if ($participantRecord) {
                        $userJoinStatus = $participantRecord->pivot->status;
                    }
                }

                return [
                    'id' => $session->id,
                    'title' => $session->title,
                    'description' => $session->description,
                    'mode' => $session->mode,
                    'max_participants' => $session->max_participants,
                    'is_active' => $session->is_active,
                    'creator' => $session->creator ? [
                        'id' => $session->creator->id,
                        'name' => $session->creator->name,
                    ] : null,
                    'participant_count' => $session->participants->count(),
                    'is_creator' => $isCreator,
                    'is_participant' => $isParticipant,
                    'user_join_status' => $userJoinStatus,
                    'created_at' => $session->created_at,
                    'updated_at' => $session->updated_at,
                ];
            });

        return response()->json($sessions);
    }

    /**
     * Store a newly created group chat session.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        // Only counselors can create group chat sessions
        if ($user->role !== 'counselor') {
            return response()->json(['message' => 'Only counselors can create group chat sessions'], 403);
        }

        // Only verified counselors can create group chat sessions
        if (!$user->verified) {
            return response()->json(['message' => 'You must be verified to create group chat sessions'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'mode' => 'required|in:audio,message',
            'max_participants' => 'nullable|integer|min:2|max:50',
        ]);

        try {
            DB::transaction(function () use ($validated, $user) {
                $session = GroupChatSession::create([
                    'title' => $validated['title'],
                    'description' => $validated['description'],
                    'creator_id' => $user->id,
                    'mode' => $validated['mode'],
                    'max_participants' => $validated['max_participants'] ?? 10,
                    'is_active' => true,
                ]);

                // Add creator as participant with 'creator' role
                $session->participants()->attach($user->id, [
                    'role' => 'creator',
                    'status' => 'active',
                    'joined_at' => now(),
                ]);
            });

            return response()->json([
                'message' => 'Group chat session created successfully',
                'success' => true
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create group chat session',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified group chat session.
     */
    public function show(Request $request, $sessionId): JsonResponse
    {
        $user = $request->user();

        $session = GroupChatSession::with(['creator', 'participants' => function ($query) {
            $query->where('status', 'active');
        }])
            ->where('id', $sessionId)
            ->where(function ($query) use ($user) {
                if ($user->role === 'counselor') {
                    // Counselors can view any session they created
                    $query->where('creator_id', $user->id);
                } else {
                    // Clients can view active sessions they can join, or sessions they participated in
                    $query->where(function ($subQuery) use ($user) {
                        $subQuery->where('is_active', true) // Active sessions they can join
                                  ->orWhereHas('participants', function ($participantQuery) use ($user) {
                                      $participantQuery->where('user_id', $user->id)
                                                       ->where('status', 'active');
                                  });
                    });
                }
            })
            ->first();

        if (!$session) {
            return response()->json(['message' => 'Group chat session not found'], 404);
        }

        $isCreator = $session->creator_id === $user->id;
        $isParticipant = $session->participants->contains('id', $user->id);

        return response()->json([
            'session' => [
                'id' => $session->id,
                'title' => $session->title,
                'description' => $session->description,
                'mode' => $session->mode,
                'max_participants' => $session->max_participants,
                'is_active' => $session->is_active,
                'creator' => [
                    'id' => $session->creator->id,
                    'name' => $session->creator->name,
                ],
                'participants' => $session->participants->map(function ($participant) {
                    return [
                        'id' => $participant->id,
                        'name' => $participant->name,
                        'email' => $participant->email,
                        'role' => $participant->pivot->role,
                        'status' => $participant->pivot->status ?? 'active',
                        'joined_at' => $participant->pivot->joined_at,
                    ];
                }),
                'participant_count' => $session->participants->count(),
                'is_creator' => $isCreator,
                'is_participant' => $isParticipant,
                'created_at' => $session->created_at,
                'updated_at' => $session->updated_at,
            ]
        ]);
    }

    /**
     * Update the specified group chat session.
     */
    public function update(Request $request, $sessionId): JsonResponse
    {
        $user = $request->user();

        $session = GroupChatSession::where('id', $sessionId)
            ->where('creator_id', $user->id)
            ->first();

        if (!$session) {
            return response()->json(['message' => 'Group chat session not found or you are not the creator'], 404);
        }

        // Only allow updates if session is active
        if (!$session->is_active) {
            return response()->json(['message' => 'Cannot update inactive sessions'], 400);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'max_participants' => 'nullable|integer|min:2|max:50',
        ]);

        // Mode cannot be changed for active sessions
        $updateData = [
            'title' => $validated['title'],
            'description' => $validated['description'],
            'max_participants' => $validated['max_participants'] ?? $session->max_participants,
        ];

        $session->update($updateData);

        return response()->json([
            'message' => 'Group chat session updated successfully',
            'session' => $session
        ]);
    }

    /**
     * Remove the specified group chat session.
     */
    public function destroy(Request $request, $sessionId): JsonResponse
    {
        $user = $request->user();

        $session = GroupChatSession::where('id', $sessionId)
            ->where('creator_id', $user->id)
            ->first();

        if (!$session) {
            return response()->json(['message' => 'Group chat session not found or you are not the creator'], 404);
        }

        // Delete all participants first (cascade will handle this, but let's be explicit)
        $session->participants()->detach();

        // Delete the session
        $session->delete();

        return response()->json([
            'message' => 'Group chat session deleted successfully'
        ]);
    }

    /**
     * End the specified group chat session.
     */
    public function end(Request $request, $sessionId): JsonResponse
    {
        $user = $request->user();

        $session = GroupChatSession::where('id', $sessionId)
            ->where('creator_id', $user->id)
            ->where('is_active', true)
            ->first();

        if (!$session) {
            return response()->json(['message' => 'Active group chat session not found or you are not the creator'], 404);
        }

        // End the session by setting is_active to false
        $session->update(['is_active' => false]);

        return response()->json([
            'message' => 'Group chat session ended successfully'
        ]);
    }

    /**
     * Start the specified group chat session.
     */
    public function start(Request $request, $sessionId): JsonResponse
    {
        $user = $request->user();

        $session = GroupChatSession::where('id', $sessionId)
            ->where('creator_id', $user->id)
            ->where('is_active', false)
            ->first();

        if (!$session) {
            return response()->json(['message' => 'Inactive group chat session not found or you are not the creator'], 404);
        }

        // Start the session by setting is_active to true
        $session->update(['is_active' => true]);

        return response()->json([
            'message' => 'Group chat session started successfully'
        ]);
    }
}