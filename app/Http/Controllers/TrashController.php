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
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TrashController extends Controller
{
    /**
     * Display all soft-deleted items from all models.
     */
    public function index()
    {
        $deletedItems = collect();

        // Get soft-deleted programs
        $programs = Program::onlyTrashed()->get()->map(function ($program) {
            return [
                'id' => $program->program_id,
                'type' => 'program',
                'title' => $program->name,
                'description' => $program->description,
                'deleted_at' => $program->deleted_at,
                'metadata' => [
                    'program_code' => $program->program_code,
                    'national_alignment' => $program->national_alignment,
                ]
            ];
        });

        // Get soft-deleted projects
        $projects = Project::onlyTrashed()->get()->map(function ($project) {
            return [
                'id' => $project->project_id,
                'type' => 'project',
                'title' => $project->title,
                'description' => $project->description,
                'deleted_at' => $project->deleted_at,
                'metadata' => [
                    'project_code' => $project->project_code,
                    'nature_of_project' => $project->nature_of_project,
                    'innovation_focus' => $project->innovation_focus,
                ]
            ];
        });

        // Get soft-deleted facilities
        $facilities = Facility::onlyTrashed()->get()->map(function ($facility) {
            return [
                'id' => $facility->facility_id,
                'type' => 'facility',
                'title' => $facility->name,
                'description' => $facility->description,
                'deleted_at' => $facility->deleted_at,
                'metadata' => [
                    'facility_code' => $facility->facility_code,
                    'location' => $facility->location,
                    'facility_type' => $facility->facility_type,
                ]
            ];
        });

        // Get soft-deleted services
        $services = Service::onlyTrashed()->get()->map(function ($service) {
            return [
                'id' => $service->service_id,
                'type' => 'service',
                'title' => $service->name,
                'description' => $service->description,
                'deleted_at' => $service->deleted_at,
                'metadata' => [
                    'category' => $service->category,
                    'skill_type' => $service->skill_type,
                ]
            ];
        });

        // Get soft-deleted equipment
        $equipment = Equipment::onlyTrashed()->get()->map(function ($item) {
            return [
                'id' => $item->equipment_id,
                'type' => 'equipment',
                'title' => $item->name,
                'description' => $item->description,
                'deleted_at' => $item->deleted_at,
                'metadata' => [
                    'inventory_code' => $item->inventory_code,
                    'usage_domain' => $item->usage_domain,
                ]
            ];
        });

        // Get soft-deleted participants
        $participants = Participant::onlyTrashed()->get()->map(function ($participant) {
            return [
                'id' => $participant->participant_id,
                'type' => 'participant',
                'title' => $participant->full_name,
                'description' => $participant->affiliation . ' - ' . $participant->specialization,
                'deleted_at' => $participant->deleted_at,
                'metadata' => [
                    'email' => $participant->email,
                    'participant_type' => $participant->participant_type,
                    'institution' => $participant->institution,
                ]
            ];
        });

        // Get soft-deleted outcomes
        $outcomes = Outcome::onlyTrashed()->get()->map(function ($outcome) {
            return [
                'id' => $outcome->outcome_id,
                'type' => 'outcome',
                'title' => $outcome->title,
                'description' => $outcome->description,
                'deleted_at' => $outcome->deleted_at,
                'metadata' => [
                    'outcome_type' => $outcome->outcome_type,
                    'commercialization_status' => $outcome->commercialization_status,
                ]
            ];
        });

        // Combine all deleted items
        $deletedItems = $deletedItems->concat($programs)
                                   ->concat($projects)
                                   ->concat($facilities)
                                   ->concat($services)
                                   ->concat($equipment)
                                   ->concat($participants)
                                   ->concat($outcomes)
                                   ->sortByDesc('deleted_at');

        return Inertia::render('trash', [
            'deletedItems' => $deletedItems->values()->all()
        ]);
    }

    /**
     * Restore a specific item from trash.
     */
    public function restore(Request $request, string $type, string $id)
    {
        $item = null;

        switch ($type) {
            case 'program':
                $item = Program::onlyTrashed()->findOrFail($id);
                break;
            case 'project':
                $item = Project::onlyTrashed()->findOrFail($id);
                break;
            case 'facility':
                $item = Facility::onlyTrashed()->findOrFail($id);
                break;
            case 'service':
                $item = Service::onlyTrashed()->findOrFail($id);
                break;
            case 'equipment':
                $item = Equipment::onlyTrashed()->findOrFail($id);
                break;
            case 'participant':
                $item = Participant::onlyTrashed()->findOrFail($id);
                break;
            case 'outcome':
                $item = Outcome::onlyTrashed()->findOrFail($id);
                break;
            default:
                abort(404, 'Item type not found');
        }

        if ($item) {
            $item->restore();
        }

        return redirect()->route('trash.index');
    }

    /**
     * Permanently delete a specific item from trash.
     */
    public function permanentDelete(Request $request, string $type, string $id)
    {
        $item = null;

        switch ($type) {
            case 'program':
                $item = Program::onlyTrashed()->findOrFail($id);
                break;
            case 'project':
                $item = Project::onlyTrashed()->findOrFail($id);
                break;
            case 'facility':
                $item = Facility::onlyTrashed()->findOrFail($id);
                break;
            case 'service':
                $item = Service::onlyTrashed()->findOrFail($id);
                break;
            case 'equipment':
                $item = Equipment::onlyTrashed()->findOrFail($id);
                break;
            case 'participant':
                $item = Participant::onlyTrashed()->findOrFail($id);
                break;
            case 'outcome':
                $item = Outcome::onlyTrashed()->findOrFail($id);
                break;
            default:
                abort(404, 'Item type not found');
        }

        if ($item) {
            $item->forceDelete();
        }

        return redirect()->route('trash.index');
    }

    /**
     * Empty the entire trash (permanently delete all soft-deleted items).
     */
    public function emptyTrash(Request $request)
    {
        // Permanently delete all soft-deleted items from all models
        Program::onlyTrashed()->forceDelete();
        Project::onlyTrashed()->forceDelete();
        Facility::onlyTrashed()->forceDelete();
        Service::onlyTrashed()->forceDelete();
        Equipment::onlyTrashed()->forceDelete();
        Participant::onlyTrashed()->forceDelete();
        Outcome::onlyTrashed()->forceDelete();

        return redirect()->route('trash.index');
    }
}