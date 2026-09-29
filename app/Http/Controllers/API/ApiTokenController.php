<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ApiTokenController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        $user->tokens()->where('name', 'android-assistant')->delete();

        $token =  $user->createToken('android-assistant')->plainTextToken;

        return response([
            'status' => 'success',
            'token' => $token
        ], 201);
    }

    public function destroy(Request $request)
    {
        $user = $request->user();

        $user->tokens()->where('name', 'android-assistant')->delete();

        return response(status: 204);
    }
}
