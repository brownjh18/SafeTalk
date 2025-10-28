<?php

namespace Tests\Feature;

use App\Models\GroupChatSession;
use App\Models\GroupChatMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GroupChatTest extends TestCase
{
    use RefreshDatabase;

    protected $counselor;
    protected $client1;
    protected $client2;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test users
        $this->counselor = User::factory()->create([
            'name' => 'Test Counselor',
            'email' => 'counselor@test.com',
            'role' => 'counselor'
        ]);

        $this->client1 = User::factory()->create([
            'name' => 'Test Client 1',
            'email' => 'client1@test.com',
            'role' => 'client'
        ]);

        $this->client2 = User::factory()->create([
            'name' => 'Test Client 2',
            'email' => 'client2@test.com',
            'role' => 'client'
        ]);
    }

    public function test_counselor_can_create_group_chat_session()
    {
        $response = $this->actingAs($this->counselor)
            ->post('/group-chats', [
                'title' => 'Test Group Chat',
                'description' => 'A test group chat session',
                'mode' => 'message',
                'max_participants' => 5
            ]);

        $response->assertRedirect('/group-chats');
        $this->assertDatabaseHas('group_chat_sessions', [
            'title' => 'Test Group Chat',
            'description' => 'A test group chat session',
            'mode' => 'message',
            'max_participants' => 5,
            'creator_id' => $this->counselor->id
        ]);

        $session = GroupChatSession::where('title', 'Test Group Chat')->first();
        $this->assertDatabaseHas('group_chat_participants', [
            'group_chat_session_id' => $session->id,
            'user_id' => $this->counselor->id,
            'role' => 'creator'
        ]);
    }

    public function test_client_cannot_create_group_chat_session()
    {
        $response = $this->actingAs($this->client1)
            ->post('/group-chats', [
                'title' => 'Test Group Chat',
                'description' => 'A test group chat session',
                'mode' => 'message',
                'max_participants' => 5
            ]);

        $response->assertForbidden();
    }

    public function test_user_can_join_group_chat_session()
    {
        $session = GroupChatSession::factory()->create([
            'creator_id' => $this->counselor->id,
            'max_participants' => 5,
            'is_active' => true
        ]);

        $response = $this->actingAs($this->client1)
            ->post("/group-chats/{$session->id}/join");

        $response->assertRedirect("/group-chats/{$session->id}");
        $this->assertDatabaseHas('group_chat_participants', [
            'group_chat_session_id' => $session->id,
            'user_id' => $this->client1->id,
            'role' => 'participant'
        ]);
    }

    public function test_user_cannot_join_full_session()
    {
        $session = GroupChatSession::factory()->create([
            'creator_id' => $this->counselor->id,
            'max_participants' => 1,
            'is_active' => true
        ]);

        // Join with counselor first
        $session->participants()->attach($this->counselor->id, ['role' => 'creator', 'joined_at' => now()]);

        $response = $this->actingAs($this->client1)
            ->post("/group-chats/{$session->id}/join");

        $response->assertRedirect();
        $response->assertSessionHasErrors('session');
    }

    public function test_participant_can_send_message()
    {
        $session = GroupChatSession::factory()->create([
            'creator_id' => $this->counselor->id,
            'is_active' => true
        ]);

        $session->participants()->attach($this->client1->id, ['role' => 'participant', 'joined_at' => now()]);

        $response = $this->actingAs($this->client1)
            ->post("/group-chats/{$session->id}/messages", [
                'message' => 'Hello everyone!',
                'type' => 'text'
            ]);

        $response->assertJson(['success' => true]);
        $this->assertDatabaseHas('group_chat_messages', [
            'group_chat_session_id' => $session->id,
            'user_id' => $this->client1->id,
            'message' => 'Hello everyone!',
            'type' => 'text'
        ]);
    }

    public function test_non_participant_cannot_send_message()
    {
        $session = GroupChatSession::factory()->create([
            'creator_id' => $this->counselor->id,
            'is_active' => true
        ]);

        $response = $this->actingAs($this->client1)
            ->post("/group-chats/{$session->id}/messages", [
                'message' => 'Hello everyone!',
                'type' => 'text'
            ]);

        $response->assertNotFound();
    }

    public function test_user_can_view_group_chat_sessions()
    {
        $session1 = GroupChatSession::factory()->create(['creator_id' => $this->counselor->id]);
        $session2 = GroupChatSession::factory()->create(['creator_id' => $this->counselor->id]);

        $session1->participants()->attach($this->client1->id, ['role' => 'participant', 'joined_at' => now()]);

        $response = $this->actingAs($this->client1)->get('/group-chats');

        $response->assertInertia(fn ($page) => $page
            ->has('sessions.data', 1)
            ->where('sessions.data.0.id', $session1->id)
        );
    }

    public function test_user_can_view_group_chat_session_details()
    {
        $session = GroupChatSession::factory()->create([
            'creator_id' => $this->counselor->id,
            'title' => 'Test Session'
        ]);

        $session->participants()->attach($this->client1->id, ['role' => 'participant', 'joined_at' => now()]);

        $response = $this->actingAs($this->client1)->get("/group-chats/{$session->id}");

        $response->assertInertia(fn ($page) => $page
            ->has('session')
            ->where('session.title', 'Test Session')
            ->where('session.is_participant', true)
        );
    }

    public function test_user_can_access_chat_interface()
    {
        $session = GroupChatSession::factory()->create([
            'creator_id' => $this->counselor->id,
            'is_active' => true
        ]);

        $session->participants()->attach($this->client1->id, ['role' => 'participant', 'joined_at' => now()]);

        $message = GroupChatMessage::factory()->create([
            'group_chat_session_id' => $session->id,
            'user_id' => $this->client1->id,
            'message' => 'Test message',
            'type' => 'text'
        ]);

        $response = $this->actingAs($this->client1)->get("/group-chats/{$session->id}/chat");

        $response->assertInertia(fn ($page) => $page
            ->has('session')
            ->has('messages', 1)
            ->where('messages.0.message', 'Test message')
        );
    }
}