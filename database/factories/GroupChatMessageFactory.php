<?php

namespace Database\Factories;

use App\Models\GroupChatMessage;
use App\Models\GroupChatSession;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GroupChatMessage>
 */
class GroupChatMessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'group_chat_session_id' => GroupChatSession::factory(),
            'user_id' => User::factory(),
            'message' => fake()->sentence(),
            'type' => 'text',
        ];
    }

    /**
     * Indicate that the message is an audio message.
     */
    public function audio(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'audio',
            'message' => 'audio.webm', // Mock audio file path
        ]);
    }
}