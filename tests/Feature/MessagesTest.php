<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Chat;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MessagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_start_conversation_and_send_message()
    {
        $alice = User::factory()->create(['role' => 'client']);
        $bob = User::factory()->create(['role' => 'counselor']);

        // Alice starts a conversation with Bob
        $response = $this->actingAs($alice)->post('/conversations/start', [
            'other_user_id' => $bob->id,
        ]);

        $response->assertRedirect();

        // There should be at least one chat record between them
        $this->assertDatabaseHas('chats', [
            'sender_id' => $alice->id,
            'receiver_id' => $bob->id,
        ]);

        // Now send a message via the store endpoint
        $response2 = $this->actingAs($alice)->post("/messages/{$bob->id}", [
            'message' => 'Hello Bob from Alice',
        ]);

        $response2->assertRedirect();

        $this->assertDatabaseHas('chats', [
            'sender_id' => $alice->id,
            'receiver_id' => $bob->id,
            'message' => 'Hello Bob from Alice',
        ]);
    }
}
