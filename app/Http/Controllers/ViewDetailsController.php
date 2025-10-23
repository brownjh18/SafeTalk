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

class ViewDetailsController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type');
        $id = $request->query('id');

        if (!$type || !$id) {
            abort(404);
        }

        $item = null;

        switch ($type) {
            case 'program':
                $item = Program::find($id);
                break;
            case 'project':
                $item = Project::find($id);
                break;
            case 'facility':
                $item = Facility::find($id);
                break;
            case 'service':
                $item = Service::find($id);
                break;
            case 'equipment':
                $item = Equipment::find($id);
                break;
            case 'participant':
                $item = Participant::find($id);
                break;
            case 'outcome':
                $item = Outcome::find($id);
                break;
            default:
                abort(404);
        }

        if (!$item) {
            abort(404);
        }

        // Transform the item to match the expected format
        $transformedItem = [
            'id' => $item->getKey(),
            'type' => $type,
            'title' => $this->getTitle($item, $type),
            'description' => $this->getDescription($item, $type),
            'status' => $this->getStatus($item, $type),
            'created_at' => $item->created_at,
            'updated_at' => $item->updated_at,
            'metadata' => $this->getMetadata($item, $type),
        ];

        return Inertia::render('viewdetails', [
            'item' => $transformedItem,
        ]);
    }

    private function getTitle($item, $type)
    {
        switch ($type) {
            case 'program':
                return $item->name;
            case 'project':
                return $item->title;
            case 'facility':
                return $item->name;
            case 'service':
                return $item->name;
            case 'equipment':
                return $item->name;
            case 'participant':
                return $item->full_name;
            case 'outcome':
                return $item->title;
            default:
                return 'Unknown';
        }
    }

    private function getDescription($item, $type)
    {
        switch ($type) {
            case 'program':
                return $item->description;
            case 'project':
                return $item->description;
            case 'facility':
                return $item->description;
            case 'service':
                return $item->description;
            case 'equipment':
                return $item->description;
            case 'participant':
                return null; // Participants might not have a description
            case 'outcome':
                return $item->description;
            default:
                return null;
        }
    }

    private function getStatus($item, $type)
    {
        switch ($type) {
            case 'program':
                return $item->status ?? 'active';
            case 'project':
                return $item->status ?? 'active';
            case 'facility':
                return $item->status ?? 'active';
            case 'service':
                return $item->status ?? 'active';
            case 'equipment':
                return $item->status ?? 'active';
            case 'participant':
                return $item->status ?? 'active';
            case 'outcome':
                return $item->status ?? 'active';
            default:
                return 'active';
        }
    }

    private function getMetadata($item, $type)
    {
        $metadata = [];

        switch ($type) {
            case 'program':
                $metadata['code'] = $item->program_code;
                $metadata['projects_count'] = 0; // Services don't have direct projects relationship
                break;
            case 'project':
                $metadata['code'] = $item->project_code;
                $metadata['program'] = $item->program?->name;
                $metadata['facility'] = $item->facility?->name;
                $metadata['participants_count'] = $item->participants()->count();
                $metadata['outcomes_count'] = $item->outcomes()->count();
                break;
            case 'facility':
                $metadata['code'] = $item->facility_code;
                $metadata['type'] = $item->facility_type;
                $metadata['location'] = $item->location;
                $metadata['partner'] = $item->partner_organization;
                $metadata['services_count'] = $item->services()->count();
                $metadata['equipment_count'] = $item->equipment()->count();
                $metadata['projects_count'] = 0; // Equipment don't have direct projects relationship
                break;
            case 'service':
                $metadata['code'] = $item->service_code;
                $metadata['category'] = $item->category;
                $metadata['skill_type'] = $item->skill_type;
                $metadata['facility'] = $item->facility?->name;
                $metadata['capacity'] = $item->capacity;
                $metadata['duration'] = $item->duration;
                $metadata['projects_count'] = 0; // Services don't have direct projects relationship
                break;
            case 'equipment':
                $metadata['code'] = $item->inventory_code;
                $metadata['domain'] = $item->usage_domain;
                $metadata['phase'] = $item->support_phase;
                $metadata['facility'] = $item->facility?->name;
                $metadata['last_maintenance'] = $item->last_maintenance;
                $metadata['next_maintenance'] = $item->next_maintenance;
                $metadata['projects_count'] = 0; // Equipment don't have direct projects relationship
                break;
            case 'participant':
                $metadata['email'] = $item->email;
                $metadata['affiliation'] = $item->affiliation;
                $metadata['specialization'] = $item->specialization;
                $metadata['institution'] = $item->institution;
                $metadata['type'] = $item->participant_type;
                $metadata['projects_count'] = $item->projects()->count();
                break;
            case 'outcome':
                $metadata['code'] = $item->outcome_code;
                $metadata['type'] = $item->outcome_type;
                $metadata['project'] = $item->project?->title;
                $metadata['commercialization_status'] = $item->commercialization_status;
                $metadata['quality_certified'] = $item->quality_certification;
                break;
        }

        return array_filter($metadata, function($value) {
            return $value !== null && $value !== '';
        });
    }
}