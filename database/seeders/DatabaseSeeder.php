<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Program;
use App\Models\Project;
use App\Models\Facility;
use App\Models\Equipment;
use App\Models\Service;
use App\Models\Participant;
use App\Models\Outcome;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'email_verified_at' => now(),
        ]);

        // Create additional users
        User::factory()->create([
            'name' => 'Dr. Sarah Nakacwa',
            'email' => 'sarah.nakacwa@mak.ac.ug',
            'email_verified_at' => now(),
        ]);

        User::factory()->create([
            'name' => 'Prof. John Ssekitoleko',
            'email' => 'john.ssekitoleko@mak.ac.ug',
            'email_verified_at' => now(),
        ]);

        // Create facilities
        $facilities = [
            [
                'facility_id' => 'FAC-001',
                'name' => 'Makerere University Innovation Lab',
                'location' => 'Kampala, Uganda',
                'description' => 'State-of-the-art innovation laboratory equipped with modern prototyping and testing equipment',
                'partner_organization' => 'Makerere University',
                'facility_type' => 'Lab',
                'capabilities' => '3D Printing, CNC Machining, Electronics Testing, IoT Development, CAD/CAM',
            ],
            [
                'facility_id' => 'FAC-002',
                'name' => 'Agricultural Research Center',
                'location' => 'Wakiso, Uganda',
                'description' => 'Specialized facility for agricultural technology research and precision farming solutions',
                'partner_organization' => 'National Agricultural Research Organization (NARO)',
                'facility_type' => 'Research Center',
                'capabilities' => 'Precision Agriculture, Sensor Technology, Data Analytics, Drone Technology, Greenhouse Systems',
            ],
            [
                'facility_id' => 'FAC-003',
                'name' => 'National ICT Innovation Hub',
                'location' => 'Kampala, Uganda',
                'description' => 'Government facility dedicated to digital transformation and e-governance solutions',
                'partner_organization' => 'Ministry of ICT and National Guidance',
                'facility_type' => 'Testing Center',
                'capabilities' => 'Software Testing, Digital Services, Cybersecurity, Cloud Computing, AI/ML Development',
            ],
        ];

        foreach ($facilities as $facility) {
            Facility::create($facility);
        }

        // Create programs
        $programs = [
            [
                'program_id' => 'PRG-001',
                'name' => 'Digital Health Innovation Program',
                'description' => 'Developing digital solutions for healthcare delivery in rural Uganda',
                'national_alignment' => 'NDPIII Health Sector Priority',
                'focus_areas' => 'Telemedicine, Health Information Systems, Medical IoT',
                'phases' => 'Research → Prototype → Pilot → Scale',
            ],
            [
                'program_id' => 'PRG-002',
                'name' => 'Smart Agriculture Initiative',
                'description' => 'IoT and AI solutions for precision farming and food security',
                'national_alignment' => 'NDPIII Agriculture Modernization',
                'focus_areas' => 'Precision Agriculture, Supply Chain, Market Access',
                'phases' => 'Concept → Development → Testing → Commercialization',
            ],
            [
                'program_id' => 'PRG-003',
                'name' => 'Digital Government Services',
                'description' => 'E-governance solutions for improved public service delivery',
                'national_alignment' => 'Digital Transformation Roadmap',
                'focus_areas' => 'E-Services, Digital Identity, Service Automation',
                'phases' => 'Assessment → Design → Implementation → Optimization',
            ],
        ];

        foreach ($programs as $program) {
            Program::create($program);
        }

        // Create participants
        $participants = [
            [
                'participant_id' => 'PRT-001',
                'full_name' => 'Dr. Sarah Nakacwa',
                'email' => 'sarah.nakacwa@mak.ac.ug',
                'affiliation' => 'Computer Science',
                'specialization' => 'Software Engineering',
                'participant_type' => 'Lecturer',
                'cross_skill_trained' => true,
                'institution' => 'Makerere University',
            ],
            [
                'participant_id' => 'PRT-002',
                'full_name' => 'John Ssekitoleko',
                'email' => 'john.ssekitoleko@student.mak.ac.ug',
                'affiliation' => 'Software Engineering',
                'specialization' => 'Mobile Development',
                'participant_type' => 'Student',
                'cross_skill_trained' => false,
                'institution' => 'Makerere University',
            ],
            [
                'participant_id' => 'PRT-003',
                'full_name' => 'Mary Nantongo',
                'email' => 'mary.nantongo@kiira.co.ug',
                'affiliation' => 'Electrical Engineering',
                'specialization' => 'Embedded Systems',
                'participant_type' => 'Collaborator',
                'cross_skill_trained' => true,
                'institution' => 'Kiira Motors Corporation',
            ],
            [
                'participant_id' => 'PRT-004',
                'full_name' => 'Prof. David Lubega',
                'email' => 'david.lubega@ict.go.ug',
                'affiliation' => 'Computer Science',
                'specialization' => 'AI/ML',
                'participant_type' => 'Collaborator',
                'cross_skill_trained' => true,
                'institution' => 'Ministry of ICT',
            ],
        ];

        foreach ($participants as $participant) {
            Participant::create($participant);
        }

        // Create projects
        $projects = [
            [
                'project_id' => 'PRJ-001',
                'program_id' => 'PRG-001',
                'facility_id' => 'FAC-001',
                'title' => 'Telemedicine Platform for Rural Health Centers',
                'description' => 'Mobile-first telemedicine solution connecting rural patients with urban specialists',
                'nature_of_project' => 'Applied Research',
                'innovation_focus' => 'Healthcare Technology, Mobile Applications',
                'prototype_stage' => 'Pilot Testing',
                'testing_requirements' => 'User acceptance testing in 5 rural health centers',
                'commercialization_plan' => 'Scale to 50 health centers across Uganda',
            ],
            [
                'project_id' => 'PRJ-002',
                'program_id' => 'PRG-002',
                'facility_id' => 'FAC-002',
                'title' => 'Smart Irrigation System for Smallholder Farmers',
                'description' => 'IoT-based precision irrigation system using soil moisture sensors and weather data',
                'nature_of_project' => 'Prototype Development',
                'innovation_focus' => 'IoT, Precision Agriculture, Data Analytics',
                'prototype_stage' => 'Development',
                'testing_requirements' => 'Field testing with 20 smallholder farmers',
                'commercialization_plan' => 'Commercial partnership with agricultural cooperatives',
            ],
            [
                'project_id' => 'PRJ-003',
                'program_id' => 'PRG-003',
                'facility_id' => 'FAC-003',
                'title' => 'E-Government Service Portal',
                'description' => 'Unified digital platform for government service delivery and citizen engagement',
                'nature_of_project' => 'Research',
                'innovation_focus' => 'E-Governance, Digital Identity, Service Design',
                'prototype_stage' => 'Concept',
                'testing_requirements' => 'Usability testing with government officials',
                'commercialization_plan' => 'National rollout to all government agencies',
            ],
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }

        // Create equipment
        $equipment = [
            [
                'equipment_id' => 'EQ-001',
                'facility_id' => 'FAC-001',
                'name' => 'Ultimaker S5 3D Printer',
                'description' => 'Professional FDM 3D printer with dual extrusion and large build volume',
                'inventory_code' => '3DP-001',
                'usage_domain' => 'Mechanical',
                'support_phase' => 'Prototyping',
                'capabilities' => '3D Printing, Dual Extrusion, Large Scale Printing, ABS/PLA/PETG Materials',
            ],
            [
                'equipment_id' => 'EQ-002',
                'facility_id' => 'FAC-001',
                'name' => 'CNC Router Machine',
                'description' => 'Precision CNC router for wood, plastic, and soft metal machining',
                'inventory_code' => 'CNC-002',
                'usage_domain' => 'Mechanical',
                'support_phase' => 'Prototyping',
                'capabilities' => 'CNC Machining, 2.5D Milling, Wood/Plastic/Metal, CAD/CAM Integration',
            ],
            [
                'equipment_id' => 'EQ-003',
                'facility_id' => 'FAC-002',
                'name' => 'IoT Development Kit',
                'description' => 'Comprehensive IoT development platform with sensors, microcontrollers, and connectivity modules',
                'inventory_code' => 'IOT-003',
                'usage_domain' => 'IoT',
                'support_phase' => 'Training',
                'capabilities' => 'IoT Development, Sensor Integration, Wireless Communication, Data Logging',
            ],
            [
                'equipment_id' => 'EQ-004',
                'facility_id' => 'FAC-001',
                'name' => 'Digital Oscilloscope',
                'description' => 'High-precision digital oscilloscope for electronic circuit testing and analysis',
                'inventory_code' => 'OSC-004',
                'usage_domain' => 'Electronics',
                'support_phase' => 'Testing',
                'capabilities' => 'Circuit Testing, Signal Analysis, Protocol Decoding, Data Logging',
            ],
        ];

        foreach ($equipment as $item) {
            Equipment::create($item);
        }

        // Create services
        $services = [
            [
                'service_id' => 'SRV-001',
                'facility_id' => 'FAC-001',
                'name' => '3D Printing & Prototyping',
                'description' => 'Professional 3D printing services for rapid prototyping and product development',
                'category' => 'Prototyping',
                'skill_type' => 'Hardware',
            ],
            [
                'service_id' => 'SRV-002',
                'facility_id' => 'FAC-001',
                'name' => 'CNC Machining Services',
                'description' => 'Precision CNC machining for mechanical components and custom parts',
                'category' => 'Machining',
                'skill_type' => 'Hardware',
            ],
            [
                'service_id' => 'SRV-003',
                'facility_id' => 'FAC-002',
                'name' => 'IoT Development Training',
                'description' => 'Comprehensive training on IoT development, sensor integration, and data analytics',
                'category' => 'Training',
                'skill_type' => 'Integration',
            ],
            [
                'service_id' => 'SRV-004',
                'facility_id' => 'FAC-003',
                'name' => 'Software Testing & QA',
                'description' => 'Professional software testing, quality assurance, and validation services',
                'category' => 'Testing',
                'skill_type' => 'Software',
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }

        // Create outcomes
        $outcomes = [
            [
                'outcome_id' => 'OUT-001',
                'project_id' => 'PRJ-001',
                'title' => 'Telemedicine Mobile App',
                'description' => 'Mobile application for remote patient monitoring and health data collection',
                'outcome_type' => 'Software',
                'quality_certification' => 'ISO 13485',
                'commercialization_status' => 'Launched',
            ],
            [
                'outcome_id' => 'OUT-002',
                'project_id' => 'PRJ-002',
                'title' => 'Smart Irrigation Controller',
                'description' => 'IoT-based irrigation controller with soil moisture sensors and automated valve control',
                'outcome_type' => 'Prototype',
                'quality_certification' => 'CE Mark',
                'commercialization_status' => 'Market Linked',
            ],
            [
                'outcome_id' => 'OUT-003',
                'project_id' => 'PRJ-003',
                'title' => 'E-Government Service Design',
                'description' => 'Design specifications and user experience guidelines for government service portal',
                'outcome_type' => 'Report',
                'quality_certification' => null,
                'commercialization_status' => 'Demoed',
            ],
        ];

        foreach ($outcomes as $outcome) {
            Outcome::create($outcome);
        }

        // Assign participants to projects
        $participantProjectAssignments = [
            ['participant_id' => 'PRT-001', 'project_id' => 'PRJ-001'],
            ['participant_id' => 'PRT-002', 'project_id' => 'PRJ-001'],
            ['participant_id' => 'PRT-003', 'project_id' => 'PRJ-002'],
            ['participant_id' => 'PRT-004', 'project_id' => 'PRJ-003'],
        ];

        foreach ($participantProjectAssignments as $assignment) {
            $participant = Participant::where('participant_id', $assignment['participant_id'])->first();
            $project = Project::where('project_id', $assignment['project_id'])->first();
            if ($participant && $project) {
                $participant->projects()->attach($project->id);
            }
        }
    }
}
