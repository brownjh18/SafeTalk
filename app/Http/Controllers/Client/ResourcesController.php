<?php

namespace App\Http\Controllers\Client;

use App\Models\Resource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResourcesController extends \App\Http\Controllers\Controller
{
    public function index(Request $request)
    {
        $resources = Resource::with('uploader')
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        $types = ['Document', 'Article', 'Video', 'Audio', 'Book', 'Presentation', 'Worksheet', 'Guide', 'Other'];

        return Inertia::render('client/resources/index', [
            'resources' => $resources,
            'types' => $types,
        ]);
    }
}