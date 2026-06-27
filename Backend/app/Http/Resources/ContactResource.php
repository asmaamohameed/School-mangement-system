<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
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
            'school_id' => $this->school_id,
            'school_name' => $this->school?->name,
            'name' => $this->name,
            'position' => $this->position,
            'mobile' => $this->mobile,
            'email' => $this->email,
            'created_at' => $this->created_at?->format('Y-m-d H:i'),
        ];
    }
}
