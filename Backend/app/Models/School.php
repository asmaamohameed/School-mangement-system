<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class School extends Model
{
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
