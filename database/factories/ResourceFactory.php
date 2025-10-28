<?php

namespace Database\Factories;

use App\Models\Resource;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResourceFactory extends Factory
{
    protected $model = Resource::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(),
            'file_path' => 'resources/' . $this->faker->uuid() . '.pdf',
            'type' => $this->faker->randomElement(['article', 'video', 'pdf', 'document']),
            'tags' => $this->faker->words(3),
            'uploaded_by' => User::factory(),
        ];
    }
}