<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Chat;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReadReceiptsTest extends TestCase
{
    use RefreshDatabase;

    public function test_reading_messages_clears_unread_count()
    {
        // Create two users
        $alice = User::factory()->create(['role' => 'client']);
        $bob = User::factory()->create(['role' => 'counselor']);

        // Alice sends a message to Bob
        $this->actingAs($alice)->post('/conversations/start', [
            'other_user_id' => $bob->id,
        ]);

        // Find the chat that was created as the initial message (sender: alice)
        $chat = Chat::where('sender_id', $alice->id)->where('receiver_id', $bob->id)->first();
        $this->assertNotNull($chat);

        // Bob opens the conversation (simulate visiting show endpoint)
        $this->actingAs($bob)->get('/messages/' . $alice->id);

        // After Bob views, messages sent to Bob should be marked as read
        $this->assertDatabaseHas('chats', [
            'id' => $chat->id,
            'is_read' => true,
        ]);

        // And unread_count for this conversation should be zero (no unread messages for Bob)
        $unreadCount = Chat::where(function ($query) use ($bob, $alice) {
            $query->where('sender_id', $alice->id)->where('receiver_id', $bob->id);
        })->where('is_read', false)->count();

        $this->assertEquals(0, $unreadCount);
    }
}
