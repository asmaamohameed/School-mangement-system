<?php

namespace App\Providers;

use App\Models\Contact;
use App\Models\School;
use App\Policies\ContactPolicy;
use App\Policies\SchoolPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(School::class, SchoolPolicy::class);
        Gate::policy(Contact::class, ContactPolicy::class);

    }
}
