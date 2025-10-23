@extends('layouts.app')

@section('content')
    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold">{{ $project->title }}</h1>
                <p class="text-muted-foreground">{{ $project->description }}</p>
                <div class="flex items-center space-x-2 mt-2">
                    <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                        @if($project->status === 'completed') bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300
                        @elseif($project->status === 'development') bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300
                        @elseif($project->status === 'testing') bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300
                        @else bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300
                        @endif">
                        {{ ucfirst($project->status) }}
                    </span>
                    <span class="text-sm text-muted-foreground">•</span>
                    <span class="text-sm text-muted-foreground">{{ $project->facility->name }}</span>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <a href="{{ route('projects.index') }}" class="inline-flex items-center gap-2 rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
                    ← Back to Projects
                </a>
                <a href="{{ route('projects.outcomes.create', ['project' => $project->project_id]) }}" class="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Upload Outcome
                </a>
            </div>
        </div>

        <!-- Project Stats -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div class="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="rounded-lg bg-blue-600 p-2">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-blue-700 dark:text-blue-300">Total Outcomes</p>
                            <p class="text-3xl font-bold text-blue-900 dark:text-blue-100">{{ $project->outcomes->count() }}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                    <p class="text-xs text-blue-600 dark:text-blue-400">Deliverables & prototypes</p>
                </div>
            </div>

            <div class="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950 dark:to-green-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="rounded-lg bg-green-600 p-2">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-green-700 dark:text-green-300">Certified</p>
                            <p class="text-3xl font-bold text-green-900 dark:text-green-100">{{ $project->outcomes->where('quality_certification', '!=', null)->count() }}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                    <p class="text-xs text-green-600 dark:text-green-400">Quality certified</p>
                </div>
            </div>

            <div class="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950 dark:to-purple-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="rounded-lg bg-purple-600 p-2">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-purple-700 dark:text-purple-300">Commercialized</p>
                            <p class="text-3xl font-bold text-purple-900 dark:text-purple-100">{{ $project->outcomes->where('commercialization_status', 'commercialized')->count() }}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
                    <p class="text-xs text-purple-600 dark:text-purple-400">Market ready</p>
                </div>
            </div>

            <div class="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950 dark:to-orange-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="rounded-lg bg-orange-600 p-2">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-orange-700 dark:text-orange-300">With Artifacts</p>
                            <p class="text-3xl font-bold text-orange-900 dark:text-orange-100">{{ $project->outcomes->where('artifact_link', '!=', null)->count() }}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-orange-200 dark:border-orange-800">
                    <p class="text-xs text-orange-600 dark:text-orange-400">Downloadable files</p>
                </div>
            </div>
        </div>

        <!-- Project Details -->
        <div class="grid gap-6 lg:grid-cols-2">
            <div class="rounded-xl border bg-card p-6">
                <h2 class="text-xl font-semibold mb-4">Project Information</h2>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Program:</span>
                        <span class="text-muted-foreground">{{ $project->program->name }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Facility:</span>
                        <span class="text-muted-foreground">{{ $project->facility->name }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Innovation Focus:</span>
                        <span class="text-muted-foreground bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full text-sm">{{ $project->innovation_focus }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Prototype Stage:</span>
                        <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">{{ $project->prototype_stage }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Team Size:</span>
                        <span class="text-muted-foreground">{{ $project->participant_count }} participants</span>
                    </div>
                </div>
            </div>

            <div class="rounded-xl border bg-card p-6">
                <h2 class="text-xl font-semibold mb-4">Progress Overview</h2>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="font-medium">Completed Outcomes</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div class="bg-green-600 h-2 rounded-full" style="width: {{ $project->outcomes->where('commercialization_status', 'commercialized')->count() / max($project->outcomes->count(), 1) * 100 }}%"></div>
                            </div>
                            <span class="text-sm font-medium">{{ $project->outcomes->where('commercialization_status', 'commercialized')->count() }}/{{ $project->outcomes->count() }}</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <span class="font-medium">With Documentation</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div class="bg-blue-600 h-2 rounded-full" style="width: {{ $project->outcomes->where('artifact_link', '!=', null)->count() / max($project->outcomes->count(), 1) * 100 }}%"></div>
                            </div>
                            <span class="text-sm font-medium">{{ $project->outcomes->where('artifact_link', '!=', null)->count() }}/{{ $project->outcomes->count() }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Outcomes List -->
        <div class="rounded-xl border bg-card p-6">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold">Project Outcomes & Deliverables</h2>
                <a href="{{ route('projects.outcomes.create', ['project' => $project->project_id]) }}" class="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    Upload New Outcome
                </a>
            </div>

            @if($project->outcomes->count() > 0)
                <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    @foreach($project->outcomes as $outcome)
                        <div class="group relative overflow-hidden rounded-lg border bg-card p-4 transition-all hover:shadow-md hover:-translate-y-1">
                            <div class="flex items-start justify-between mb-3">
                                <div class="flex items-center space-x-2">
                                    <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                                        @if($outcome->outcome_type === 'prototype') bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300
                                        @elseif($outcome->outcome_type === 'report') bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300
                                        @elseif($outcome->outcome_type === 'software') bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300
                                        @else bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300
                                        @endif">
                                        {{ ucfirst($outcome->outcome_type) }}
                                    </span>
                                    @if($outcome->quality_certification)
                                        <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                            Certified
                                        </span>
                                    @endif
                                </div>
                            </div>

                            <h3 class="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">{{ $outcome->title }}</h3>
                            <p class="text-sm text-muted-foreground line-clamp-2 mb-3">{{ $outcome->description ?? 'No description provided' }}</p>

                            <div class="space-y-2 mb-4">
                                <div class="flex items-center text-sm">
                                    <svg class="h-4 w-4 mr-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                    </svg>
                                    <span class="font-medium">Commercialization:</span>
                                    <span class="ml-1 text-xs px-2 py-1 rounded-full
                                        @if($outcome->commercialization_status === 'commercialized') bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300
                                        @elseif($outcome->commercialization_status === 'in_progress') bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300
                                        @else bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300
                                        @endif">
                                        {{ ucfirst(str_replace('_', ' ', $outcome->commercialization_status ?? 'not_started')) }}
                                    </span>
                                </div>
                                @if($outcome->quality_certification)
                                    <div class="flex items-center text-sm">
                                        <svg class="h-4 w-4 mr-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span class="font-medium">Certification:</span>
                                        <span class="ml-1">{{ $outcome->quality_certification }}</span>
                                    </div>
                                @endif
                            </div>

                            <div class="flex items-center justify-between pt-3 border-t">
                                <div class="flex items-center space-x-2">
                                    @if($outcome->artifact_link)
                                        <a href="{{ route('projects.outcomes.download', [$project->project_id, $outcome->outcome_id]) }}" class="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                            </svg>
                                            Download
                                        </a>
                                    @else
                                        <span class="text-xs text-muted-foreground">No file attached</span>
                                    @endif
                                </div>
                                <div class="flex items-center space-x-1">
                                    <a href="{{ route('projects.outcomes.edit', [$project->project_id, $outcome->outcome_id]) }}" class="p-1.5 hover:bg-muted rounded-lg" title="Edit Outcome">
                                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                    </a>
                                    <form action="{{ route('projects.outcomes.destroy', [$project->project_id, $outcome->outcome_id]) }}" method="POST" class="m-0">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="p-1.5 hover:bg-red-100 hover:text-red-600 rounded-lg" title="Delete Outcome" onclick="return confirm('Delete this outcome?')">
                                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            @else
                <div class="text-center py-12">
                    <svg class="h-12 w-12 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    <h3 class="text-lg font-semibold mb-2">No outcomes yet</h3>
                    <p class="text-muted-foreground mb-4">Start by uploading your first project outcome or deliverable</p>
                    <a href="{{ route('projects.outcomes.create', ['project' => $project->project_id]) }}" class="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        Upload First Outcome
                    </a>
                </div>
            @endif
        </div>
    </div>

    @if (session('success'))
        <div class="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50" role="alert">
            <span class="block sm:inline">{{ session('success') }}</span>
        </div>
    @endif
    @if (session('error'))
        <div class="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50" role="alert">
            <span class="block sm:inline">{{ session('error') }}</span>
        </div>
    @endif
@endsection
