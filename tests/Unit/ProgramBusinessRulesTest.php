<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Program;
use App\Repositories\Fake\FakeProgramRepository;
use Illuminate\Support\Str;
use Exception;

class ProgramBusinessRulesTest extends TestCase
{
    private FakeProgramRepository $repo;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repo = new FakeProgramRepository();
    }

    /** @test */
    public function it_requires_a_name_and_description()
    {
        $program = new Program([
            'program_id' => Str::uuid()->toString(),
            'name' => '',
            'description' => ''
        ]);

        $this->expectExceptionMessage('Program.Name is required.');
        $this->repo->save($program);
    }

    /** @test */
    public function it_enforces_unique_name_case_insensitive()
    {
        $p1 = new Program(['program_id' => Str::uuid(), 'name' => 'AgriTech', 'description' => 'Test']);
        $p2 = new Program(['program_id' => Str::uuid(), 'name' => 'agritech', 'description' => 'Duplicate']);

        $this->repo->save($p1);
        $this->expectExceptionMessage('Program.Name already exists.');
        $this->repo->save($p2);
    }

    /** @test */
    public function it_requires_alignment_when_focus_areas_are_present()
    {
        $program = new Program([
            'program_id' => Str::uuid(),
            'name' => 'AI Research',
            'description' => 'Program with focus areas',
            'focus_areas' => ['AI'],
            'national_alignment' => []
        ]);

        $this->expectExceptionMessage('Program.NationalAlignment must include at least one recognized alignment when FocusAreas are specified.');
        $this->repo->save($program);
    }

    /** @test */
    public function it_cannot_delete_if_it_has_projects()
    {
        $program = new Program([
            'program_id' => Str::uuid(),
            'name' => 'Green Energy',
            'description' => 'Has projects',
        ]);
        $program->projects = [['name' => 'Solar Initiative']];

        $this->expectExceptionMessage('Program has Projects; archive or reassign before delete.');
        $this->repo->delete($program);
    }

    /** @test */
    public function it_saves_successfully_when_all_rules_pass()
    {
        $program = new Program([
            'program_id' => Str::uuid(),
            'name' => 'Clean Water Initiative',
            'description' => 'Safe water supply project',
            'focus_areas' => [],
            'national_alignment' => []
        ]);

        $saved = $this->repo->save($program);

        $this->assertEquals('Clean Water Initiative', $saved->name);
        $this->assertCount(1, $this->repo->all());
    }
}
