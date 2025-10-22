<?php

namespace App\Repositories\Fake;

use App\Models\Program;

class FakeProgramRepository
{
    /** @var array<string, Program> */
    private array $programs = [];

    public function all(): array
    {
        return array_values($this->programs);
    }

    public function save(Program $p): Program
    {
        // Required fields
        if (empty($p->name)) {
            throw new \Exception("Program.Name is required.");
        }
        if (empty($p->description)) {
            throw new \Exception("Program.Description is required.");
        }

        // Unique name (case-insensitive)
        foreach ($this->programs as $existing) {
            if (isset($existing->name) && strcasecmp($existing->name, $p->name) === 0) {
                throw new \Exception("Program.Name already exists.");
            }
        }

        // Focus areas require national alignment
        if (!empty($p->focus_areas) && (empty($p->national_alignment) || count($p->national_alignment) === 0)) {
            throw new \Exception("Program.NationalAlignment must include at least one recognized alignment when FocusAreas are specified.");
        }

        $key = isset($p->program_id) ? (string) $p->program_id : (string) spl_object_id($p);
        $this->programs[$key] = $p;
        return $p;
    }

    public function delete(Program $p): bool
    {
        // Prevent delete if program has projects
        $projects = is_array($p->projects) ? $p->projects : (array) ($p->projects ?? []);
        if (!empty($projects) && count($projects) > 0) {
            throw new \Exception("Program has Projects; archive or reassign before delete.");
        }

        $key = isset($p->program_id) ? (string) $p->program_id : (string) spl_object_id($p);
        if (isset($this->programs[$key])) {
            unset($this->programs[$key]);
            return true;
        }
        return false;
    }
}
