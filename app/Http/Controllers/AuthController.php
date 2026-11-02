<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // REGISTER USER
    public function register(Request $request)
    {
        // 1. Validate input
        $request->validate([
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);

        // 2. Create user
        User::create([
            'name' => $request->email,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'score' => 0
        ]);

        // 3. Return response
        return response()->json(['status' => 'success']);
    }

    // LOGIN USER
    public function login(Request $request)
    {
        // 1. Find user by email
        $user = User::where('email', $request->email)->first();

        // 2. Check password
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['status' => 'error'], 401);
        }

        // 3. Return user data (including score)
        return response()->json([
            'status' => 'success',
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'score' => $user->score
            ]
        ]);
    }

    // SAVE QUIZ SCORE
    public function saveScore(Request $request)
    {
        // 1. Find user
        $user = User::find($request->user_id);

        // 2. Save only if score is higher
        if ($request->score > $user->score) {
            $user->score = $request->score;
            $user->save();
        }

        return response()->json(['status' => 'success']);
    }
}
