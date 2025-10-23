<?php


namespace App\Http\Controllers\Programs;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProgramController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $programs = Program::withCount('projects')->get()->map(function ($program) {
            return [
                'id' => $program->program_id,
                'name' => $program->name,
                'description' => $program->description,
                'nationalAlignment' => $program->national_alignment,
                'focusAreas' => $program->focus_areas,
                'phases' => $program->phases,
                'projectCount' => $program->projects_count,
                'status' => 'active', // Default status since it's not in the model
            ];
        });

        return Inertia::render('programs', [
            'programs' => $programs
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('programs/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:programs,name',
            'description' => 'required|string',
            'national_alignment' => 'nullable|string',
            'focus_areas' => 'nullable|string',
            'phases' => 'nullable|string',
        ]);

        // Custom validation for National Alignment
        if (!empty($validated['focus_areas']) && empty($validated['national_alignment'])) {
            return redirect()->back()->withErrors(['national_alignment' => 'Program NationalAlignment must include at least one recognized alignment when FocusAreas are specified.']);
        }

        if (!empty($validated['national_alignment'])) {
            $validAlignments = ['NDPIII', 'DigitalRoadmap2023_2028', '4IR'];
            $alignments = explode(',', $validated['national_alignment']);
            foreach ($alignments as $alignment) {
                if (!in_array(trim($alignment), $validAlignments)) {
                    return redirect()->back()->withErrors(['national_alignment' => 'Program NationalAlignment must include at least one recognized alignment when FocusAreas are specified.']);
                }
            }
        }

        Program::create([
            'program_id' => (string) Str::uuid(),
        ] + $validated);

        return redirect()->route('programs.index');
    }


    public function show(Program $program)
    {
        return view('programs.show', compact('program'));
    }

    public function edit(Program $program)
    {
        $transformedProgram = [
            'id' => $program->program_id,
            'name' => $program->name,
            'description' => $program->description,
            'nationalAlignment' => $program->national_alignment,
            'focusAreas' => $program->focus_areas,
            'phases' => $program->phases,
            'status' => 'active', // Default status since it's not in the model
        ];

        return Inertia::render('programs/edit', [
            'program' => $transformedProgram
        ]);
    }

    public function update(Request $request, Program $program)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:programs,name,' . $program->program_id . ',program_id',
            'description' => 'required|string',
            'national_alignment' => 'nullable|string',
            'focus_areas' => 'nullable|string',
            'phases' => 'nullable|string',
        ]);

        // Custom validation for National Alignment
        if (!empty($validated['focus_areas']) && empty($validated['national_alignment'])) {
            return redirect()->back()->withErrors(['national_alignment' => 'Program NationalAlignment must include at least one recognized alignment when FocusAreas are specified.']);
        }

        if (!empty($validated['national_alignment'])) {
            $validAlignments = ['NDPIII', 'DigitalRoadmap2023_2028', '4IR'];
            $alignments = explode(',', $validated['national_alignment']);
            foreach ($alignments as $alignment) {
                if (!in_array(trim($alignment), $validAlignments)) {
                    return redirect()->back()->withErrors(['national_alignment' => 'Program NationalAlignment must include at least one recognized alignment when FocusAreas are specified.']);
                }
            }
        }

        $program->update($validated);

        return redirect()->route('programs.index');
    }

    public function destroy(Program $program)
    {
        if ($program->projects()->exists()) {
            return redirect()->route('programs.index')->withErrors(['program' => 'Program has Projects; archive or reassign before delete.']);
        }

        $program->delete();

        return redirect()->route('programs.index');
    }

    /**
     * List all projects under a program.
     */
    public function projects(Program $program)
    {
        $projects = $program->projects;  // fetch projects under this program
        return view('programs.projects', compact('projects', 'program'));
    }
}

