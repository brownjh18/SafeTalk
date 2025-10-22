<?php

namespace App\Repositories\Fake;

use App\Models\Facility;

class FakeFacilityRepository
{
    private array $facilities = [];

    public function all(): array
    {
        return array_values($this->facilities);
    }

    public function save(Facility $facility): Facility
    {
        // Required fields
        if (empty($facility->name) || empty($facility->location) || empty($facility->manager_name)) {
            throw new \Exception("Facility.Name, Facility.Location, and Facility.ManagerName are required.");
        }

        // Unique name check (case-insensitive)
        foreach ($this->facilities as $existing) {
            if (isset($existing->name) && strcasecmp($existing->name, $facility->name) === 0) {
                throw new \Exception("Facility.Name already exists.");
            }
        }

        // Capacity rule
        if (isset($facility->capacity) && $facility->capacity <= 0) {
            throw new \Exception("Facility.Capacity must be greater than zero.");
        }

        // Program id validation if present
        if (isset($facility->program_id) && trim((string)$facility->program_id) === '') {
            throw new \Exception("Facility.ProgramId must be valid when specified.");
        }

        $key = isset($facility->facility_id) ? (string) $facility->facility_id : (string) spl_object_id($facility);
        $this->facilities[$key] = $facility;
        return $facility;
    }

    public function delete(Facility $facility): bool
    {
        // If the passed facility object already shows attached items, throw immediately as tests expect
        $equipments = is_array($facility->equipments) ? $facility->equipments : (array) ($facility->equipments ?? []);
        $projects = is_array($facility->projects) ? $facility->projects : (array) ($facility->projects ?? []);
        if (count($equipments) > 0 || count($projects) > 0) {
            throw new \Exception("Facility cannot be deleted while Equipment or Projects are assigned.");
        }

        foreach ($this->facilities as $k => $f) {
            if (($f->facility_id ?? null) === ($facility->facility_id ?? null)) {
                unset($this->facilities[$k]);
                return true;
            }
        }

        return false;
    }
}
