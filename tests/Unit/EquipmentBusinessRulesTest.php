<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Equipment;
use App\Repositories\Fake\FakeEquipmentRepository;
use Illuminate\Support\Str;
use Exception;

class EquipmentBusinessRulesTest extends TestCase
{
    private FakeEquipmentRepository $repo;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repo = new FakeEquipmentRepository();
    }

    /** @test */
    public function it_requires_facility_name_and_inventory_code()
    {
        $equipment = new Equipment([
            'equipment_id' => Str::uuid()->toString(),
            'facility_id' => null,
            'name' => null,
            'inventory_code' => null,
        ]);

        $this->expectExceptionMessage("Equipment.FacilityId, Equipment.Name, and Equipment.InventoryCode are required.");
        $this->repo->save($equipment);
    }

    /** @test */
    public function it_enforces_unique_inventory_code()
    {
        $e1 = new Equipment([
            'equipment_id' => Str::uuid(),
            'facility_id' => 'FAC-001',
            'name' => '3D Printer',
            'inventory_code' => 'EQ-100',
        ]);

        $e2 = new Equipment([
            'equipment_id' => Str::uuid(),
            'facility_id' => 'FAC-002',
            'name' => 'Laser Cutter',
            'inventory_code' => 'EQ-100',
        ]);

        $this->repo->save($e1);
        $this->expectExceptionMessage("Equipment.InventoryCode already exists.");
        $this->repo->save($e2);
    }

    /** @test */
    public function electronics_equipment_must_support_prototyping_or_testing()
    {
        $equipment = new Equipment([
            'equipment_id' => Str::uuid(),
            'facility_id' => 'FAC-003',
            'name' => 'Oscilloscope',
            'inventory_code' => 'EQ-300',
            'usage_domain' => 'Electronics',
            'support_phase' => ['Training']
        ]);

        $this->expectExceptionMessage("Electronics equipment must support Prototyping or Testing.");
        $this->repo->save($equipment);
    }

    /** @test */
    public function it_cannot_delete_equipment_linked_to_active_project()
    {
        $equipment = new Equipment([
            'equipment_id' => Str::uuid(),
            'facility_id' => 'FAC-004',
            'name' => 'CNC Machine',
            'inventory_code' => 'EQ-400',
        ]);

        // Simulate active project
        $equipment->active_project = ['Project A'];

        $this->expectExceptionMessage("Equipment referenced by active Project.");
        $this->repo->delete($equipment);
    }

    /** @test */
    public function it_saves_equipment_successfully_when_rules_pass()
    {
        $equipment = new Equipment([
            'equipment_id' => Str::uuid(),
            'facility_id' => 'FAC-005',
            'name' => 'Lathe Machine',
            'inventory_code' => 'EQ-500',
            'usage_domain' => 'Mechanical',
            'support_phase' => ['Prototyping']
        ]);

        $saved = $this->repo->save($equipment);

        $this->assertEquals('Lathe Machine', $saved->name);
        $this->assertCount(1, $this->repo->all());
    }
}
