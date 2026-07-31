<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'user@dev.com'],
            [
                'name' => 'Regular User',
                'role' => UserRole::USER,
                'email_verified_at' => now(),
                'password' => Hash::make('user@dev.com'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'manager@dev.com'],
            [
                'name' => 'Manager User',
                'role' => UserRole::ADMIN,
                'email_verified_at' => now(),
                'password' => Hash::make('manager@dev.com'),
            ]
        );

        if (User::count() < 50) {
            User::factory(50)->create();
        }
    }
}
