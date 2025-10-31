<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GroupChatSession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GroupChatJoinRequestController extends Controller
{
    /**
     * Display a listing of join requests for the specified session.
     */
    public function index(Request $request, $sessionId): JsonResponse
    {
        $user = $request->user();

        $session = GroupChatSession::where('id', $sessionId)
            ->where('creator_id', $user->id)
            ->first();

        if (!$session) {
            return response()->json(['message' => 'Group chat session not found or you are not the creator'], 404);
        }

        $joinRequests = $session->participants()
            ->where('status', 'pending')
            ->withPivot('joined_at')
            ->get()
            ->map(function ($participant) {
                return [
                    'id' => $participant->pivot->id,
                    'user_id' => $participant->id,
                    'user_name' => $participant->name,
                    'user_email' => $participant->email,
                    'requested_at' => $participant->pivot->joined_at,
                ];
            });

        return response()->json([
            'join_requests' => $joinRequests,
            'total' => $joinRequests->count()
        ]);
    }

    /**
     * Store a newly created join request for the specified session.
     */
    public function store(Request $request, $sessionId): JsonResponse
    {
        $user = $request->user();

        $session = GroupChatSession::where('id', $sessionId)
            ->where('is_active', true)
            ->first();

        if (!$session) {
            return response()->json(['message' => 'Group chat session not found'], 404);
        }

        // Check if user is already a participant
        $existingParticipant = $session->participants()->where('user_id', $user->id)->first();
        if ($existingParticipant) {
            if ($existingParticipant->pivot->status === 'active') {
                return response()->json(['message' => 'You are already a participant in this session'], 400);
            } elseif ($existingParticipant->pivot->status === 'pending') {
                return response()->json(['message' => 'You already have a pending join request'], 400);
            } elseif ($existingParticipant->pivot->status === 'removed') {
                return response()->json(['message' => 'You have been removed from this session and cannot rejoin'], 400);
            }
        }

        // Check max participants
        if ($session->participants()->where('status', 'active')->count() >= $session->max_participants) {
            return response()->json(['message' => 'Session has reached maximum participants'], 400);
        }

        // If user is counselor, they can join directly
        if ($user->role === 'counselor') {
            $session->participants()->attach($user->id, [
                'role' => 'participant',
                'status' => 'active',
                'joined_at' => now(),
            ]);

            return response()->json([
                'message' => 'Successfully joined the group chat session',
                'status' => 'joined'
            ]);
        } else {
            // Clients need approval - create join request
            $session->participants()->attach($user->id, [
                'role' => 'participant',
                'status' => 'pending',
                'joined_at' => now(),
            ]);

            return response()->json([
                'message' => 'Join request submitted successfully',
                'status' => 'pending'
            ], 201);
        }
    }

    /**
     * Approve the specified join request.
     */
    public function approve(Request $request, $sessionId, $requestId): JsonResponse
    {
        $user = $request->user();

        $session = GroupChatSession::where('id', $sessionId)
            ->where('creator_id', $user->id)
            ->where('is_active', true)
            ->first();

        if (!$session) {
            return response()->json(['message' => 'Group chat session not found or you are not the creator'], 404);
        }

        // Find the participant with the request ID
        $participant = $session->participants()
            ->wherePivot('id', $requestId)
            ->wherePivot('status', 'pending')
            ->first();

        if (!$participant) {
            return response()->json(['message' => 'Join request not found'], 404);
        }

        // Check max participants
        if ($session->participants()->where('status', 'active')->count() >= $session->max_participants) {
            return response()->json(['message' => 'Session has reached maximum participants'], 400);
        }

        // Update status to active
        $session->participants()->updateExistingPivot($participant->id, [
            'status' => 'active'
        ]);

        return response()->json([
            'message' => 'Join request approved successfully',
            'participant' => [
                'id' => $participant->id,
                'name' => $participant->name,
                'email' => $participant->email,
            ]
        ]);
    }

    /**
     * Reject the specified join request.
     */
    public function reject(Request $request, $sessionId, $requestId): JsonResponse
    {
        $user = $request->user();

        $session = GroupChatSession::where('id', $sessionId)
            ->where('creator_id', $user->id)
            ->first();

        if (!$session) {
            return response()->json(['message' => 'Group chat session not found or you are not the creator'], 404);
        }

        // Find the participant with the request ID
        $participant = $session->participants()
            ->wherePivot('id', $requestId)
            ->wherePivot('status', 'pending')
            ->first();

        if (!$participant) {
            return response()->json(['message' => 'Join request not found'], 404);
        }

        // Remove the participant record
        $session->participants()->detach($participant->id);

        return response()->json([
            'message' => 'Join request rejected successfully'
        ]);
    }
}