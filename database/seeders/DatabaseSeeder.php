<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\CounselingSession;
use App\Models\Chat;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Faker\Factory as FakerFactory;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
        ]);

        $faker = FakerFactory::create();

        // Get users created by UserSeeder
        $counselors = User::where('role', 'counselor')->get();
        $clients = User::where('role', 'client')->get();

        // Create resources
        $resources = [
            [
                'title' => 'Understanding Anxiety: A Guide',
                'description' => 'A comprehensive guide to understanding and managing anxiety disorders.',
                'file_path' => 'resources/anxiety-guide.pdf',
                'type' => 'pdf',
                'tags' => ['anxiety', 'mental-health', 'guide'],
            ],
            [
                'title' => 'Stress Management Techniques',
                'description' => 'Learn effective techniques to manage and reduce stress in daily life.',
                'file_path' => 'resources/stress-management.pdf',
                'type' => 'pdf',
                'tags' => ['stress', 'coping', 'techniques'],
            ],
            [
                'title' => 'Building Healthy Relationships',
                'description' => 'Tips and strategies for building and maintaining healthy relationships.',
                'file_path' => 'resources/relationships.mp4',
                'type' => 'video',
                'tags' => ['relationships', 'communication', 'health'],
            ],
            [
                'title' => 'Depression: Signs and Support',
                'description' => 'Recognizing signs of depression and finding appropriate support.',
                'file_path' => 'resources/depression-signs.pdf',
                'type' => 'pdf',
                'tags' => ['depression', 'mental-health', 'support'],
            ],
            [
                'title' => 'Mindfulness Meditation Guide',
                'description' => 'A beginner\'s guide to mindfulness meditation practices.',
                'file_path' => 'resources/mindfulness.mp4',
                'type' => 'video',
                'tags' => ['mindfulness', 'meditation', 'wellness'],
            ],
            [
                'title' => 'Coping with Grief',
                'description' => 'Understanding the grieving process and healthy coping strategies.',
                'file_path' => 'resources/grief-coping.pdf',
                'type' => 'pdf',
                'tags' => ['grief', 'loss', 'coping'],
            ],
            [
                'title' => 'Sleep Hygiene Tips',
                'description' => 'Improve your sleep quality with these evidence-based tips.',
                'file_path' => 'resources/sleep-hygiene.pdf',
                'type' => 'pdf',
                'tags' => ['sleep', 'health', 'hygiene'],
            ],
            [
                'title' => 'Self-Esteem Building Exercises',
                'description' => 'Interactive exercises to build and maintain healthy self-esteem.',
                'file_path' => 'resources/self-esteem.mp4',
                'type' => 'video',
                'tags' => ['self-esteem', 'confidence', 'exercises'],
            ],
        ];

        foreach ($resources as $resourceData) {
            \App\Models\Resource::create(array_merge($resourceData, [
                'uploaded_by' => $counselors->random()->id,
            ]));
        }

        // Create subscription plans
        $subscriptionPlans = [
            [
                'name' => 'Basic',
                'description' => 'Essential counseling support for individuals seeking basic mental health guidance.',
                'price' => 29.99,
                'billing_cycle' => 'monthly',
                'session_limit' => 4,
                'features' => [
                    '4 counseling sessions per month',
                    'Email support',
                    'Access to basic resources',
                    'Progress tracking',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Classic',
                'description' => 'Comprehensive counseling package with unlimited sessions and priority support.',
                'price' => 59.99,
                'billing_cycle' => 'monthly',
                'session_limit' => 8,
                'features' => [
                    '8 counseling sessions per month',
                    'Priority email support',
                    'Access to all resources',
                    'Detailed progress reports',
                    'Mood tracking tools',
                    '24/7 chat support',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Premium',
                'description' => 'Complete mental health support package with unlimited access and premium features.',
                'price' => 99.99,
                'billing_cycle' => 'monthly',
                'session_limit' => 0, // Unlimited (0 = unlimited based on migration)
                'features' => [
                    'Unlimited counseling sessions',
                    'Priority phone support',
                    'Access to premium resources',
                    'Advanced progress analytics',
                    'Personal counselor assignment',
                    'Emergency support hotline',
                    'Custom treatment plans',
                    'Family session credits',
                ],
                'is_active' => true,
            ],
        ];

        foreach ($subscriptionPlans as $planData) {
            \App\Models\SubscriptionPlan::create($planData);
        }

        // Create counseling sessions and chats between counselors and clients
        $sessions = [];

        // Create sessions for each counselor with multiple clients
        foreach ($counselors as $counselor) {
            $assignedClients = $clients->random(min(3, $clients->count())); // Each counselor gets 1-3 clients

            foreach ($assignedClients as $client) {
                $status = $faker->randomElement(['scheduled', 'completed', 'in_progress']);
                $scheduledAt = $status === 'scheduled' ? now()->addDays(rand(1, 7)) : now()->subDays(rand(1, 30));

                $session = CounselingSession::create([
                    'client_id' => $client->id,
                    'counselor_id' => $counselor->id,
                    'status' => $status,
                    'scheduled_at' => $scheduledAt,
                ]);

                $sessions[] = $session;

                // Create sample chat messages for some sessions
                if (rand(0, 1)) { // 50% chance of having chats
                    $chatCount = rand(2, 6);
                    $chats = [];

                    for ($i = 0; $i < $chatCount; $i++) {
                        $isClientMessage = $i % 2 === 0;
                        $sender = $isClientMessage ? $client : $counselor;
                        $message = $isClientMessage ?
                            $faker->randomElement([
                                'I\'m feeling really stressed about work lately.',
                                'I\'ve been having trouble sleeping.',
                                'I feel overwhelmed with everything going on.',
                                'I need help dealing with my anxiety.',
                                'I\'m struggling with relationships.',
                                'I feel depressed and don\'t know what to do.',
                            ]) :
                            $faker->randomElement([
                                'I understand that can be very challenging. Let\'s work through this together.',
                                'Thank you for sharing that with me. How long have you been feeling this way?',
                                'That sounds difficult. What coping strategies have you tried?',
                                'I\'m here to support you. Would you like to explore some options?',
                                'It\'s normal to feel this way. Let\'s develop a plan to help you.',
                                'You\'re not alone in this. Many people experience similar challenges.',
                            ]);

                        $chats[] = [
                            'session_id' => $session->id,
                            'sender_id' => $sender->id,
                            'message' => $message,
                            'sent_at' => now()->subHours(rand(1, 48)),
                            'is_read' => $faker->boolean(80), // 80% chance of being read
                        ];
                    }

                    foreach ($chats as $chat) {
                        Chat::create($chat);
                    }
                }
            }
        }
    }
}
