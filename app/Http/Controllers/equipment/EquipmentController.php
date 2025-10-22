<?php

namespace App\Http\Controllers\equipment;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Models\Facility;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EquipmentController extends Controller
{
    /**
     * Display a listing of equipment with optional filters.
     * Filters: facility_id, usage_domain, capability (LIKE), q for general search.
     */
    public function index(Request $request)
    {
        $query = Equipment::query();

        if ($facilityId = $request->query('facility_id')) {
            $query->where('facility_id', $facilityId);
        }

        if ($usage = $request->query('usage_domain')) {
            $query->where('usage_domain', $usage);
        }

        if ($capability = $request->query('capability')) {
            $query->where('capabilities', 'LIKE', "%{$capability}%");
        }

        if ($q = $request->query('q')) {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'LIKE', "%{$q}%")
                    ->orWhere('description', 'LIKE', "%{$q}%")
                    ->orWhere('inventory_code', 'LIKE', "%{$q}%");
            });
        }

        $equipment = $query->with('facility')->orderBy('name')->get()->map(function ($item) {
            return [
                'id' => $item->equipment_id,
                'name' => $item->name,
                'description' => $item->description,
                'facility' => [
                    'name' => $item->facility->name ?? 'No Facility',
                    'id' => $item->facility->facility_id ?? null,
                ],
                'capabilities' => $this->parseCapabilities($item->capabilities),
                'inventoryCode' => $item->inventory_code,
                'usageDomain' => $item->usage_domain,
                'supportPhase' => $item->support_phase,
                'availability' => 'available', // Default since not in model
                'projectCount' => 0, // Placeholder - would need relationship to projects
                'lastMaintenance' => now()->subDays(30)->toISOString(), // Placeholder
                'nextMaintenance' => now()->addDays(60)->toISOString(), // Placeholder
                'status' => 'active', // Default status since not in model
            ];
        });

        $usageDomains = Equipment::USAGE_DOMAINS;
        $supportPhases = Equipment::SUPPORT_PHASES;

        return Inertia::render('equipment', [
            'equipment' => $equipment,
            'usageDomains' => $usageDomains,
            'supportPhases' => $supportPhases
        ]);
    }

    /**
     * List all equipment at a specific facility.
     */
    public function byFacility(Facility $facility)
    {
        $equipment = Equipment::where('facility_id', $facility->facility_id)
            ->orderBy('name')
            ->get();

        $usageDomains = Equipment::USAGE_DOMAINS;
        $supportPhases = Equipment::SUPPORT_PHASES;
        $selectedFacilityId = $facility->facility_id;

        return view('equipment.index', compact('equipment', 'usageDomains', 'supportPhases', 'selectedFacilityId', 'facility'));
    }

    /**
     * Show the form for creating new equipment.
     */
    public function create(Request $request)
    {
        $prefillFacilityId = $request->query('facility_id');
        $usageDomains = Equipment::USAGE_DOMAINS;
        $supportPhases = Equipment::SUPPORT_PHASES;
        $facilities = Facility::orderBy('name')->get();

        return Inertia::render('equipment/create', [
            'prefillFacilityId' => $prefillFacilityId,
            'usageDomains' => $usageDomains,
            'supportPhases' => $supportPhases,
            'facilities' => $facilities
        ]);
    }

    /**
     * Store a newly created equipment record in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'facility_id' => 'required|string|exists:facilities,facility_id',
            'name' => 'required|string|max:255',
            'capabilities' => 'nullable|string',
            'description' => 'nullable|string',
            'inventory_code' => 'nullable|string|max:255',
            'usage_domain' => 'nullable|string|in:' . implode(',', Equipment::USAGE_DOMAINS),
            'support_phase' => 'nullable|string|in:' . implode(',', Equipment::SUPPORT_PHASES),
        ]);

        Equipment::create(['equipment_id' => (string) Str::uuid()] + $validated);

        return redirect()->route('equipment.index');
    }

    /**
     * Display the specified equipment details.
     */
    public function show(Equipment $equipment)
    {
        $facility = Facility::where('facility_id', $equipment->facility_id)->first();
        return view('equipment.show', compact('equipment', 'facility'));
    }

    /**
     * Show the form for editing equipment.
     */
    public function edit(Equipment $equipment)
    {
        $transformedEquipment = [
            'id' => $equipment->equipment_id,
            'name' => $equipment->name,
            'description' => $equipment->description,
            'facility_id' => $equipment->facility_id,
            'inventory_code' => $equipment->inventory_code,
            'usage_domain' => $equipment->usage_domain,
            'support_phase' => $equipment->support_phase,
            'capabilities' => $equipment->capabilities,
        ];

        $usageDomains = Equipment::USAGE_DOMAINS;
        $supportPhases = Equipment::SUPPORT_PHASES;
        $facilities = Facility::orderBy('name')->get()->map(function ($facility) {
            return [
                'facility_id' => $facility->facility_id,
                'name' => $facility->name,
                'location' => $facility->location,
            ];
        });

        return Inertia::render('equipment/edit', [
            'equipment' => $transformedEquipment,
            'usageDomains' => $usageDomains,
            'supportPhases' => $supportPhases,
            'facilities' => $facilities
        ]);
    }

    /**
     * Update the specified equipment in storage.
     */
    public function update(Request $request, Equipment $equipment)
    {
        $validated = $request->validate([
            'facility_id' => 'required|string|exists:facilities,facility_id',
            'name' => 'required|string|max:255',
            'capabilities' => 'nullable|string',
            'description' => 'nullable|string',
            'inventory_code' => 'nullable|string|max:255',
            'usage_domain' => 'nullable|string|in:' . implode(',', Equipment::USAGE_DOMAINS),
            'support_phase' => 'nullable|string|in:' . implode(',', Equipment::SUPPORT_PHASES),
        ]);

        $equipment->update($validated);

        return redirect()->route('equipment.index');
    }

    /**
     * Remove the specified equipment from storage with constraints.
     * Blocks deletion if tied to active projects at its facility.
     * Note: When a project-equipment linkage is introduced, update this check accordingly.
     */
    public function destroy(Equipment $equipment)
    {
        $hasActiveProjectsAtFacility = Project::where('facility_id', $equipment->facility_id)->exists();

        if ($hasActiveProjectsAtFacility) {
            return redirect()->route('equipment.index');
        }

        $equipment->delete();

        return redirect()->route('equipment.index');
    }

    /**
     * Parse capabilities string into array.
     */
    private function parseCapabilities(?string $capabilities): array
    {
        if (!$capabilities) {
            return [];
        }

        // Split by comma and clean up whitespace
        return array_map('trim', explode(',', $capabilities));
    }
}
