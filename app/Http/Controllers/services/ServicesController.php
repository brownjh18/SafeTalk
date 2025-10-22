<?php

namespace App\Http\Controllers\services;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ServicesController extends Controller
{
    /**
     * Display a listing of services with optional filters.
     * Supports filtering by facility_id and category.
     */
    public function index(Request $request)
    {
        $query = Service::query();

        if ($facilityId = $request->query('facility_id')) {
            $query->where('facility_id', $facilityId);
        }

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        $services = $query->with('facility')->orderBy('name')->get()->map(function ($service) {
            return [
                'id' => $service->service_id,
                'name' => $service->name,
                'description' => $service->description,
                'facility' => [
                    'name' => $service->facility->name ?? 'No Facility',
                    'id' => $service->facility->facility_id ?? null,
                ],
                'category' => $service->category,
                'skillType' => $service->skill_type,
                'duration' => '2-4 weeks', // Placeholder since not in model
                'capacity' => 10, // Placeholder since not in model
                'availability' => 'available', // Default since not in model
                'projectCount' => 0, // Placeholder - would need relationship to projects
                'status' => 'active', // Default status since not in model
            ];
        });

        return Inertia::render('services', [
            'services' => $services
        ]);
    }

    /**
     * Show the form for creating a new service under a facility.
     */
    public function create(Request $request)
    {
        $prefillFacilityId = $request->query('facility_id');
        $categories = Service::CATEGORIES;
        $skillTypes = Service::SKILL_TYPES;
        return Inertia::render('services/create', [
            'prefillFacilityId' => $prefillFacilityId,
            'categories' => $categories,
            'skillTypes' => $skillTypes
        ]);
    }

    /**
     * Store a newly created service in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'facility_id' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|in:' . implode(',', Service::CATEGORIES),
            'skill_type' => 'required|string|in:' . implode(',', Service::SKILL_TYPES),
        ]);

        Service::create(['service_id' => (string) Str::uuid()] + $validated);

        return redirect()->route('services.index');
    }

    /**
     * Show the form for editing the specified service.
     */
    public function edit(Service $service)
    {
        $transformedService = [
            'id' => $service->service_id,
            'name' => $service->name,
            'description' => $service->description,
            'facility_id' => $service->facility_id,
            'category' => $service->category,
            'skill_type' => $service->skill_type,
        ];

        $categories = Service::CATEGORIES;
        $skillTypes = Service::SKILL_TYPES;
        return Inertia::render('services/edit', [
            'service' => $transformedService,
            'categories' => $categories,
            'skillTypes' => $skillTypes
        ]);
    }

    /**
     * Update the specified service in storage.
     */
    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'facility_id' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|in:' . implode(',', Service::CATEGORIES),
            'skill_type' => 'required|string|in:' . implode(',', Service::SKILL_TYPES),
        ]);

        $service->update($validated);

        return redirect()->route('services.index');
    }

    /**
     * Remove the specified service from storage.
     */
    public function destroy(Service $service)
    {
        $service->delete();
        return redirect()->route('services.index');
    }
}
