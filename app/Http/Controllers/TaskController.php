<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = Task::with('user')->where('user_id', Auth::user()->id)->where('completed_at', null)->orderBy('due_date', 'asc')->get();

        return Inertia::render('Tasks', [
            'tasks' => $tasks
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $validated = $request->validated();

        $task = new Task();
        $task->name = $validated['name'];
        $task->description = $validated['description'] ?? null;
        $task->is_urgent = $validated['is_urgent'];
        $task->is_important = $validated['is_important'];
        $task->due_date = $validated['due_date'] ?? null;
        $task->due_time = $validated['due_time'] ?? null;
        $task->user_id = $request->user()->id;
        $task->save();

        return response()->json([
            'status' => 'success',
            'task' => $task
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $task->completed_at = $request->completed_at;
        $task->save();

        return response()->json([
            'status' => 'success',
            'task' => $task
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        //
    }
}
