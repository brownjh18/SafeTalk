<?php

namespace App\Http\Controllers\Counselor;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementsController extends \App\Http\Controllers\Controller
{
    public function index(Request $request)
    {
        $announcements = Announcement::where(function ($query) {
            $query->whereJsonContains('target_roles', 'counselor')
                  ->orWhere('target_roles', null);
        })
        ->where('is_active', true)
        ->orderBy('created_at', 'desc')
        ->get();

        return Inertia::render('counselor/announcements/index', [
            'announcements' => $announcements,
        ]);
    }
}