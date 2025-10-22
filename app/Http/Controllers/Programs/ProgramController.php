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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'national_alignment' => 'nullable|string',
            'focus_areas' => 'nullable|string',
            'phases' => 'nullable|string',
        ]);

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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'national_alignment' => 'nullable|string',
            'focus_areas' => 'nullable|string',
            'phases' => 'nullable|string',
        ]);

        $program->update($validated);

        return redirect()->route('programs.index');
    }

    public function destroy(Program $program)
    {
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

