<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Contact;
use App\Http\Resources\ContactResource;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $query = Contact::with('school');

        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }

        return ContactResource::collection($query->latest()->paginate(15));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'school_id' => ['required', 'exists:schools,id'],
            'name' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'mobile' => ['required', 'string'],
            'email' => ['nullable', 'email', 'max:255'],
        ]);

        $contact = Contact::create($validated);

        return response()->json([
            'message' => 'contact created successfully',
            'data' => new ContactResource($contact)
        ], 201);
    }


    public function show(Contact $contact): ContactResource
    {
        return new ContactResource($contact->load('school'));
    }


    public function update(Request $request, Contact $contact): JsonResponse
    {
        $validated = $request->validate([
            'school_id' => ['sometimes', 'required', 'exists:schools,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'position' => ['sometimes', 'required', 'string', 'max:255'],
            'mobile' => ['sometimes', 'required', 'string'],
            'email' => ['nullable', 'email', 'max:255'],
        ]);

        $contact->update($validated);

        return response()->json([
            'message' => 'contact updated successfully',
            'data' => new ContactResource($contact->load('school'))
        ], 200);
    }
  
    public function destroy(Contact $contact): JsonResponse
    {
        $contact->delete();

        return response()->json([
            'message' => 'contact deleted successfully'
        ], 200);
    }
}
