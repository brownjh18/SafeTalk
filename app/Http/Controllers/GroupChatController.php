<?php

namespace App\Http\Controllers;

use App\Events\GroupChatMessageSent;
use App\Events\GroupChatParticipantJoined;
use App\Events\GroupChatParticipantLeft;
use App\Events\WebRTCSignaling;
use App\Models\GroupChatMessage;
use App\Models\GroupChatSession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class GroupChatController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get all sessions for authenticated users
        // All users see active public sessions, plus private sessions they were invited to, plus sessions they actively participate in
        // Counselors also see all sessions they created
        $query = GroupChatSession::with(['creator', 'participants']);

        $query->where(function ($mainQuery) use ($user) {
            // Active public sessions (visible to all users)
            $mainQuery->where('is_active', true)
                      ->where('is_private', false);

            // Private sessions where user was invited or is active
            $mainQuery->orWhereHas('participants', function ($participantQuery) use ($user) {
                $participantQuery->where('user_id', $user->id)
                                 ->whereIn('status', ['invited', 'active']);
            });

            // Sessions created by counselors (in addition to the above)
            if ($user->role === 'counselor') {
                $mainQuery->orWhere('creator_id', $user->id);
            }
        });

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

                // Check if user was invited to private sessions (for clients)
                $isInvited = false;
                if ($session->is_private && $user->role !== 'counselor') {
                    // Check if user has any relationship with this private session
                    $isInvited = $session->participants()->where('user_id', $user->id)->exists();
                }

                return [
                    'id' => $session->id,
                    'title' => $session->title,
                    'description' => $session->description,
                    'mode' => $session->mode,
                    'max_participants' => $session->max_participants,
                    'is_active' => $session->is_active,
                    'is_private' => $session->is_private ?? false,
                    'creator' => $session->creator ? [
                        'id' => $session->creator->id,
                        'name' => $session->creator->name,
                    ] : null,
                    'participant_count' => $session->participants->count(),
                    'is_creator' => $isCreator,
                    'is_participant' => $isParticipant,
                    'user_join_status' => $userJoinStatus,
                    'is_invited' => $isInvited,
                    'created_at' => $session->created_at,
                ];
            });

        return Inertia::render('group-chats/index', [
            'sessions' => $sessions,
            'canCreate' => $user->role === 'counselor' && $user->role !== 'client',
            'userRole' => $user->role,
        ]);
    }

    public function create(Request $request)
    {
        $user = $request->user();

        // Only counselors can create group chat sessions
        if ($user->role !== 'counselor') {
            abort(403, 'Only counselors can create group chat sessions');
        }

        // Only verified counselors can create group chat sessions
        if (!$user->verified) {
            abort(403, 'You must be verified to create group chat sessions');
        }

        return Inertia::render('group-chats/create');
    }

    public function store(Request $request)
    {
        $user = $request->user();

        // Only counselors can create group chat sessions
        if ($user->role !== 'counselor') {
            abort(403, 'Only counselors can create group chat sessions');
        }

        // Only verified counselors can create group chat sessions
        if (!$user->verified) {
            abort(403, 'You must be verified to create group chat sessions');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'mode' => 'required|in:audio,message',
            'max_participants' => 'nullable|integer|min:2|max:50',
            'is_private' => 'boolean',
            'invited_users' => 'nullable|array',
            'invited_users.*' => 'integer|exists:users,id',
        ]);

        DB::transaction(function () use ($validated, $user) {
            $session = GroupChatSession::create([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'creator_id' => $user->id,
                'mode' => $validated['mode'],
                'max_participants' => $validated['max_participants'] ?? 10,
                'is_active' => true,
                'is_private' => $validated['is_private'] ?? false,
            ]);

            // Add creator as participant with 'creator' role
            $session->participants()->attach($user->id, [
                'role' => 'creator',
                'status' => 'active',
                'joined_at' => now(),
            ]);

            // Add invited users if this is a private session
            if ($validated['is_private'] && isset($validated['invited_users'])) {
                foreach ($validated['invited_users'] as $invitedUserId) {
                    if ($invitedUserId != $user->id) { // Don't add creator twice
                        $session->participants()->attach($invitedUserId, [
                            'role' => 'participant',
                            'status' => 'invited', // Invited users have invited status until they join
                            'joined_at' => now(),
                        ]);
                    }
                }
            }
        });

        return redirect()->route('group-chats.index')->with('success', 'Group chat session created successfully!');
    }

    public function show(Request $request, $sessionId)
    {
        $user = $request->user();

        $session = GroupChatSession::with(['creator', 'participants'])
            ->where('id', $sessionId)
            ->where(function ($query) use ($user) {
                // All users can view active public sessions
                $query->where('is_active', true)
                      ->where('is_private', false);

                // Users can view private sessions they were invited to or actively participate in
                $query->orWhereHas('participants', function ($participantQuery) use ($user) {
                    $participantQuery->where('user_id', $user->id)
                                     ->whereIn('status', ['invited', 'active']);
                });

                // Counselors can also view any session they created
                if ($user->role === 'counselor') {
                    $query->orWhere('creator_id', $user->id);
                }
            })
            ->first();

        if (!$session) {
            abort(404, 'Group chat session not found');
        }

        $isCreator = $session->creator_id === $user->id;
        $isParticipant = $session->participants->contains('id', $user->id);

        // Check if user was invited to private sessions (for clients)
        $isInvited = false;
        if ($session->is_private && $user->role !== 'counselor') {
            $participantRecord = $session->participants()->where('user_id', $user->id)->first();
            $isInvited = $participantRecord && $participantRecord->pivot->status === 'invited';
        }

        return Inertia::render('group-chats/show', [
            'session' => [
                'id' => $session->id,
                'title' => $session->title,
                'description' => $session->description,
                'mode' => $session->mode,
                'max_participants' => $session->max_participants,
                'is_active' => $session->is_active,
                'is_private' => $session->is_private ?? false,
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
                'is_invited' => $isInvited,
                'created_at' => $session->created_at,
            ],
        ]);
    }

    public function join(Request $request, $sessionId)
    {
        $user = $request->user();

        $session = GroupChatSession::findOrFail($sessionId);

        // Check if session is active
        if (!$session->is_active) {
            return back()->withErrors(['session' => 'This session is no longer active']);
        }

        // Check if user is already a participant
        $existingParticipant = $session->participants()->where('user_id', $user->id)->first();
        if ($existingParticipant) {
            if ($existingParticipant->pivot->status === 'removed') {
                // User was removed, they need to request to join again
                return back()->withErrors(['session' => 'You have been removed from this session. Please request to join again.']);
            } elseif ($existingParticipant->pivot->status === 'pending') {
                return back()->withErrors(['session' => 'Your join request is pending approval from the session creator.']);
            } elseif ($existingParticipant->pivot->status === 'active') {
                // User is already active, redirect to show page
                return redirect()->route('group-chats.show', $sessionId)->with('info', 'You are already a participant in this session.');
            } elseif ($existingParticipant->pivot->status === 'invited') {
                // User was invited, allow them to join and change status to active
                $session->participants()->updateExistingPivot($user->id, [
                    'status' => 'active',
                    'joined_at' => now(),
                ]);

                // Broadcast participant joined event for WebRTC signaling
                broadcast(new GroupChatParticipantJoined($user->id, $sessionId))->toOthers();

                return redirect()->route('group-chats.show', $sessionId)->with('success', 'Successfully joined the group chat session!');
            }
        }

        // Check max participants
        if ($session->participants()->where('status', 'active')->count() >= $session->max_participants) {
            return back()->withErrors(['session' => 'This session has reached maximum participants']);
        }

        // User is not in participants table yet - this can happen for public sessions
        // Add them as a new participant
        $session->participants()->attach($user->id, [
            'role' => $user->role === 'counselor' ? 'counselor' : 'participant',
            'status' => 'active',
            'joined_at' => now(),
        ]);

        // Broadcast participant joined event for WebRTC signaling
        broadcast(new GroupChatParticipantJoined($user->id, $sessionId))->toOthers();

        return redirect()->route('group-chats.show', $sessionId)->with('success', 'Successfully joined the group chat session!');
    }

    public function leave(Request $request, $sessionId)
    {
        $user = $request->user();

        $session = GroupChatSession::findOrFail($sessionId);

        // Check if user is a participant
        $participant = $session->participants()->where('user_id', $user->id)->first();
        if (!$participant) {
            return back()->withErrors(['session' => 'You are not a participant in this session']);
        }

        // Creator cannot leave their own session - they can only delete it
        if ($session->creator_id === $user->id) {
            return back()->withErrors(['session' => 'Session creator cannot leave their own session. Use Delete instead.']);
        }

        $session->participants()->detach($user->id);

        // Broadcast participant left event for WebRTC signaling
        broadcast(new GroupChatParticipantLeft($user->id, $sessionId))->toOthers();

        return redirect()->route('group-chats.index')->with('success', 'Successfully left the group chat session!');
    }

    public function removeParticipant(Request $request, $sessionId, $userId)
    {
        $user = $request->user();

        $session = GroupChatSession::where('id', $sessionId)
            ->where('creator_id', $user->id)
            ->first();

        if (!$session) {
            abort(404, 'Group chat session not found or you are not the creator');
        }

        // Cannot remove the creator
        if ($userId == $session->creator_id) {
            return back()->withErrors(['participant' => 'Cannot remove the session creator']);
        }

        // Check if the user to be removed is actually a participant
        $participant = $session->participants()->where('user_id', $userId)->first();
        if (!$participant) {
            return back()->withErrors(['participant' => 'User is not a participant in this session']);
        }

        // Update participant status to 'removed'
        $session->participants()->updateExistingPivot($userId, [
            'status' => 'removed'
        ]);

        // Broadcast participant left event for WebRTC signaling
        broadcast(new GroupChatParticipantLeft($userId, $sessionId))->toOthers();

        return redirect()->route('group-chats.show', $sessionId)->with('success', 'Participant has been removed from the session');
    }


    public function end(Request $request, $sessionId)
    {
        $user = $request->user();

        $session = GroupChatSession::where('id', $sessionId)
            ->where('creator_id', $user->id)
            ->where('is_active', true)
            ->first();

        if (!$session) {
            abort(404, 'Active group chat session not found or you are not the creator');
        }

        // End the session by setting is_active to false
        $session->update(['is_active' => false]);

        // Broadcast session ended event
        broadcast(new GroupChatParticipantLeft($user->id, $sessionId, true))->toOthers();

        return redirect()->route('group-chats.show', $sessionId)->with('success', 'Group chat session ended successfully!');
    }

    public function start(Request $request, $sessionId)
    {
        $user = $request->user();

        $session = GroupChatSession::where('id', $sessionId)
            ->where('creator_id', $user->id)
            ->where('is_active', false)
            ->first();

        if (!$session) {
            abort(404, 'Inactive group chat session not found or you are not the creator');
        }

        // Start the session by setting is_active to true
        $session->update(['is_active' => true]);

        return redirect()->route('group-chats.show', $sessionId)->with('success', 'Group chat session started successfully!');
    }

    public function destroy(Request $request, $sessionId)
    {
        $user = $request->user();

        $session = GroupChatSession::where('id', $sessionId)
            ->where('creator_id', $user->id)
            ->first();

        if (!$session) {
            abort(404, 'Group chat session not found or you are not the creator');
        }

        // Delete all participants first (cascade will handle this, but let's be explicit)
        $session->participants()->detach();

        // Delete the session
        $session->delete();

        return redirect()->route('group-chats.index')->with('success', 'Group chat session deleted successfully!');
    }

    public function reenter(Request $request, $sessionId)
    {
        $user = $request->user();

        $session = GroupChatSession::findOrFail($sessionId);

        // Check if session is active
        if (!$session->is_active) {
            return back()->withErrors(['session' => 'This session is no longer active']);
        }

        // Check if user is already a participant
        if ($session->participants()->where('user_id', $user->id)->exists()) {
            return redirect()->route('group-chats.show', $sessionId)->with('info', 'You are already a participant in this session');
        }

        // Check max participants
        if ($session->participants()->count() >= $session->max_participants) {
            return back()->withErrors(['session' => 'This session has reached maximum participants']);
        }

        $session->participants()->attach($user->id, [
            'role' => $session->creator_id === $user->id ? 'creator' : 'participant',
            'status' => 'active',
            'joined_at' => now(),
        ]);

        // Broadcast participant joined event for WebRTC signaling
        broadcast(new GroupChatParticipantJoined($user->id, $sessionId))->toOthers();

        return redirect()->route('group-chats.show', $sessionId)->with('success', 'Successfully re-entered the group chat session!');
    }

    public function update(Request $request, $sessionId)
    {
        $user = $request->user();

        $session = GroupChatSession::where('id', $sessionId)
            ->where('creator_id', $user->id)
            ->first();

        if (!$session) {
            abort(404, 'Group chat session not found');
        }

        // Only allow updates if session is active
        if (!$session->is_active) {
            return back()->withErrors(['session' => 'Cannot update inactive sessions']);
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

        return redirect()->route('group-chats.show', $sessionId)->with('success', 'Group chat session updated successfully!');
    }

    public function sendMessage(Request $request, $sessionId)
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
            abort(404, 'Group chat session not found or inactive');
        }

        $validated = $request->validate([
            'message' => 'required|string',
            'type' => 'required|in:text,audio',
        ]);

        $message = GroupChatMessage::create([
            'group_chat_session_id' => $sessionId,
            'user_id' => $user->id,
            'message' => $validated['message'],
            'type' => $validated['type'],
        ]);

        // Broadcast the message
        broadcast(new GroupChatMessageSent($message))->toOthers();

        return response()->json([
            'message' => $message->load('user:id,name,email'),
            'success' => true,
        ]);
    }

    public function chat(Request $request, $sessionId)
    {
        $user = $request->user();

        $session = GroupChatSession::with(['creator', 'participants' => function ($query) {
            $query->where('status', 'active');
        }])
            ->where('id', $sessionId)
            ->where(function ($query) use ($user) {
                $query->where('creator_id', $user->id)
                      ->orWhereHas('participants', function ($subQuery) use ($user) {
                          $subQuery->where('user_id', $user->id)
                                   ->whereIn('status', ['active', 'invited']);
                      });
            })
            ->first();

        if (!$session) {
            abort(404, 'Group chat session not found');
        }

        $messages = GroupChatMessage::with('user:id,name,email')
            ->where('group_chat_session_id', $sessionId)
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('group-chats/chat', [
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
                        'status' => $participant->pivot->status,
                        'joined_at' => $participant->pivot->joined_at,
                    ];
                }),
                'participant_count' => $session->participants->count(),
                'is_creator' => $session->creator_id === $user->id,
                'is_participant' => $session->participants->contains('id', $user->id),
                'created_at' => $session->created_at,
            ],
            'messages' => $messages,
        ]);
    }

    public function getMessages(Request $request, $sessionId)
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
            abort(404, 'Group chat session not found');
        }

        $messages = GroupChatMessage::with('user:id,name,email')
            ->where('group_chat_session_id', $sessionId)
            ->orderBy('created_at', 'asc')
            ->paginate(50);

        return response()->json($messages);
    }

    public function handleWebRTCSignaling(Request $request, $sessionId)
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
            abort(404, 'Group chat session not found');
        }

        $validated = $request->validate([
            'type' => 'required|in:offer,answer,ice-candidate,join,leave,mute,unmute',
            'from' => 'required|integer',
            'to' => 'nullable|integer',
            'data' => 'nullable',
        ]);

        $message = [
            'type' => $validated['type'],
            'from' => $validated['from'],
            'to' => $validated['to'] ?? null,
            'data' => $validated['data'] ?? null,
            'sessionId' => $sessionId,
        ];

        // Broadcast the WebRTC signaling message
        broadcast(new WebRTCSignaling($message))->toOthers();

        return response()->json(['success' => true]);
    }
}