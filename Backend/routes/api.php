<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SchoolController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\VisitController;

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);

    Route::apiResource('schools', SchoolController::class);
    Route::apiResource('contacts', ContactController::class);
    Route::apiResource('visits', VisitController::class)->only(['index', 'store', 'show']);

    Route::middleware(['role:admin,sales_rep'])->group(function () {
        Route::post('schools', [SchoolController::class, 'store']);
    });
});

