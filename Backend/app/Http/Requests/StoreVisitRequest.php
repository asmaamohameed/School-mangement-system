<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVisitRequest extends FormRequest
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
            'contact_id' => ['required', 'exists:contacts,id'],
            'visit_date' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
            'interest_level' => ['required', 'in:Cold,Warm,Interested,Highly Interested'],
            'lat' => ['nullable', 'numeric'],
            'lng' => ['nullable', 'numeric'],
            'books' => ['required', 'array', 'min:1'],
            'books.*.book_title' => ['required', 'string', 'max:255'],
            'books.*.grade_level' => ['required', 'string', 'max:50'],
        ];
    }
}
