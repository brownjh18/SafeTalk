<?php

namespace App\Repositories\Fake;

use App\Models\Equipment;

class FakeEquipmentRepository
{
    private array $equipments = [];

    public function all(): array
    {
        return array_values($this->equipments);
    }

    public function save(Equipment $equipment): Equipment
    {
        // RequiredFields Rule
        if (empty($equipment->facility_id) || empty($equipment->name) || empty($equipment->inventory_code)) {
            throw new \Exception("Equipment.FacilityId, Equipment.Name, and Equipment.InventoryCode are required.");
        }

        // EmailUniqueness/InventoryCode uniqueness (case-insensitive)
        foreach ($this->equipments as $existing) {
            if (isset($existing->inventory_code) && strcasecmp($existing->inventory_code, $equipment->inventory_code) === 0) {
                throw new \Exception("Equipment.InventoryCode already exists.");
            }
        }

        // Electronics special rule
        if (isset($equipment->usage_domain) && strcasecmp($equipment->usage_domain, 'Electronics') === 0) {
            $supports = is_array($equipment->support_phase) ? $equipment->support_phase : (array) ($equipment->support_phase ?? []);
            $lower = array_map('strtolower', $supports);
            if (!in_array('prototyping', $lower) && !in_array('testing', $lower)) {
                throw new \Exception("Electronics equipment must support Prototyping or Testing.");
            }
        }

        $key = isset($equipment->equipment_id) ? (string) $equipment->equipment_id : (string) spl_object_id($equipment);
        $this->equipments[$key] = $equipment;
        return $equipment;
    }

    public function delete(Equipment $equipment): bool
    {
        // If the passed equipment object indicates it's referenced by an active project, throw immediately
        if (!empty($equipment->active_project)) {
            throw new \Exception("Equipment referenced by active Project.");
        }

        foreach ($this->equipments as $k => $e) {
            if (($e->equipment_id ?? null) === ($equipment->equipment_id ?? null)) {
                unset($this->equipments[$k]);
                return true;
            }
        }
        return false;
    }
}
