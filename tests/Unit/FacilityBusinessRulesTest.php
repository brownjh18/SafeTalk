<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Facility;
use App\Repositories\Fake\FakeFacilityRepository;
use Illuminate\Support\Str;
use Exception;

class FacilityBusinessRulesTest extends TestCase
{
    private FakeFacilityRepository $repo;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repo = new FakeFacilityRepository();
    }

    /** @test */
    public function it_requires_name_location_and_manager()
    {
        $facility = new Facility([
            'facility_id' => Str::uuid(),
            'name' => '',
            'location' => '',
            'manager_name' => ''
        ]);

        $this->expectExceptionMessage("Facility.Name, Facility.Location, and Facility.ManagerName are required.");
        $this->repo->save($facility);
    }

    /** @test */
    public function it_enforces_unique_facility_name_case_insensitive()
    {
        $f1 = new Facility([
            'facility_id' => Str::uuid(),
            'name' => 'Innovation Center',
            'location' => 'Kampala',
            'manager_name' => 'John Doe'
        ]);

        $f2 = new Facility([
            'facility_id' => Str::uuid(),
            'name' => 'innovation center',
            'location' => 'Mbarara',
            'manager_name' => 'Jane Doe'
        ]);

        $this->repo->save($f1);
        $this->expectExceptionMessage("Facility.Name already exists.");
        $this->repo->save($f2);
    }

    /** @test */
    public function it_requires_capacity_to_be_positive()
    {
        $facility = new Facility([
            'facility_id' => Str::uuid(),
            'name' => 'Tech Hub',
            'location' => 'Jinja',
            'manager_name' => 'James Okello',
            'capacity' => 0
        ]);

        $this->expectExceptionMessage("Facility.Capacity must be greater than zero.");
        $this->repo->save($facility);
    }

    /** @test */
    public function it_requires_valid_program_if_specified()
    {
        $facility = new Facility([
            'facility_id' => Str::uuid(),
            'name' => 'Science Lab',
            'location' => 'Entebbe',
            'manager_name' => 'Dr. Maria',
            'program_id' => '' // invalid
        ]);

        $this->expectExceptionMessage("Facility.ProgramId must be valid when specified.");
        $this->repo->save($facility);
    }

    /** @test */
    public function it_cannot_delete_facility_with_equipment_or_projects()
    {
        $facility = new Facility([
            'facility_id' => Str::uuid(),
            'name' => 'Fabrication Lab',
            'location' => 'Soroti',
            'manager_name' => 'Robert'
        ]);
        $facility->equipments = [['name' => '3D Printer']];
        $facility->projects = [['name' => 'Green Growth Project']];

        $this->expectExceptionMessage("Facility cannot be deleted while Equipment or Projects are assigned.");
        $this->repo->delete($facility);
    }

    /** @test */
    public function it_saves_facility_successfully_when_all_rules_pass()
    {
        $facility = new Facility([
            'facility_id' => Str::uuid(),
            'name' => 'Innovation Lab',
            'location' => 'Gulu',
            'manager_name' => 'Sarah',
            'capacity' => 25
        ]);

        $saved = $this->repo->save($facility);

        $this->assertEquals('Innovation Lab', $saved->name);
        $this->assertCount(1, $this->repo->all());
    }
}
