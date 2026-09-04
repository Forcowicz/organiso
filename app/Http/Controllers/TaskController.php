<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $taskQuery = Task::with('user');

        $sortingAlgorithm = $request->sort ?? 'eisenhower';

        Log::info("Our sorting algorithm is $sortingAlgorithm");

        if ($sortingAlgorithm === 'deadline') {
            $taskQuery->select(DB::raw("*, (due_date + coalesce(due_time, '23:59:59')) AS timestamp"))->where('user_id', Auth::user()->id)->where('completed_at', null)->orderBy('timestamp', 'asc');
        } else if ($sortingAlgorithm === 'eisenhower') {
            $taskQuery->select(DB::raw("
            *, CASE
                WHEN is_urgent and is_important THEN 0
                WHEN is_urgent and NOT is_important THEN 1
                WHEN NOT is_urgent and is_important THEN 2
                WHEN NOT is_urgent and NOT is_important THEN 3
            END AS priority
            "))->where('user_id', Auth::user()->id)->where('completed_at', null)->orderBy('priority', 'asc');
        }

        return Inertia::render('Tasks', [
            'tasks' => fn() => $taskQuery->get()
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
