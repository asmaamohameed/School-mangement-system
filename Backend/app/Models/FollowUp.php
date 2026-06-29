<?php

namespace App\Models;

use App\Enums\FollowUpStatus;
use App\Enums\FollowUpType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FollowUp extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'done_by',
        'follow_up_date',
        'type',
        'status',
        'summary',
        'next_action',
    ];

    protected $casts = [
        'type' => FollowUpType::class,
        'status' => FollowUpStatus::class,
        'follow_up_date' => 'datetime',
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
