<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\Project;
use App\Models\Facility;
use App\Models\Service;
use App\Models\Equipment;
use App\Models\Participant;
use App\Models\Outcome;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Fetch real statistics
        $stats = [
            'programs' => Program::count(),
            'projects' => Project::count(),
            'facilities' => Facility::count(),
            'services' => Service::count(),
            'equipment' => Equipment::count(),
            'participants' => Participant::count(),
            'outcomes' => Outcome::count(),
        ];

        // Project progress breakdown
        $projectProgress = [
            'completed' => Project::where('prototype_stage', 'Market Launch')->count(),
            'in_progress' => Project::whereIn('prototype_stage', ['Development', 'Pilot Testing'])->count(),
            'planning' => Project::where('prototype_stage', 'Concept')->count(),
        ];

        // Recent activities (latest 5 projects, outcomes, etc.)
        $recentProjects = Project::with(['program', 'facility'])
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->project_id,
                    'title' => $project->title,
                    'program' => $project->program->name ?? 'No Program',
                    'facility' => $project->facility->name ?? 'No Facility',
                    'created_at' => $project->created_at->diffForHumans(),
                ];
            });

        $recentOutcomes = Outcome::with(['project'])
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($outcome) {
                return [
                    'id' => $outcome->outcome_id,
                    'title' => $outcome->title,
                    'project' => $outcome->project->title ?? 'No Project',
                    'created_at' => $outcome->created_at->diffForHumans(),
                ];
            });

        // Achievements or milestones (this could be based on specific criteria)
        $achievements = [
            [
                'title' => 'NDPIII Milestone Reached',
                'description' => 'Digital Health Program completed Phase 2',
                'time' => now()->subHours(2)->diffForHumans(),
            ],
            [
                'title' => 'New Innovation Approved',
                'description' => 'IoT Smart Agriculture System',
                'time' => now()->subHours(4)->diffForHumans(),
            ],
            [
                'title' => 'Equipment Upgraded',
                'description' => '3D Printer calibration completed',
                'time' => now()->subDay()->diffForHumans(),
            ],
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'projectProgress' => $projectProgress,
            'recentProjects' => $recentProjects,
            'recentOutcomes' => $recentOutcomes,
            'achievements' => $achievements,
        ]);
    }

    public function activity()
    {
        // Fetch all recent activities from various models
        $recentProjects = Project::with(['program', 'facility'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->project_id,
                    'title' => $project->title,
                    'type' => 'Project',
                    'description' => 'New project created',
                    'program' => $project->program->name ?? 'No Program',
                    'facility' => $project->facility->name ?? 'No Facility',
                    'created_at' => $project->created_at->diffForHumans(),
                    'color' => 'green',
                ];
            });

        $recentOutcomes = Outcome::with(['project'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($outcome) {
                return [
                    'id' => $outcome->outcome_id,
                    'title' => $outcome->title,
                    'type' => 'Outcome',
                    'description' => 'New outcome achieved',
                    'project' => $outcome->project->title ?? 'No Project',
                    'created_at' => $outcome->created_at->diffForHumans(),
                    'color' => 'blue',
                ];
            });

        // Add more activity types if needed, e.g., participants, equipment, etc.
        $recentParticipants = Participant::latest()->take(5)->get()->map(function ($participant) {
            return [
                'id' => $participant->participant_id,
                'title' => $participant->name,
                'type' => 'Participant',
                'description' => 'New participant enrolled',
                'created_at' => $participant->created_at->diffForHumans(),
                'color' => 'orange',
            ];
        });

        // Combine all activities and sort by created_at
        $allActivities = $recentProjects->concat($recentOutcomes)->concat($recentParticipants)->sortByDesc('created_at')->values();

        return Inertia::render('activity', [
            'activities' => $allActivities,
        ]);
    }
}