<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\School;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // $this->call([
        //     UserSeeder::class,
        // ]);

        // Create 10 schools and each school has 2 contacts.
        School::factory(10)->create()->each(function ($school) {
            Contact::factory()->count(2)->create([
                'school_id' => $school->id,
            ]);
        });
    }
}
