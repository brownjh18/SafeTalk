<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Project;
use App\Repositories\Fake\FakeProjectRepository;
use Illuminate\Support\Str;

class ProjectBusinessRulesTest extends TestCase
{
    private FakeProjectRepository $repo;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repo = new FakeProjectRepository();
    }

    /** @test */
    public function it_requires_program_and_facility()
    {
        $project = new Project([
            'project_id' => Str::uuid(),
            'program_id' => '',
            'facility_id' => '',
            'name' => 'Solar Installation',
            'team_members' => ['Alice']
        ]);

        $this->expectExceptionMessage("Project.ProgramId and Project.FacilityId are required.");
        $this->repo->save($project);
    }

    /** @test */
    public function it_requires_at_least_one_team_member()
    {
        $project = new Project([
            'project_id' => Str::uuid(),
            'program_id' => 'P001',
            'facility_id' => 'F001',
            'name' => 'Irrigation System',
            'team_members' => []
        ]);

        $this->expectExceptionMessage("Project must have at least one team member assigned.");
        $this->repo->save($project);
    }

    /** @test */
    public function completed_projects_must_have_outcomes()
    {
        $project = new Project([
            'project_id' => Str::uuid(),
            'program_id' => 'P001',
            'facility_id' => 'F001',
            'name' => 'Tech Upgrade',
            'team_members' => ['Bob'],
            'status' => 'Completed',
            'outcomes' => []
        ]);

        $this->expectExceptionMessage("Completed project must have at least one documented outcome.");
        $this->repo->save($project);
    }

    /** @test */
    public function it_enforces_unique_project_name_within_program()
    {
        $p1 = new Project([
            'project_id' => Str::uuid(),
            'program_id' => 'P001',
            'facility_id' => 'F001',
            'name' => 'Research Lab',
            'team_members' => ['Alice']
        ]);

        $p2 = new Project([
            'project_id' => Str::uuid(),
            'program_id' => 'P001',
            'facility_id' => 'F002',
            'name' => 'research lab', // duplicate name, same program
            'team_members' => ['Bob']
        ]);

        $this->repo->save($p1);
        $this->expectExceptionMessage("A project with this name already exists in this program.");
        $this->repo->save($p2);
    }

    /** @test */
    public function it_checks_facility_compatibility_with_requirements()
    {
        $project = new Project([
            'project_id' => Str::uuid(),
            'program_id' => 'P002',
            'facility_id' => 'F001',
            'name' => 'Hydroponics',
            'team_members' => ['Charlie'],
            'requirements' => ['Electricity', 'WaterSupply'],
            'facility_capabilities' => ['WaterSupply'] // missing Electricity
        ]);

        $this->expectExceptionMessage("Project requirements not compatible with facility capabilities.");
        $this->repo->save($project);
    }

    /** @test */
    public function it_saves_project_successfully_when_all_rules_pass()
    {
        $project = new Project([
            'project_id' => Str::uuid(),
            'program_id' => 'P003',
            'facility_id' => 'F003',
            'name' => 'Solar Panels',
            'team_members' => ['Dave'],
            'status' => 'InProgress',
            'requirements' => ['Electricity'],
            'facility_capabilities' => ['Electricity']
        ]);

        $saved = $this->repo->save($project);

        $this->assertEquals('Solar Panels', $saved->name);
        $this->assertCount(1, $this->repo->all());
    }
}
