<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Enums\SchoolStage;

class School extends Model
{
    use HasFactory;

    protected $fillable = [
    'assigned_rep_id',
    'name',
    'stage',
    'assigned_to',
    'school_type',
    'city',
    'address',
    'principal_name',
    'principal_mobile',
    ];

    protected $casts = [
        'stage' => SchoolStage::class,
    ];

    
public function assignedTo(): BelongsTo
{
    return $this->belongsTo(User::class, 'assigned_to');
}

public function assignedRep(): BelongsTo
{
    return $this->belongsTo(User::class, 'assigned_rep_id');
}

public function contacts(): HasMany
{
    return $this->hasMany(Contact::class);
}

public function visits(): HasMany
{
    return $this->hasMany(Visit::class);
}

public function tasks(): HasMany
{
    return $this->hasMany(Task::class);
}

public function followUps(): HasMany
{
    return $this->hasMany(FollowUp::class);
}

public function pipelineHistories(): HasMany
{
    return $this->hasMany(PipelineHistory::class);
}
}
