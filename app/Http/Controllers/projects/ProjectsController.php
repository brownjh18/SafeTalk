<?php

namespace App\Http\Controllers\projects;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Program;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProjectsController extends Controller
{
    /**
     * Display a listing of the projects.
     */
    public function index()
    {
        $projects = Project::with(['program', 'facility'])->get()->map(function ($project) {
            return [
                'id' => $project->project_id,
                'title' => $project->title,
                'description' => $project->description,
                'program' => [
                    'name' => $project->program->name ?? 'No Program',
                    'id' => $project->program->program_id ?? null,
                ],
                'facility' => [
                    'name' => $project->facility->name ?? 'No Facility',
                    'location' => $project->facility->location ?? 'No Location',
                    'id' => $project->facility->facility_id ?? null,
                ],
                'natureOfProject' => $project->nature_of_project,
                'innovationFocus' => $project->innovation_focus,
                'prototypeStage' => $project->prototype_stage,
                'participantCount' => $project->participants()->count(),
                'outcomeCount' => $project->outcomes()->count(),
                'status' => $this->determineProjectStatus($project),
            ];
        });

        return Inertia::render('projects', [
            'projects' => $projects
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function create()
    {
        $programs = Program::all();
        $facilities = Facility::orderBy('name')->get();
        return Inertia::render('projects/create', [
            'programs' => $programs,
            'facilities' => $facilities
        ]);
    }

    /**
     * Store a newly created project in storage.
     */
    public function store(Request $request)
    {
        $request->merge([
            'facility' => $request->input('facility') ?: null,
        ]);
        $validated = $request->validate([
            'program_id' => 'required|string|exists:programs,program_id',
            'facility' => 'nullable|string|exists:facilities,facility_id',
            'title' => 'required|string|max:255',
            'nature_of_project' => 'required|string|max:255',
            'description' => 'nullable|string',
            'innovation_focus' => 'nullable|string|max:255',
            'prototype_stage' => 'nullable|string|max:255',
            'testing_requirements' => 'nullable|string',
            'commercialization_plan' => 'nullable|string',
        ]);

        if (array_key_exists('facility', $validated)) {
            $validated['facility_id'] = $validated['facility'];
            unset($validated['facility']);
        }
        Project::create(['project_id' => (string) Str::uuid()] + $validated);

        return redirect()->route('projects.index');
    }

    /**
     * Display the specified project.
     */
    public function show(Project $project)
    {
        $project->load('program');
        return view('projects.show', compact('project'));
    }

    /**
     * Show the form for editing the specified project.
     */
    public function edit(Project $project)
    {
        $transformedProject = [
            'id' => $project->project_id,
            'title' => $project->title,
            'description' => $project->description,
            'program_id' => $project->program_id,
            'facility_id' => $project->facility_id,
            'natureOfProject' => $project->nature_of_project,
            'innovationFocus' => $project->innovation_focus,
            'prototypeStage' => $project->prototype_stage,
            'testingRequirements' => $project->testing_requirements,
            'commercializationPlan' => $project->commercialization_plan,
        ];

        $programs = Program::all()->map(function ($program) {
            return [
                'program_id' => $program->program_id,
                'name' => $program->name,
            ];
        });

        $facilities = Facility::orderBy('name')->get()->map(function ($facility) {
            return [
                'facility_id' => $facility->facility_id,
                'name' => $facility->name,
                'location' => $facility->location,
            ];
        });

        return Inertia::render('projects/edit', [
            'project' => $transformedProject,
            'programs' => $programs,
            'facilities' => $facilities
        ]);
    }

    /**
     * Update the specified project in storage.
     */
    public function update(Request $request, Project $project)
    {
        $request->merge([
            'facility' => $request->input('facility') ?: null,
        ]);
        $validated = $request->validate([
            'program_id' => 'required|string|exists:programs,program_id',
            'facility' => 'nullable|string|exists:facilities,facility_id',
            'title' => 'required|string|max:255',
            'nature_of_project' => 'required|string|max:255',
            'description' => 'nullable|string',
            'innovation_focus' => 'nullable|string|max:255',
            'prototype_stage' => 'nullable|string|max:255',
            'testing_requirements' => 'nullable|string',
            'commercialization_plan' => 'nullable|string',
        ]);

        if (array_key_exists('facility', $validated)) {
            $validated['facility_id'] = $validated['facility'];
            unset($validated['facility']);
        }
        $project->update($validated);

        return redirect()->route('projects.index');
    }

    /**
     * Remove the specified project from storage.
     */
    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()->route('projects.index');
    }

    /**
     * Determine project status based on prototype stage.
     */
    private function determineProjectStatus(Project $project)
    {
        return match($project->prototype_stage) {
            'Concept' => 'concept',
            'Development' => 'development',
            'Pilot Testing' => 'testing',
            'Market Launch' => 'completed',
            default => 'concept',
        };
    }
}
