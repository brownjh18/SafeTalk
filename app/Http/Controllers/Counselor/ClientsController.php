<?php

namespace App\Http\Controllers\Counselor;

use App\Models\CounselingSession;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientsController extends \App\Http\Controllers\Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get all clients that this counselor has sessions with
        $clientIds = CounselingSession::where('counselor_id', $user->id)
            ->distinct('client_id')
            ->pluck('client_id');

        $clients = User::whereIn('id', $clientIds)
            ->where('role', 'client')
            ->with(['counselingSessions' => function($query) use ($user) {
                $query->where('counselor_id', $user->id);
            }])
            ->get()
            ->map(function ($client) {
                $sessionCount = $client->counselingSessions->count();
                $lastSession = $client->counselingSessions->sortByDesc('scheduled_at')->first();

                return [
                    'id' => $client->id,
                    'name' => $client->name,
                    'email' => $client->email,
                    'session_count' => $sessionCount,
                    'last_session' => $lastSession ? $lastSession->scheduled_at : null,
                    'status' => $lastSession ? $lastSession->status : 'no_sessions',
                ];
            });

        return Inertia::render('counselor/clients/index', [
            'clients' => $clients,
        ]);
    }
}