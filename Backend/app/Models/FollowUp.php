<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FollowUp extends Model
{
    protected $fillable = [
        'school_id',
        'done_by',
        'follow_up_date',
        'type',
        'summary',
        'next_action',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'done_by');
    }
}
