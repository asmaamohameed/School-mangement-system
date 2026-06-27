<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VisitResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'visit_date' => $this->visit_date?->format('Y-m-d'),
            'interest_level' => $this->interest_level,
            'notes' => $this->notes,
            'lat' => $this->lat,
            'lng' => $this->lng,
            'school' => [
                'id' => $this->school_id,
                'name' => $this->school?->name,
            ],
            'contact_person' => [
                'id' => $this->contact_id,
                'name' => $this->contact?->name,
                'position' => $this->contact?->position,
            ],
            'assignedRep' => [
                'id' => $this->rep_id,
                'name' => $this->assignedRep?->name,
            ],
            'books_presented' => VisitBookResource::collection($this->whenLoaded('books')),
            'created_at' => $this->created_at?->format('Y-m-d H:i'),
        ];
    }
}
