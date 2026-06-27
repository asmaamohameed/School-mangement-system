<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SchoolController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\VisitController;
use App\Http\Controllers\Api\FollowUpController;

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


});
