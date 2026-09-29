<?php

use App\Http\Controllers\API\TaskApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::controller(TaskApiController::class)->group(function () {
        Route::post('/tasks', 'store')->name('api.tasks.store');
    });
});
