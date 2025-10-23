<?php

namespace App\Http\Controllers\participants;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ParticipantsController extends Controller
{
    /**
     * Display a listing of participants.
     */
    public function index()
    {
        $participants = Participant::orderBy('full_name')->get()->map(function ($participant) {
            return [
                'id' => $participant->participant_id,
                'fullName' => $participant->full_name,
                'email' => $participant->email,
                'affiliation' => $participant->affiliation,
                'specialization' => $participant->specialization,
                'institution' => $participant->institution,
                'participantType' => $participant->participant_type,
                'projectCount' => $participant->projects()->count(),
                'status' => 'active', // Default status since not in model
            ];
        });

        return Inertia::render('participants', [
            'participants' => $participants
        ]);
    }

    /**
     * Show the form for creating a new participant.
     */
    public function create()
    {
        $affiliations = Participant::AFFILIATIONS;
        $specializations = Participant::SPECIALIZATIONS;
        $institutions = Participant::INSTITUTIONS;
        $participantTypes = Participant::PARTICIPANT_TYPES;
        $projects = Project::with('program')->orderBy('title')->get();
        return Inertia::render('participants/create', [
            'affiliations' => $affiliations,
            'specializations' => $specializations,
            'institutions' => $institutions,
            'participantTypes' => $participantTypes,
            'projects' => $projects
        ]);
    }

    /**
     * Store a newly created participant in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:participants,email',
            'affiliation' => 'required|string|in:' . implode(',', Participant::AFFILIATIONS),
            'specialization' => 'required|string|in:' . implode(',', Participant::SPECIALIZATIONS),
            'participant_type' => 'required|string|in:' . implode(',', Participant::PARTICIPANT_TYPES),
            'cross_skill_trained' => 'sometimes|boolean',
            'institution' => 'required|string|in:' . implode(',', Participant::INSTITUTIONS),
            'project_id' => 'nullable|string|exists:projects,project_id',
        ]);

        // Check Specialization Requirement
        if ($validated['cross_skill_trained'] && empty($validated['specialization'])) {
            return redirect()->back()->withErrors(['cross_skill_trained' => 'Cross-skill flag requires Specialization.']);
        }

        $validated['cross_skill_trained'] = (bool) ($validated['cross_skill_trained'] ?? false);

        $data = $validated;
        unset($data['project_id']);

        $participant = Participant::create(['participant_id' => (string) Str::uuid()] + $data);

        if (!empty($validated['project_id'])) {
            $participant->projects()->attach($validated['project_id']);
        }

        return redirect()->route('participants.index');
    }

    /**
     * Display the specified participant profile with their projects.
     */
    public function show(Participant $participant)
    {
        $participant->load('projects');
        return view('participants.show', compact('participant'));
    }

    /**
     * Show the form for editing the participant.
     */
    public function edit(Participant $participant)
    {
        $transformedParticipant = [
            'id' => $participant->participant_id,
            'full_name' => $participant->full_name,
            'email' => $participant->email,
            'affiliation' => $participant->affiliation,
            'specialization' => $participant->specialization,
            'participant_type' => $participant->participant_type,
            'cross_skill_trained' => $participant->cross_skill_trained,
            'institution' => $participant->institution,
        ];

        $affiliations = Participant::AFFILIATIONS;
        $specializations = Participant::SPECIALIZATIONS;
        $institutions = Participant::INSTITUTIONS;
        $participantTypes = Participant::PARTICIPANT_TYPES;
        return Inertia::render('participants/edit', [
            'participant' => $transformedParticipant,
            'affiliations' => $affiliations,
            'specializations' => $specializations,
            'institutions' => $institutions,
            'participantTypes' => $participantTypes
        ]);
    }

    /**
     * Update the participant in storage.
     */
    public function update(Request $request, Participant $participant)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:participants,email,' . $participant->participant_id . ',participant_id',
            'affiliation' => 'required|string|in:' . implode(',', Participant::AFFILIATIONS),
            'specialization' => 'required|string|in:' . implode(',', Participant::SPECIALIZATIONS),
            'participant_type' => 'required|string|in:' . implode(',', Participant::PARTICIPANT_TYPES),
            'cross_skill_trained' => 'sometimes|boolean',
            'institution' => 'required|string|in:' . implode(',', Participant::INSTITUTIONS),
        ]);

        // Check Specialization Requirement
        if ($validated['cross_skill_trained'] && empty($validated['specialization'])) {
            return redirect()->back()->withErrors(['cross_skill_trained' => 'Cross-skill flag requires Specialization.']);
        }

        $validated['cross_skill_trained'] = (bool) ($validated['cross_skill_trained'] ?? false);

        $participant->update($validated);

        return redirect()->route('participants.index');
    }

    /**
     * Remove the participant from storage.
     */
    public function destroy(Participant $participant)
    {
        $participant->delete();
        return redirect()->route('participants.index');
    }

    /**
     * Assign a participant to a project.
     */
    public function assignToProject(Request $request, Participant $participant)
    {
        $data = $request->validate([
            'project_id' => 'required|string|exists:projects,project_id',
        ]);

        $participant->projects()->syncWithoutDetaching([$data['project_id']]);

        return redirect()->route('participants.show', $participant->participant_id)
            ->with('success', 'Participant assigned to project successfully.');
    }

    /**
     * Remove a participant from a project.
     */
    public function removeFromProject(Participant $participant, Project $project)
    {
        $participant->projects()->detach($project->project_id);

        return redirect()->route('participants.show', $participant->participant_id);
    }
}
