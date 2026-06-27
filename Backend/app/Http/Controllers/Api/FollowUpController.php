<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\FollowUp;
use App\Http\Resources\FollowUpResource;
use App\Enums\FollowUpType;
use App\Enums\UserRole;
use Illuminate\Validation\Rule;

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

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'school_id' => ['required', 'exists:schools,id'],
            'follow_up_date' => ['required', 'date'],
            'type' => ['required', Rule::enum(FollowUpType::class)],
            'summary' => ['required', 'string'],
            'next_action' => ['nullable', 'string'],
        ]);

        $followUp = FollowUp::create(array_merge($validated, [
            'done_by' => $request->user()->id
        ]));

        return response()->json([
            'message' => 'Follow up created successfully.',
            'data' => new FollowUpResource($followUp->load(['school', 'user']))
        ], 201);
    }

    public function show(FollowUp $followUp): FollowUpResource
    {
        return new FollowUpResource($followUp->load(['school', 'user']));
    }
}
