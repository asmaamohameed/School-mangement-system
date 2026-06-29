<?php

namespace Database\Factories;

use App\Enums\FollowUpStatus;
use App\Enums\FollowUpType;
use App\Models\FollowUp;
use App\Models\School;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FollowUp>
 */
class FollowUpFactory extends Factory
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
            'done_by' => User::factory(),
            'follow_up_date' => $this->faker->dateTimeBetween('-1 month', '+1 month')->format('Y-m-d'),
            'type' => $this->faker->randomElement(FollowUpType::class),
            'summary' => $this->faker->paragraph(2),
            'next_action' => $this->faker->optional(0.7)->sentence(),
            'status' => FollowUpStatus::PENDING,
        ];
    }
}
