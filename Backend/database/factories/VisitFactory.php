<?php

namespace Database\Factories;

use App\Enums\VisitInterestLevel;
use App\Models\Contact;
use App\Models\School;
use App\Models\User;
use App\Models\Visit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Visit>
 */
class VisitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'school_id' => School::factory(),
            'contact_id' => Contact::factory(),
            'rep_id' => User::factory(),
            'visit_date' => $this->faker->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
            'notes' => $this->faker->paragraph(),
            'interest_level' => $this->faker->randomElement(VisitInterestLevel::cases())->value,
            'lat' => $this->faker->latitude(22, 31),
            'lng' => $this->faker->longitude(25, 34),
        ];
    }
}
