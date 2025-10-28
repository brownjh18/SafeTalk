<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementsController extends \App\Http\Controllers\Controller
{
    public function index(Request $request)
    {
        $announcements = \App\Models\Announcement::orderBy('created_at', 'desc')->get();

        $users = User::select('id', 'name', 'role')->get();

        return Inertia::render('admin/announcements/index', [
            'announcements' => $announcements,
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'target_roles' => 'array',
            'is_active' => 'boolean',
        ]);

        $announcement = \App\Models\Announcement::create($request->all());

        // Create notifications for target roles
        if (!empty($request->target_roles)) {
            foreach ($request->target_roles as $role) {
                $users = \App\Models\User::where('role', $role)->get();

                foreach ($users as $user) {
                    \App\Models\AppNotification::create([
                        'user_id' => $user->id,
                        'type' => 'announcement',
                        'title' => $announcement->title,
                        'message' => $announcement->message,
                        'data' => [
                            'announcement_id' => $announcement->id,
                            'link' => $this->getAnnouncementLink($role),
                        ],
                        'is_read' => false,
                    ]);
                }
            }
        }

        return redirect()->back()->with('success', 'Announcement created successfully');
    }

    private function getAnnouncementLink($role)
    {
        switch ($role) {
            case 'admin':
                return '/admin/announcements';
            case 'counselor':
                return '/counselor/announcements';
            case 'client':
                return '/client/announcements';
            default:
                return '/dashboard';
        }
    }
}