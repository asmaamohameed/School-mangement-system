<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SchoolResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'stage' => $this->stage,
            'school_type' => $this->school_type,
            'city' => $this->city,
            'address' => $this->address,
            'principal_name' => $this->principal_name,
            'principal_mobile' => $this->principal_mobile,
            'assigned_rep' => [
                'id' => $this->assignedRep?->id,
                'name' => $this->assignedRep?->name, 
            ],
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
