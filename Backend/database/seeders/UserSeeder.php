<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
public function run(): void
    {
        // 1. Admin Account
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@inspire.com',
            'password' => Hash::make('password123'),
            'role' => UserRole::ADMIN,
            'is_active' => true,
        ]);

        // 2. Sales Rep Account
        User::create([
            'name' => 'Ahmed Sales',
            'email' => 'sales@inspire.com',
            'password' => Hash::make('password123'),
            'role' => UserRole::SALES_REP,
            'is_active' => true,
        ]);

        // 3. Customer Service Account
        User::create([
            'name' => 'Sara CS',
            'email' => 'cs@inspire.com',
            'password' => Hash::make('password123'),
            'role' => UserRole::CUSTOMER_SERVICE,
            'is_active' => true,
        ]);
        
    }
}
