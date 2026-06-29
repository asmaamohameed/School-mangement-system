<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin Account
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@inspire.com',
            'password' => Hash::make('password123'),
            'role' => UserRole::ADMIN,
            'is_active' => true,
        ]);

        // 2. Sales Rep Account
        $salesRep = User::create([
            'name' => 'Ahmed Sales',
            'email' => 'sales@inspire.com',
            'password' => Hash::make('password123'),
            'role' => UserRole::SALES_REP,
            'is_active' => true,
        ]);

        // 3. Customer Service Account
        $customerService = User::create([
            'name' => 'Sara CS',
            'email' => 'cs@inspire.com',
            'password' => Hash::make('password123'),
            'role' => UserRole::CUSTOMER_SERVICE,
            'is_active' => true,
        ]);

    }
}
