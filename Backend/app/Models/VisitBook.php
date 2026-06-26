<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisitBook extends Model
{
    protected $fillable = [
        'visit_id',
        'book_title',
        'grade_level',
    ];

    public function visit(): BelongsTo
    {
        return $this->belongsTo(Visit::class);
    }
}
