<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;

class ConversationController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->get('q', '');
        $users = [];

        if (!empty($query)) {
            $users = User::where('name', 'like', "%{$query}%")
                ->orWhere('email', 'like', "%{$query}%")
                ->limit(10)
                ->get(['id', 'name', 'email']);
        }

        return Inertia::render('users/search', [
            'users' => $users,
            'query' => $query,
        ]);
    }
}
