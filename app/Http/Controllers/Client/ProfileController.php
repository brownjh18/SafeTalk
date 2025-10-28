<?php

namespace App\Http\Controllers\Client;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends \App\Http\Controllers\Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return Inertia::render('client/profile/index', [
            'user' => $user,
        ]);
    }
}