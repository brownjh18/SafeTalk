<?php

namespace App\Repositories\Fake;

use App\Models\Project;

class FakeProjectRepository
{
    /** @var array<string, Project> */
    private array $projects = [];

    public function all(): array
    {
        return array_values($this->projects);
    }

    public function save(Project $project): Project
    {
        // RequiredAssociations Rule
        if (empty($project->program_id) || empty($project->facility_id)) {
            throw new \Exception("Project.ProgramId and Project.FacilityId are required.");
        }

        // OutcomeValidation Rule (check completed status first to match test expectation ordering)
        if (isset($project->status) && strtolower($project->status) === 'completed') {
            $outcomes = is_array($project->outcomes) ? $project->outcomes : (array) ($project->outcomes ?? []);
            if (count($outcomes) === 0) {
                throw new \Exception("Completed project must have at least one documented outcome.");
            }
        }

        // NameUniqueness Rule (within same Program)
        foreach ($this->projects as $existing) {
            if (
                (isset($existing->program_id) && $existing->program_id === $project->program_id) &&
                isset($existing->name) && strcasecmp($existing->name, $project->name) === 0
            ) {
                throw new \Exception("A project with this name already exists in this program.");
            }
        }

        // FacilityCompatibility Rule
        $requirements = is_array($project->requirements) ? $project->requirements : (array) ($project->requirements ?? []);
        $capabilities = is_array($project->facility_capabilities) ? $project->facility_capabilities : (array) ($project->facility_capabilities ?? []);
        foreach ($requirements as $req) {
            if (!in_array($req, $capabilities)) {
                throw new \Exception("Project requirements not compatible with facility capabilities.");
            }
        }

        // TeamTracking Rule (check team members after compatibility & outcomes to match tests)
        $team = is_array($project->team_members) ? $project->team_members : (array) ($project->team_members ?? []);
        if (count($team) === 0) {
            throw new \Exception("Project must have at least one team member assigned.");
        }

        $key = isset($project->project_id) ? (string) $project->project_id : (string) spl_object_id($project);
        $this->projects[$key] = $project;
        return $project;
    }

    public function delete(Project $project): bool
    {
        $key = isset($project->project_id) ? (string) $project->project_id : (string) spl_object_id($project);
        if (isset($this->projects[$key])) {
            unset($this->projects[$key]);
            return true;
        }
        return false;
    }
}
