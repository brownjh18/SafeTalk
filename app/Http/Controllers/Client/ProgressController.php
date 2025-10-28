<?php

namespace App\Http\Controllers\Client;

use App\Models\ProgressReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgressController extends \App\Http\Controllers\Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $reports = ProgressReport::with(['session', 'session.counselor'])
            ->whereHas('session', function ($query) use ($user) {
                $query->where('client_id', $user->id);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        $stats = [
            'total_reports' => ProgressReport::whereHas('session', function ($query) use ($user) {
                $query->where('client_id', $user->id);
            })->count(),
            'this_month' => ProgressReport::whereHas('session', function ($query) use ($user) {
                $query->where('client_id', $user->id);
            })->whereMonth('created_at', now()->month)->count(),
        ];

        return Inertia::render('client/progress/index', [
            'reports' => $reports,
            'stats' => $stats,
        ]);
    }
}