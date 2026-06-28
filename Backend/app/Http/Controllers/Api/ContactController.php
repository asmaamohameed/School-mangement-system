<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use App\Http\Resources\ContactResource;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Contact::with('school');

        if ($user->role === UserRole::SALES_REP) {
            $query->whereHas('school', function ($q) use ($user) {
                $q->where('assigned_rep_id', $user->id);
            });
        }

        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }

        return ContactResource::collection($query->latest()->paginate(15));
    }

    public function store(StoreContactRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $contact = Contact::create($validated);

        return response()->json([
            'message' => 'contact created successfully',
            'data' => new ContactResource($contact),
        ], 201);
    }

    public function show(Contact $contact): ContactResource
    {
        $this->authorize('view', $contact);

        return new ContactResource($contact->load('school'));
    }

    public function update(UpdateContactRequest $request, Contact $contact): JsonResponse
    {
        $this->authorize('update', $contact);

        $validated = $request->validated();

        $contact->update($validated);

        return response()->json([
            'message' => 'contact updated successfully',
            'data' => new ContactResource($contact->load('school')),
        ], 200);
    }

    public function destroy(Contact $contact): JsonResponse
    {
        $this->authorize('delete', $contact);

        $contact->delete();

        return response()->json([
            'message' => 'contact deleted successfully',
        ], 200);
    }
}
