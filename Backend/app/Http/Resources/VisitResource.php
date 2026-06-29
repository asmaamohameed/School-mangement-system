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
            'school' => new SchoolResource($this->whenLoaded('school')),
            'contact_person' => new ContactResource($this->whenLoaded('contact')),
            'createdBy' => [
                'id' => $this->rep_id,
                'name' => $this->createdBy?->name,
            ],
            'books_presented' => VisitBookResource::collection($this->whenLoaded('books')),
            'created_at' => $this->created_at?->format('Y-m-d H:i'),
        ];
    }
}
