<?php

namespace App\Repositories\Fake;

use App\Models\Service;
use Exception;

class FakeServiceRepository
{
    private array $services = [];

    public function all(): array
    {
        return $this->services;
    }

    public function save(Service $service): Service
    {
        // RequiredFields Rule
        if (empty($service->service_id) || empty($service->name) || empty($service->category) || empty($service->skill_type) || empty($service->facility_id)) {
            throw new Exception("Service.FacilityId, Service.Name, Service.Category, and Service.SkillType are required.");
        }

        // ScopedUniqueness Rule
        foreach ($this->services as $existing) {
            if (
                ($existing->facility_id ?? null) === ($service->facility_id ?? null) &&
                strcasecmp(($existing->name ?? ''), ($service->name ?? '')) === 0
            ) {
                throw new Exception("A service with this name already exists in this facility.");
            }
        }

        $this->services[] = $service;
        return $service;
    }

    public function delete(Service $service): bool
    {
        // DeleteGuard Rule
        if (!empty($service->projects) && count((array)$service->projects) > 0) {
            throw new Exception("Service in use by Project testing requirements.");
        }

        foreach ($this->services as $key => $existing) {
            if (($existing->service_id ?? null) === ($service->service_id ?? null)) {
                unset($this->services[$key]);
                $this->services = array_values($this->services);
                return true;
            }
        }

        return false;
    }
}
