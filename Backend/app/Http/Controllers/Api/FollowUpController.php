<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFollowUpRequest;
use App\Http\Resources\FollowUpResource;
use App\Models\FollowUp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FollowUpController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = FollowUp::with(['school', 'user']);

        if ($user->role === UserRole::SALES_REP) {
            $query->where('done_by', $user->id);
        }

        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }

        return FollowUpResource::collection($query->latest()->paginate(15));
    }

    public function store(StoreFollowUpRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $followUp = FollowUp::create(array_merge($validated, [
            'done_by' => $request->user()->id,
        ]));

        return response()->json([
            'message' => 'Follow up created successfully.',
            'data' => new FollowUpResource($followUp->load(['school', 'user'])),
        ], 201);
    }

    public function show(FollowUp $followUp): FollowUpResource
    {
        return new FollowUpResource($followUp->load(['school', 'user']));
    }
}
