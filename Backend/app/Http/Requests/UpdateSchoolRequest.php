<?php

namespace App\Http\Requests;

use App\Enums\SchoolStage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSchoolRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:255'],
            'school_type' => ['sometimes', 'string'],
            'city' => ['sometimes', 'string'],
            'address' => ['sometimes', 'string'],
            'principal_name' => ['sometimes', 'string', 'max:255'],
            'principal_mobile' => ['sometimes', 'string'],

            'stage' => ['sometimes', Rule::enum(SchoolStage::class)],

        ];
    }
}
