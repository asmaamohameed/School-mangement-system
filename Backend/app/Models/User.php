<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
        'role' => UserRole::class,
    ];

    public function assignedSchools():HasMany
    {
        return $this->hasMany(School::class, 'assigned_rep_id');
    }
    public function currentSchools():HasMany
    {
        return $this->hasMany(School::class, 'assigned_to');
    }

    public function visits():HasMany
    {
        return $this->hasMany(Visit::class, 'rep_id');
    }

    public function followUps():HasMany
    {
        return $this->hasMany(Followup::class, 'done_by');
    }

    public function assignedTasks():HasMany
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }
}
