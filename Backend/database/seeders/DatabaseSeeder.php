<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\School;
use App\Models\Contact;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // $this->call([
        //     UserSeeder::class,
        // ]);

        //Create 10 schools and each school has 2 contacts.
    School::factory(10)->create()->each(function ($school) {
            Contact::factory()->count(2)->create([
                'school_id' => $school->id
            ]);
        });
    }
}
