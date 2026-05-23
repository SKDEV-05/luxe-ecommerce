<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed Admin User
        User::factory()->create([
            'name' => 'Luxe Admin',
            'email' => 'saadadmin@gmail.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
        ]);

        // Seed Customer User
        User::factory()->create([
            'name' => 'Luxe Customer',
            'email' => 'saadkorma@gmail.com',
            'password' => Hash::make('password'),
            'is_admin' => false,
        ]);

        // Run E-commerce Seeders
        $this->call([
            CategorySeeder::class,
            BrandSeeder::class,
            ProductSeeder::class,
        ]);
    }
}

