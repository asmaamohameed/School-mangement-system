<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $fillable = [
        'school_id',
        'name',
        'position',
        'mobile',
        'email',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function visits(): HasMany
{
    return $this->hasMany(Visit::class);
}
}
