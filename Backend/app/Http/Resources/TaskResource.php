<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
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
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'due_date' => $this->due_date,
            'created_at' => $this->created_at?->toDateTimeString(),

            'school' => new SchoolResource($this->whenLoaded('school')),
            'assigned_to' => $this->whenLoaded('assigned_to', function () {
                return [
                    'id' => $this->assigned_to?->id,
                    'name' => $this->assigned_to?->name,
                ];
            }),
            'created_by' => $this->whenLoaded('created_by', function () {
                return [
                    'id' => $this->createdBy?->id,
                    'name' => $this->createdBy?->name,
                ];
            }),
        ];
    }
}
