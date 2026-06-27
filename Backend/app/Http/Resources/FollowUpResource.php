<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FollowUpResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'school' => [
                'id' => $this->school_id,
                'name' => $this->school?->name,
            ],
            'user' => [
                'id' => $this->user_id,
                'name' => $this->user?->name,
            ],
            'follow_up_date' => $this->follow_up_date ? \Carbon\Carbon::parse($this->follow_up_date)->format('Y-m-d H:i') : null,
            'follow_up_type' => $this->follow_up_type,
            'summary' => $this->summary,
            'next_action' => $this->next_action,
            'created_at' => $this->created_at?->format('Y-m-d H:i'),
        ];
    }
}
