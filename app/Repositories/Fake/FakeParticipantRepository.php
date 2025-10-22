<?php

namespace App\Repositories\Fake;

use App\Models\Participant;
use Exception;

class FakeParticipantRepository
{
    private array $participants = [];

    public function all(): array
    {
        return $this->participants;
    }

    public function save(Participant $participant): Participant
    {
        // RequiredFields Rule
        if (empty($participant->full_name) || empty($participant->email) || empty($participant->affiliation)) {
            throw new Exception("Participant.FullName, Participant.Email, and Participant.Affiliation are required.");
        }

        // EmailUniqueness Rule (case-insensitive)
        foreach ($this->participants as $existing) {
            if (strcasecmp($existing->email, $participant->email) === 0) {
                throw new Exception("Participant.Email already exists.");
            }
        }

        // SpecializationRequirement Rule
        if (!empty($participant->cross_skill_trained) && $participant->cross_skill_trained === true) {
            if (empty($participant->specialization)) {
                throw new Exception("Cross-skill flag requires Specialization.");
            }
        }

        $this->participants[] = $participant;
        return $participant;
    }

    public function delete(Participant $participant): bool
    {
        foreach ($this->participants as $key => $existing) {
            if ($existing->id === $participant->id) {
                unset($this->participants[$key]);
                $this->participants = array_values($this->participants);
                return true;
            }
        }
        return false;
    }
}
