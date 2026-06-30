<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FollowUpController;
use App\Http\Controllers\Api\SchoolController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\VisitController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);

    // School routes
    Route::apiResource('schools', SchoolController::class)->except(['store']);
    Route::patch('schools/{school}/stage', [SchoolController::class, 'updateStage']);
    Route::middleware(['role:admin,sales_rep'])->group(function () {
        Route::post('schools', [SchoolController::class, 'store']);
    });

    // Contact routes
    Route::apiResource('contacts', ContactController::class);
    // Visit routes
    Route::apiResource('visits', VisitController::class)->only(['index', 'store', 'show']);

    // Follow up routes
    Route::apiResource('follow-ups', FollowUpController::class)->only(['index', 'store', 'show']);

    // Task routes
    Route::apiResource('tasks', TaskController::class);
    Route::patch('tasks/{task}/complete', [TaskController::class, 'complete']);

    // Dashboard routes
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // User routes (for assignment dropdowns)
    Route::get('users', function (Request $request) {
        return response()->json([
            'data' => User::where('is_active', true)->get(['id', 'name', 'role']),
        ]);
    });

});
