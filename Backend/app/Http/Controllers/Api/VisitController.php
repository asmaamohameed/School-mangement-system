<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVisitRequest;
use App\Http\Resources\VisitResource;
use App\Models\Visit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VisitController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Visit::with(['school', 'contact', 'assignedRep', 'books']);

        if ($user->role === UserRole::SALES_REP) {
            $query->where('rep_id', $user->id);
        }

        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }

        return VisitResource::collection($query->latest()->paginate(15));
    }

    public function store(StoreVisitRequest $request): JsonResponse
    {
        $validated = $request->validated();

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
            'data' => new VisitResource($visit->load('books')),
        ], 201);
    }

    public function show(Visit $visit): VisitResource
    {
        return new VisitResource($visit->load(['school', 'contact', 'assignedRep', 'books']));
    }
}
