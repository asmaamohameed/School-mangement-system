<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\School;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<School>
 */
class SchoolFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $salesRep = User::where('role', UserRole::SALES_REP)->inRandomOrder()->first();
        $assignedTo = $salesRep ?? User::where('role', UserRole::ADMIN)->inRandomOrder()->first();

        return [
            'created_by' => $salesRep->id ?? null,
            'assigned_to' => $assignedTo->id ?? null,
            'name' => $this->faker->company.' School',
            'school_type' => $this->faker->randomElement(['public', 'private', 'international']),
            'stage' => $this->faker->randomElement(['lead', 'qualified', 'interested', 'follow_up']),
            'city' => $this->faker->randomElement(['Cairo', 'Giza', 'Alexandria']),
            'address' => $this->faker->address,
            'principal_name' => $this->faker->name,
            'principal_mobile' => $this->faker->phoneNumber,
        ];
    }
}
