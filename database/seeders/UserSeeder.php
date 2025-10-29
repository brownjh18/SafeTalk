<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create Counselor Users
        $counselors = [
            [
                'name' => 'Dr. Sarah Johnson',
                'email' => 'sarah.johnson@counselor.com',
                'password' => Hash::make('password'),
                'role' => 'counselor',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Dr. Michael Chen',
                'email' => 'michael.chen@counselor.com',
                'password' => Hash::make('password'),
                'role' => 'counselor',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Dr. Emily Rodriguez',
                'email' => 'emily.rodriguez@counselor.com',
                'password' => Hash::make('password'),
                'role' => 'counselor',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Dr. David Thompson',
                'email' => 'david.thompson@counselor.com',
                'password' => Hash::make('password'),
                'role' => 'counselor',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Dr. Lisa Park',
                'email' => 'lisa.park@counselor.com',
                'password' => Hash::make('password'),
                'role' => 'counselor',
                'email_verified_at' => now(),
            ],
        ];

        foreach ($counselors as $counselor) {
            User::create($counselor);
        }

        // Create Client Users
        $clients = [
            [
                'name' => 'John Anderson',
                'email' => 'john.anderson@client.com',
                'password' => Hash::make('password'),
                'role' => 'client',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Alice Thompson',
                'email' => 'alice.thompson@client.com',
                'password' => Hash::make('password'),
                'role' => 'client',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Robert Wilson',
                'email' => 'robert.wilson@client.com',
                'password' => Hash::make('password'),
                'role' => 'client',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Maria Garcia',
                'email' => 'maria.garcia@client.com',
                'password' => Hash::make('password'),
                'role' => 'client',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'James Brown',
                'email' => 'james.brown@client.com',
                'password' => Hash::make('password'),
                'role' => 'client',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Emma Davis',
                'email' => 'emma.davis@client.com',
                'password' => Hash::make('password'),
                'role' => 'client',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Daniel Miller',
                'email' => 'daniel.miller@client.com',
                'password' => Hash::make('password'),
                'role' => 'client',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Sophia Martinez',
                'email' => 'sophia.martinez@client.com',
                'password' => Hash::make('password'),
                'role' => 'client',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'William Taylor',
                'email' => 'william.taylor@client.com',
                'password' => Hash::make('password'),
                'role' => 'client',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Olivia Anderson',
                'email' => 'olivia.anderson@client.com',
                'password' => Hash::make('password'),
                'role' => 'client',
                'email_verified_at' => now(),
            ],
        ];

        foreach ($clients as $client) {
            User::create($client);
        }

        // Create a generic counselor user for testing
        User::create([
            'name' => 'Counselor User',
            'email' => 'counselor@example.com',
            'password' => Hash::make('password'),
            'role' => 'counselor',
            'email_verified_at' => now(),
        ]);

        // Create a generic client user for testing
        User::create([
            'name' => 'Jonah Client',
            'email' => 'jonah@example.com',
            'password' => Hash::make('password'),
            'role' => 'client',
            'email_verified_at' => now(),
        ]);
    }
}
