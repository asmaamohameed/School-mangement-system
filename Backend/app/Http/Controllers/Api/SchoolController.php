<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SchoolResource;
use App\Models\School;
use App\Enums\UserRole;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SchoolController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = School::with('assignedRep');

        if ($user->role === UserRole::SALES_REP) {
            $query->where('assigned_to', $user->id);
        }
        $schools = $query->latest()->paginate(10);

        return SchoolResource::collection($schools);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'school_type' => ['required', 'string'],
            'city' => ['required', 'string'],
            'address' => ['required', 'string'],
            'principal_name' => ['nullable', 'string'],
            'principal_mobile' => ['nullable', 'string'],
        ]);

        $user = $request->user();
        
        $school = School::create(array_merge($validated, [
            'stage' => 'lead',
            'assigned_rep_id' => $user->role === UserRole::SALES_REP ? $user->id : null,
            'assigned_to' => $user->role === UserRole::SALES_REP ? $user->id : null,
        ]));

        return response()->json([
            'message' => 'School created successfully',
            'data' => new SchoolResource($school)
        ], 201);
    }

    public function show(School $school): SchoolResource
    {
        $school->load(['assignedRep', 'contacts']);

        return new SchoolResource($school);
    }

    public function update(Request $request, School $school): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'school_type' => ['sometimes', 'required', 'string'],
            'city' => ['sometimes', 'required', 'string'],
            'address' => ['sometimes', 'required', 'string'],
            'principal_name' => ['nullable', 'string'],
            'principal_mobile' => ['nullable', 'string'],
            'stage' => ['sometimes', 'required', 'string'], 
        ]);

        $school->update($validated);

        return response()->json([
            'message' => 'School updated successfully',
            'data' => new SchoolResource($school->load('assignedRep'))
        ], 200);
    }

    public function destroy(Request $request, School $school): JsonResponse
    {
        if ($request->user()->role->value !== 'admin') {
            return response()->json([
                'message' => 'Sorry, only admins can delete schools.'
            ], 403);
        }
        $school->delete();

        return response()->json([
            'message' => 'School deleted successfully.'
        ], 200);
    }
}