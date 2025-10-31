<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserSearchController extends Controller
{
    /**
     * Search for users by name or email.
     */
    public function search(Request $request)
    {
        $query = $request->get('q', '');
        $user = $request->user();

        if (empty($query)) {
            return response()->json(['users' => []]);
        }

        // Search for users excluding the current user
        $users = User::where('id', '!=', $user->id)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            })
            ->limit(10)
            ->get(['id', 'name', 'email', 'role', 'verified']);

        return response()->json([
            'users' => $users
        ]);
    }
}