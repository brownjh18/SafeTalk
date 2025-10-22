<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Service;
use App\Repositories\Fake\FakeServiceRepository;
use Illuminate\Support\Str;
use Exception;

class ServiceBusinessRulesTest extends TestCase
{
    private FakeServiceRepository $repo;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repo = new FakeServiceRepository();
    }

    /** @test */
    public function it_requires_facility_name_category_and_skill_type()
    {
        $service = new Service([
            'service_id' => Str::uuid(),
            'facility_id' => '',
            'name' => '',
            'category' => '',
            'skill_type' => ''
        ]);

        $this->expectExceptionMessage("Service.FacilityId, Service.Name, Service.Category, and Service.SkillType are required.");
        $this->repo->save($service);
    }

    /** @test */
    public function it_enforces_unique_service_name_within_facility()
    {
        $s1 = new Service([
            'service_id' => Str::uuid(),
            'facility_id' => 'F001',
            'name' => 'Catering',
            'category' => 'Hospitality',
            'skill_type' => 'Food'
        ]);

        $s2 = new Service([
            'service_id' => Str::uuid(),
            'facility_id' => 'F001',
            'name' => 'catering', // case-insensitive duplicate
            'category' => 'Hospitality',
            'skill_type' => 'Food'
        ]);

        $this->repo->save($s1);
        $this->expectExceptionMessage("A service with this name already exists in this facility.");
        $this->repo->save($s2);
    }

    /** @test */
    public function it_allows_same_service_name_in_different_facilities()
    {
        $s1 = new Service([
            'service_id' => Str::uuid(),
            'facility_id' => 'F001',
            'name' => 'Cleaning',
            'category' => 'Maintenance',
            'skill_type' => 'Janitorial'
        ]);

        $s2 = new Service([
            'service_id' => Str::uuid(),
            'facility_id' => 'F002',
            'name' => 'Cleaning', // same name, different facility
            'category' => 'Maintenance',
            'skill_type' => 'Janitorial'
        ]);

        $this->repo->save($s1);
        $saved = $this->repo->save($s2);

        $this->assertEquals('Cleaning', $saved->name);
        $this->assertCount(2, $this->repo->all());
    }

    /** @test */
    public function it_prevents_deleting_service_used_in_projects()
    {
        $service = new Service([
            'service_id' => Str::uuid(),
            'facility_id' => 'F001',
            'name' => 'Training',
            'category' => 'Education',
            'skill_type' => 'Instructor'
        ]);
        $service->projects = [['name' => 'Project Alpha']];

        $this->expectExceptionMessage("Service in use by Project testing requirements.");
        $this->repo->delete($service);
    }

    /** @test */
    public function it_saves_service_successfully_when_all_rules_pass()
    {
        $service = new Service([
            'service_id' => Str::uuid(),
            'facility_id' => 'F001',
            'name' => 'Support',
            'category' => 'IT',
            'skill_type' => 'Tech'
        ]);

        $saved = $this->repo->save($service);

        $this->assertEquals('Support', $saved->name);
        $this->assertCount(1, $this->repo->all());
    }
}
