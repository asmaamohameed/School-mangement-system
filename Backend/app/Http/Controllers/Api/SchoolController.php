<?php

namespace App\Http\Controllers\Api;

use App\Enums\SchoolStage;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSchoolRequest;
use App\Http\Requests\UpdateSchoolRequest;
use App\Http\Resources\SchoolResource;
use App\Models\PipelineHistory;
use App\Models\School;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SchoolController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = School::with('createdBy');

        if ($user->role === UserRole::SALES_REP) {
            $query->where('created_by', $user->id);
        }
        $schools = $query->latest()->paginate(10);

        return SchoolResource::collection($schools);
    }

    public function store(StoreSchoolRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = $request->user();

        $school = School::create(array_merge($validated, [
            'stage' => 'lead',
            'created_by' => $user->role === UserRole::SALES_REP ? $user->id : null,
            'assigned_to' => $user->role === UserRole::SALES_REP ? $user->id : null,
        ]));

        return response()->json([
            'message' => 'School created successfully',
            'data' => new SchoolResource($school),
        ], 201);
    }

    public function show(School $school): SchoolResource
    {
        $this->authorize('view', $school);

        $school->load(['createdBy', 'contacts']);

        return new SchoolResource($school);
    }

    public function update(UpdateSchoolRequest $request, School $school): JsonResponse
    {
        $this->authorize('update', $school);

        $validated = $request->validated();

        $school->update($validated);

        return response()->json([
            'message' => 'School updated successfully',
            'data' => new SchoolResource($school->load('createdBy')),
        ], 200);
    }

    public function destroy(Request $request, School $school): JsonResponse
    {
        $this->authorize('delete', $school);

        $school->delete();

        return response()->json([
            'message' => 'School deleted successfully.',
        ], 200);
    }

    public function updateStage(Request $request, School $school): JsonResponse
    {
        $this->authorize('update', $school);

        $validated = $request->validate([
            'stage' => ['required', Rule::enum(SchoolStage::class)],
        ]);

        $fromStage = $school->stage;
        $toStage = $validated['stage'];

        $school->update([
            'stage' => $toStage,
        ]);

        if ($fromStage !== $toStage) {
            PipelineHistory::create([
                'school_id' => $school->id,
                'from_stage' => $fromStage,
                'to_stage' => $toStage,
                'changed_by' => $request->user()->id,
                'changed_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'School moved to stage '.$school->stage->value.' successfully.',
            'current_stage' => $school->stage->value,
        ], 200);
    }
}
