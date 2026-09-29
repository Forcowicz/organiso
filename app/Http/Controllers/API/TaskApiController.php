<?php

namespace App\Http\Controllers\API;

use App\Http\Requests\StoreTaskRequest;
use App\Models\Task;
use Exception;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TaskApiController extends Controller
{
    public function store(StoreTaskRequest $request)
    {
        $validated = $request->validated();

        try {
            $task = new Task(array_merge(['user_id' => $request->user()->id], $validated));
            $task->save();

            return response([
                'status' => 'success',
                'task' => $task
            ], 201);
        } catch (Exception $e) {
            return response([
                'status' => 'error',
                'message' => config('app.env', 'production') !== 'production' ? $e->getMessage() : 'An unexpected error occurred'
            ], 500);
        }
    }
}
