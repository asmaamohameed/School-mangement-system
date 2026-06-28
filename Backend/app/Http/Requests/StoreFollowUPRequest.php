<?php

namespace App\Http\Requests;

use App\Enums\FollowUpType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFollowUPRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
    {
        return [
            'school_id' => ['required', 'exists:schools,id'],
            'follow_up_date' => ['required', 'date'],
            'type' => ['required', Rule::enum(FollowUpType::class)],
            'summary' => ['required', 'string'],
            'next_action' => ['nullable', 'string'],
        ];
    }
}
