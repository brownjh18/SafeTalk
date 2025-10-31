<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GroupChatSession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class GroupChatParticipantController extends Controller
{
    /**
     * Display a listing of participants for the specified session.
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

        $participants = $session->participants()
            ->withPivot('role', 'status', 'joined_at')
            ->get()
            ->map(function ($participant) {
                return [
                    'id' => $participant->id,
                    'name' => $participant->name,
                    'email' => $participant->email,
                    'role' => $participant->pivot->role,
                    'status' => $participant->pivot->status,
                    'joined_at' => $participant->pivot->joined_at,
                ];
            });

        return response()->json([
            'participants' => $participants,
            'total' => $participants->count()
        ]);
    }

    /**
     * Invite a user to join the group chat session.
     */
    public function invite(Request $request, $sessionId, $userId): JsonResponse
    {
        $user = $request->user();

        $session = GroupChatSession::where('id', $sessionId)
            ->where('creator_id', $user->id)
            ->where('is_active', true)
            ->first();

        if (!$session) {
            return response()->json(['message' => 'Group chat session not found or you are not the creator'], 404);
        }

        $targetUser = User::findOrFail($userId);

        // Check if user is already a participant
        $existingParticipant = $session->participants()->where('user_id', $userId)->first();
        if ($existingParticipant) {
            if ($existingParticipant->pivot->status === 'active') {
                return response()->json(['message' => 'User is already a participant'], 400);
            } elseif ($existingParticipant->pivot->status === 'pending') {
                return response()->json(['message' => 'User already has a pending invitation'], 400);
            }
        }

        // Check max participants
        if ($session->participants()->where('status', 'active')->count() >= $session->max_participants) {
            return response()->json(['message' => 'Session has reached maximum participants'], 400);
        }

        // Add user as participant with pending status
        $session->participants()->attach($userId, [
            'role' => 'participant',
            'status' => 'pending',
            'joined_at' => now(),
        ]);

        return response()->json([
            'message' => 'User invited successfully',
            'participant' => [
                'id' => $targetUser->id,
                'name' => $targetUser->name,
                'email' => $targetUser->email,
                'status' => 'pending',
            ]
        ]);
    }

    /**
     * Accept an invitation to join the group chat session.
     */
    public function accept(Request $request, $sessionId, $userId): JsonResponse
    {
        $user = $request->user();

        // Users can only accept their own invitations
        if ($user->id != $userId) {
            return response()->json(['message' => 'You can only accept your own invitations'], 403);
        }

        $session = GroupChatSession::where('id', $sessionId)
            ->where('is_active', true)
            ->first();

        if (!$session) {
            return response()->json(['message' => 'Group chat session not found'], 404);
        }

        // Check if user has a pending invitation
        $participant = $session->participants()->where('user_id', $userId)->first();
        if (!$participant || $participant->pivot->status !== 'pending') {
            return response()->json(['message' => 'No pending invitation found'], 400);
        }

        // Check max participants
        if ($session->participants()->where('status', 'active')->count() >= $session->max_participants) {
            return response()->json(['message' => 'Session has reached maximum participants'], 400);
        }

        // Update status to active
        $session->participants()->updateExistingPivot($userId, [
            'status' => 'active'
        ]);

        return response()->json([
            'message' => 'Successfully joined the group chat session'
        ]);
    }

    /**
     * Decline an invitation to join the group chat session.
     */
    public function decline(Request $request, $sessionId, $userId): JsonResponse
    {
        $user = $request->user();

        // Users can only decline their own invitations
        if ($user->id != $userId) {
            return response()->json(['message' => 'You can only decline your own invitations'], 403);
        }

        $session = GroupChatSession::where('id', $sessionId)->first();

        if (!$session) {
            return response()->json(['message' => 'Group chat session not found'], 404);
        }

        // Check if user has a pending invitation
        $participant = $session->participants()->where('user_id', $userId)->first();
        if (!$participant || $participant->pivot->status !== 'pending') {
            return response()->json(['message' => 'No pending invitation found'], 400);
        }

        // Remove the participant record
        $session->participants()->detach($userId);

        return response()->json([
            'message' => 'Invitation declined successfully'
        ]);
    }

    /**
     * Remove a participant from the group chat session.
     */
    public function remove(Request $request, $sessionId, $userId): JsonResponse
    {
        $user = $request->user();

        $session = GroupChatSession::where('id', $sessionId)
            ->where('creator_id', $user->id)
            ->first();

        if (!$session) {
            return response()->json(['message' => 'Group chat session not found or you are not the creator'], 404);
        }

        // Cannot remove the creator
        if ($userId == $session->creator_id) {
            return response()->json(['message' => 'Cannot remove the session creator'], 400);
        }

        // Check if participant exists
        $participant = $session->participants()->where('user_id', $userId)->first();
        if (!$participant) {
            return response()->json(['message' => 'Participant not found'], 404);
        }

        // Update participant status to 'removed'
        $session->participants()->updateExistingPivot($userId, [
            'status' => 'removed'
        ]);

        return response()->json([
            'message' => 'Participant has been removed from the session'
        ]);
    }

    /**
     * Mute a participant in the group chat session.
     */
    public function mute(Request $request, $sessionId, $userId): JsonResponse
    {
        $user = $request->user();

        $session = GroupChatSession::where('id', $sessionId)
            ->where('creator_id', $user->id)
            ->first();

        if (!$session) {
            return response()->json(['message' => 'Group chat session not found or you are not the creator'], 404);
        }

        // Cannot mute the creator
        if ($userId == $session->creator_id) {
            return response()->json(['message' => 'Cannot mute the session creator'], 400);
        }

        // Check if participant exists and is active
        $participant = $session->participants()->where('user_id', $userId)->first();
        if (!$participant || $participant->pivot->status !== 'active') {
            return response()->json(['message' => 'Active participant not found'], 404);
        }

        // Note: This would require adding a 'muted' field to the pivot table
        // For now, we'll return a placeholder response
        return response()->json([
            'message' => 'Mute functionality not yet implemented',
            'note' => 'This requires adding a muted field to the group_chat_participants pivot table'
        ], 501);
    }

    /**
     * Unmute a participant in the group chat session.
     */
    public function unmute(Request $request, $sessionId, $userId): JsonResponse
    {
        $user = $request->user();

        $session = GroupChatSession::where('id', $sessionId)
            ->where('creator_id', $user->id)
            ->first();

        if (!$session) {
            return response()->json(['message' => 'Group chat session not found or you are not the creator'], 404);
        }

        // Check if participant exists and is active
        $participant = $session->participants()->where('user_id', $userId)->first();
        if (!$participant || $participant->pivot->status !== 'active') {
            return response()->json(['message' => 'Active participant not found'], 404);
        }

        // Note: This would require adding a 'muted' field to the pivot table
        // For now, we'll return a placeholder response
        return response()->json([
            'message' => 'Unmute functionality not yet implemented',
            'note' => 'This requires adding a muted field to the group_chat_participants pivot table'
        ], 501);
    }
}