<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Participant;
use App\Repositories\Fake\FakeParticipantRepository;
use Illuminate\Support\Str;

class ParticipantBusinessRulesTest extends TestCase
{
    private FakeParticipantRepository $repo;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repo = new FakeParticipantRepository();
    }

    public function test_requires_full_name_email_and_affiliation()
    {
        $participant = new Participant([
            'participant_id' => Str::uuid(),
            'full_name' => '',
            'email' => '',
            'affiliation' => ''
        ]);

        $this->expectExceptionMessage(
            "Participant.FullName, Participant.Email, and Participant.Affiliation are required."
        );
        $this->repo->save($participant);
    }

    public function test_enforces_unique_email_case_insensitive()
    {
        $p1 = new Participant([
            'participant_id' => Str::uuid(),
            'full_name' => 'Alice Johnson',
            'email' => 'alice@example.com',
            'affiliation' => 'CS'
        ]);

        $p2 = new Participant([
            'participant_id' => Str::uuid(),
            'full_name' => 'Alice Smith',
            'email' => 'ALICE@EXAMPLE.COM', // duplicate email, different case
            'affiliation' => 'SE'
        ]);

        $this->repo->save($p1);

        $this->expectExceptionMessage("Participant.Email already exists.");
        $this->repo->save($p2);
    }

    public function test_cross_skill_trained_requires_specialization()
    {
        $participant = new Participant([
            'participant_id' => Str::uuid(),
            'full_name' => 'Bob Williams',
            'email' => 'bob@example.com',
            'affiliation' => 'Engineering',
            'cross_skill_trained' => true,
            'specialization' => '' // missing
        ]);

        $this->expectExceptionMessage("Cross-skill flag requires Specialization.");
        $this->repo->save($participant);
    }

    public function test_saves_participant_successfully_when_all_rules_pass()
    {
        $participant = new Participant([
            'participant_id' => Str::uuid(),
            'full_name' => 'Carol King',
            'email' => 'carol@example.com',
            'affiliation' => 'CS',
            'cross_skill_trained' => true,
            'specialization' => 'Data Science'
        ]);

        $saved = $this->repo->save($participant);

        $this->assertEquals('Carol King', $saved->full_name);
        $this->assertCount(1, $this->repo->all());
    }
}
