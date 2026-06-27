<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Visit;
use App\Http\Resources\VisitResource;
use App\Enums\UserRole;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class VisitController extends Controller
{
  public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Visit::with(['school', 'contact', 'representative', 'books']);

        if ($user->role === UserRole::SALES_REP) {
            $query->where('rep_id', $user->id);
        }

        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }

        return VisitResource::collection($query->latest()->paginate(15));
    }


    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
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
        ]);

        $user = $request->user();

        $visit = DB::transaction(function () use ($validated, $user) {
            
            $visit = Visit::create([
                'school_id' => $validated['school_id'],
                'contact_id' => $validated['contact_id'],
                'rep_id' => $user->id, 
                'visit_date' => $validated['visit_date'],
                'notes' => $validated['notes'] ?? null,
                'interest_level' => $validated['interest_level'],
                'lat' => $validated['lat'] ?? null,
                'lng' => $validated['lng'] ?? null,
            ]);

            $visit->books()->createMany($validated['books']);

            return $visit;
        });

        return response()->json([
            'message' => 'Visits and books are created successfully',
            'data' => new VisitResource($visit->load('books'))
        ], 201);
    }

    public function show(Visit $visit): VisitResource
    {
        return new VisitResource($visit->load(['school', 'contact', 'representative', 'books']));
    }
}
