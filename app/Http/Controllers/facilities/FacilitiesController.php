<?php

namespace App\Http\Controllers\facilities;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use App\Models\Project;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class FacilitiesController extends Controller
{
    /**
     * Display a listing of the facilities with optional filters.
     * Filters: type (facility_type), partner (partner_organization), capability (LIKE in capabilities).
     */
    public function index(Request $request)
    {
        $query = Facility::query();

        if ($type = $request->query('type')) {
            $query->where('facility_type', $type);
        }

        if ($partner = $request->query('partner')) {
            $query->where('partner_organization', $partner);
        }

        if ($capability = $request->query('capability')) {
            $query->where('capabilities', 'LIKE', "%{$capability}%");
        }

        // Optional general text search across name, location, description
        if ($q = $request->query('q')) {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'LIKE', "%{$q}%")
                    ->orWhere('location', 'LIKE', "%{$q}%")
                    ->orWhere('description', 'LIKE', "%{$q}%")
                    ->orWhere('partner_organization', 'LIKE', "%{$q}%");
            });
        }

        $facilities = $query->orderBy('name')->get()->map(function ($facility) {
            return [
                'id' => $facility->facility_id,
                'name' => $facility->name,
                'location' => $facility->location,
                'description' => $facility->description,
                'partnerOrganization' => $facility->partner_organization,
                'facilityType' => $facility->facility_type,
                'capabilities' => $this->parseCapabilities($facility->capabilities),
                'serviceCount' => $facility->services()->count(),
                'equipmentCount' => $facility->equipment()->count(),
                'projectCount' => $facility->projects()->count(),
                'contactEmail' => 'contact@' . strtolower(str_replace(' ', '', $facility->partner_organization ?? $facility->name)) . '.ug',
                'contactPhone' => '+256-XXX-XXXXX', // Placeholder since not in model
                'website' => null, // Placeholder since not in model
                'status' => 'active', // Default status since not in model
            ];
        });

        $types = Facility::FACILITY_TYPES;
        $partners = Facility::query()
            ->select('partner_organization')
            ->whereNotNull('partner_organization')
            ->distinct()
            ->orderBy('partner_organization')
            ->pluck('partner_organization');

        return Inertia::render('facilities', [
            'facilities' => $facilities,
            'types' => $types,
            'partners' => $partners
        ]);
    }

    /**
     * Show the form for creating a new facility.
     */
    public function create()
    {
        $types = Facility::FACILITY_TYPES;
        return Inertia::render('facilities/create', [
            'types' => $types
        ]);
    }

    /**
     * Store a newly created facility in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:facilities,name,NULL,facility_id,location,' . $request->input('location'),
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',
            'partner_organization' => 'nullable|string|max:255',
            'facility_type' => 'required|string|in:' . implode(',', Facility::FACILITY_TYPES),
            'capabilities' => 'nullable|string', // comma-separated or free text
        ]);

        $facility = Facility::create(['facility_id' => (string) Str::uuid()] + $validated);

        // Check Capabilities
        if (($facility->services()->exists() || $facility->equipment()->exists()) && empty($validated['capabilities'])) {
            return redirect()->back()->withErrors(['capabilities' => 'Facility.Capabilities must be populated when Services/Equipment exist.']);
        }

        return redirect()->route('facilities.index');
    }

    /**
     * Display the specified facility.
     */
    public function show(Facility $facility)
    {
        $projectsCount = Project::where('facility_id', $facility->facility_id)->count();
        $servicesCount = Service::where('facility_id', $facility->facility_id)->count();

        return view('facilities.show', compact('facility', 'projectsCount', 'servicesCount'));
    }

    /**
     * Show the form for editing the specified facility.
     */
    public function edit(Facility $facility)
    {
        $transformedFacility = [
            'id' => $facility->facility_id,
            'name' => $facility->name,
            'location' => $facility->location,
            'description' => $facility->description,
            'partner_organization' => $facility->partner_organization,
            'facility_type' => $facility->facility_type,
            'capabilities' => $facility->capabilities,
        ];

        $types = Facility::FACILITY_TYPES;
        return Inertia::render('facilities/edit', [
            'facility' => $transformedFacility,
            'types' => $types
        ]);
    }

    /**
     * Update the specified facility in storage.
     */
    public function update(Request $request, Facility $facility)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:facilities,name,' . $facility->facility_id . ',facility_id',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',
            'partner_organization' => 'nullable|string|max:255',
            'facility_type' => 'required|string|in:' . implode(',', Facility::FACILITY_TYPES),
            'capabilities' => 'nullable|string',
        ]);

        $facility->update($validated);

        // Check Capabilities
        if (($facility->services()->exists() || $facility->equipment()->exists()) && empty($validated['capabilities'])) {
            return redirect()->back()->withErrors(['capabilities' => 'Facility.Capabilities must be populated when Services/Equipment exist.']);
        }

        return redirect()->route('facilities.index');
    }

    /**
     * Remove the specified facility from storage with safeguards if linked records exist.
     */
    public function destroy(Facility $facility)
    {
        $hasProjects = Project::where('facility_id', $facility->facility_id)->exists();
        $hasServices = Service::where('facility_id', $facility->facility_id)->exists();
        $hasEquipment = $facility->equipment()->exists();

        if ($hasProjects || $hasServices || $hasEquipment) {
            $message = 'Cannot delete facility because it is linked to existing ';
            $links = [];
            if ($hasProjects) $links[] = 'projects';
            if ($hasServices) $links[] = 'services';
            if ($hasEquipment) $links[] = 'equipment';
            $message .= implode(' and ', $links) . '.';

            return redirect()->route('facilities.index')->withErrors(['facility' => $message]);
        }

        $facility->delete();

        return redirect()->route('facilities.index');
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
