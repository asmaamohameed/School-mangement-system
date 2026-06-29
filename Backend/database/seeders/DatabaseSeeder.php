<?php

namespace Database\Seeders;

use App\Enums\FollowUpStatus;
use App\Enums\UserRole;
use App\Models\Contact;
use App\Models\FollowUp;
use App\Models\School;
use App\Models\Task;
use App\Models\User;
use App\Models\Visit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            UserSeeder::class,
        ]);

        $admin = User::where('role', UserRole::ADMIN)->first();
        $salesRep = User::where('role', UserRole::SALES_REP)->first();
        $customerService = User::where('role', UserRole::CUSTOMER_SERVICE)->first();

        School::factory()->count(10)->create([
            'created_by' => $salesRep->id,
            'assigned_to' => $salesRep->id,
        ])->each(function ($school) use ($admin, $salesRep, $customerService) {

            $contact = Contact::factory()->create([
                'school_id' => $school->id,
            ]);

            Visit::factory()->count(2)->create([
                'school_id' => $school->id,
                'contact_id' => $contact->id,
                'rep_id' => $salesRep->id,
            ]);

            Task::factory()->count(2)->create([
                'school_id' => $school->id,
                'assigned_to' => $salesRep->id,
                'created_by' => $admin->id,
                'status' => collect(['pending', 'completed'])->random(),
            ]);

            FollowUp::factory()->count(2)->create([
                'school_id' => $school->id,
                'done_by' => $customerService->id,
                'status' => collect([FollowUpStatus::PENDING, FollowUpStatus::COMPLETED])->random(),
            ]);
        });
    }
}
