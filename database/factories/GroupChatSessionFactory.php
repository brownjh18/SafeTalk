<?php

namespace Database\Factories;

use App\Models\GroupChatSession;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GroupChatSession>
 */
class GroupChatSessionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'creator_id' => User::factory()->state(['role' => 'counselor']),
            'mode' => fake()->randomElement(['message', 'audio']),
            'max_participants' => fake()->numberBetween(2, 10),
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the session is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the session is for audio calls.
     */
    public function audio(): static
    {
        return $this->state(fn (array $attributes) => [
            'mode' => 'audio',
        ]);
    }

    /**
     * Indicate that the session is for messaging.
     */
    public function message(): static
    {
        return $this->state(fn (array $attributes) => [
            'mode' => 'message',
        ]);
    }
}