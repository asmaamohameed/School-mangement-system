<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Visit extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'school_id',
        'contact_id',
        'rep_id',
        'visit_date',
        'notes',
        'interest_level',
        'lat',
        'lng',
    ];

    protected $casts = [
        'visit_date' => 'date',
        'lat' => 'decimal:8',
        'lng' => 'decimal:8',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function rep(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rep_id');
    }

    public function books(): HasMany
{
    return $this->hasMany(VisitBook::class);
}
}
