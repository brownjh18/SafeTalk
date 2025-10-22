<?php

namespace App\Http\Controllers\outcomes;

use App\Http\Controllers\Controller;
use App\Models\Outcome;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OutcomesController extends Controller
{
    /**
     * List outcomes for a given project.
     */
    public function index(Project $project)
    {
        $project->load('outcomes');

        $transformedProject = [
            'id' => $project->project_id,
            'title' => $project->title,
            'outcomes' => $project->outcomes->map(function ($outcome) use ($project) {
                return [
                    'id' => $outcome->outcome_id,
                    'title' => $outcome->title,
                    'description' => $outcome->description,
                    'projectName' => $project->title,
                    'outcomeType' => $outcome->outcome_type,
                    'commercializationStatus' => $outcome->commercialization_status,
                    'qualityCertification' => !empty($outcome->quality_certification),
                    'artifactLink' => $outcome->artifact_link,
                    'createdAt' => $outcome->created_at->toISOString(),
                ];
            }),
        ];

        return Inertia::render('outcomes', [
            'project' => $transformedProject
        ]);
    }

    /**
     * Show form to create a new outcome for a project.
     */
    public function create(Project $project)
    {
        $types = Outcome::OUTCOME_TYPES;
        $statuses = Outcome::COMMERCIALIZATION_STATUSES;
        return Inertia::render('outcomes/create', [
            'project' => $project,
            'types' => $types,
            'statuses' => $statuses
        ]);
    }

    /**
     * Store a newly created outcome and optional artifact upload.
     */
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'outcome_type' => 'required|string|in:' . implode(',', Outcome::OUTCOME_TYPES),
            'quality_certification' => 'nullable|string|max:255',
            'commercialization_status' => 'nullable|string|in:' . implode(',', Outcome::COMMERCIALIZATION_STATUSES),
            'artifact' => 'nullable|file|max:20480', // up to 20MB
        ]);

        $path = null;
        if ($request->hasFile('artifact')) {
            $path = $request->file('artifact')->store('outcomes/' . $project->project_id, 'public');
        }

        Outcome::create([
            'outcome_id' => (string) Str::uuid(),
            'project_id' => $project->project_id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'artifact_link' => $path, // stored relative path on public disk
            'outcome_type' => $validated['outcome_type'],
            'quality_certification' => $validated['quality_certification'] ?? null,
            'commercialization_status' => $validated['commercialization_status'] ?? null,
        ]);

        return redirect()->route('projects.outcomes.index', $project->project_id);
    }

    /**
     * Show the form for editing an existing outcome.
     */
    public function edit(Project $project, Outcome $outcome)
    {
        if ($outcome->project_id !== $project->project_id) {
            abort(404);
        }

        $transformedProject = [
            'id' => $project->project_id,
            'title' => $project->title,
        ];

        $transformedOutcome = [
            'id' => $outcome->outcome_id,
            'title' => $outcome->title,
            'description' => $outcome->description,
            'outcome_type' => $outcome->outcome_type,
            'quality_certification' => $outcome->quality_certification,
            'commercialization_status' => $outcome->commercialization_status,
            'artifact_link' => $outcome->artifact_link,
        ];

        $types = Outcome::OUTCOME_TYPES;
        $statuses = Outcome::COMMERCIALIZATION_STATUSES;
        return Inertia::render('outcomes/edit', [
            'project' => $transformedProject,
            'outcome' => $transformedOutcome,
            'types' => $types,
            'statuses' => $statuses
        ]);
    }

    /**
     * Update the outcome details and optionally replace the artifact.
     */
    public function update(Request $request, Project $project, Outcome $outcome)
    {
        if ($outcome->project_id !== $project->project_id) {
            abort(404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'outcome_type' => 'required|string|in:' . implode(',', Outcome::OUTCOME_TYPES),
            'quality_certification' => 'nullable|string|max:255',
            'commercialization_status' => 'nullable|string|in:' . implode(',', Outcome::COMMERCIALIZATION_STATUSES),
            'artifact' => 'nullable|file|max:20480',
        ]);

        if ($request->hasFile('artifact')) {
            if ($outcome->artifact_link) {
                Storage::disk('public')->delete($outcome->artifact_link);
            }
            $outcome->artifact_link = $request->file('artifact')->store('outcomes/' . $project->project_id, 'public');
        }

        $outcome->update($validated);

        return redirect()->route('projects.outcomes.index', $project->project_id);
    }

    /**
     * Delete an outcome (and its artifact file, if present).
     */
    public function destroy(Project $project, Outcome $outcome)
    {
        if ($outcome->project_id !== $project->project_id) {
            abort(404);
        }

        if ($outcome->artifact_link) {
            Storage::disk('public')->delete($outcome->artifact_link);
        }

        $outcome->delete();

        return redirect()->route('projects.outcomes.index', $project->project_id);
    }

    /**
     * Download the linked artifact.
     */
    public function download(Project $project, Outcome $outcome)
    {
        if ($outcome->project_id !== $project->project_id) {
            abort(404);
        }

        if (!$outcome->artifact_link || !Storage::disk('public')->exists($outcome->artifact_link)) {
            return redirect()->route('projects.outcomes.index', $project->project_id)
                ->with('error', 'Artifact not found.');
        }

        $filename = preg_replace('/[^A-Za-z0-9-_ ]/', '', $outcome->title);
        $ext = pathinfo($outcome->artifact_link, PATHINFO_EXTENSION);
        $downloadName = $filename ? ($filename . ($ext ? ".{$ext}" : '')) : basename($outcome->artifact_link);

        return Storage::disk('public')->download($outcome->artifact_link, $downloadName);
    }
}
