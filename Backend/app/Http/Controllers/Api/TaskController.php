<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Task::with(['school', 'createdBy', 'assignedTo']);

        if ($user->role === UserRole::SALES_REP) {
            $query->where('assigned_to', $user->id)->orWhere('created_by', $user->id);
        }

        return TaskResource::collection($query->latest()->paginate(15));
    }

    public function store(StoreTaskRequest $request)
    {
        $validated = $request->validated();

        $task = Task::create(array_merge($validated, [
            'created_by' => $request->user()->id,
            'status' => 'pending',
        ]));

        return response()->json([
            'message' => 'Task created successfully',
            'data' => new TaskResource($task->load(['school', 'createdBy', 'assignedTo'])),
        ], 201);
    }

    public function show(Task $task)
    {
        $this->authorize('view', $task);

        return response()->json([
            'data' => new TaskResource($task->load(['school', 'createdBy', 'assignedTo'])),
        ], 200);

    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->authorize('update', $task);

        $validated = $request->validated();

        $task->update($validated);

        return response()->json([
            'message' => 'Task updated successfully',
            'data' => new TaskResource($task->load(['school', 'createdBy', 'assignedTo'])),
        ], 200);
    }

    public function complete(Task $task)
    {
        $this->authorize('complete', $task);

        $task->update([
            'status' => 'completed',
        ]);

        return response()->json([
            'message' => 'Task completed successfully',
            'data' => new TaskResource($task->load(['school', 'createdBy', 'assignedTo'])),
        ], 200);
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully',
        ], 200);
    }
}
