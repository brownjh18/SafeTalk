<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResourcesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $resources = Resource::with('uploader')
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        $types = ['Document', 'Article', 'Video', 'Audio', 'Book', 'Presentation', 'Worksheet', 'Guide', 'Other'];

        return Inertia::render('admin/resources/index', [
            'resources' => $resources,
            'types' => $types,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'file' => 'required|file|mimes:pdf,doc,docx,ppt,pptx,txt|max:10240', // 10MB max
            'type' => 'required|string',
        ]);

        $file = $request->file('file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('resources', $fileName, 'public');

        Resource::create([
            'title' => $request->title,
            'description' => $request->description,
            'file_path' => $filePath,
            'type' => $request->type,
            'uploaded_by' => $request->user()->id,
        ]);

        return redirect()->back()->with('success', 'Resource uploaded successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $resource = Resource::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx,txt|max:10240',
            'type' => 'required|string',
        ]);

        $data = [
            'title' => $request->title,
            'description' => $request->description,
            'type' => $request->type,
        ];

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('resources', $fileName, 'public');
            $data['file_path'] = $filePath;

            // Delete old file if exists
            if ($resource->file_path && \Storage::disk('public')->exists($resource->file_path)) {
                \Storage::disk('public')->delete($resource->file_path);
            }
        }

        $resource->update($data);

        return redirect()->back()->with('success', 'Resource updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $resource = Resource::findOrFail($id);

        // Delete file from storage
        if ($resource->file_path && \Storage::disk('public')->exists($resource->file_path)) {
            \Storage::disk('public')->delete($resource->file_path);
        }

        $resource->delete();

        return redirect()->back()->with('success', 'Resource deleted successfully');
    }
}
