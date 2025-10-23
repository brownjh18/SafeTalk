@extends('layouts.app')

@section('content')
    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold">{{ $program->name }}</h1>
                <p class="text-muted-foreground">{{ $program->description }}</p>
                <div class="flex items-center space-x-2 mt-2">
                    <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">{{ $program->status }}</span>
                    <span class="text-sm text-muted-foreground">•</span>
                    <span class="text-sm text-muted-foreground">{{ $program->national_alignment }}</span>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <a href="{{ route('programs.index') }}" class="inline-flex items-center gap-2 rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
                    ← Back to Programs
                </a>
                <a href="{{ route('programs.edit', $program->program_id) }}" class="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit Program
                </a>
            </div>
        </div>

        <!-- Program Stats -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div class="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="rounded-lg bg-blue-600 p-2">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-blue-700 dark:text-blue-300">Total Projects</p>
                            <p class="text-3xl font-bold text-blue-900 dark:text-blue-100">{{ $program->projects->count() }}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                    <p class="text-xs text-blue-600 dark:text-blue-400">Active innovation projects</p>
                </div>
            </div>

            <div class="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950 dark:to-green-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="rounded-lg bg-green-600 p-2">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-green-700 dark:text-green-300">Participants</p>
                            <p class="text-3xl font-bold text-green-900 dark:text-green-100">{{ $program->projects->sum('participant_count') }}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                    <p class="text-xs text-green-600 dark:text-green-400">Students & mentors</p>
                </div>
            </div>

            <div class="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950 dark:to-purple-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="rounded-lg bg-purple-600 p-2">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-purple-700 dark:text-purple-300">Facilities</p>
                            <p class="text-3xl font-bold text-purple-900 dark:text-purple-100">{{ $program->projects->pluck('facility.name')->unique()->count() }}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
                    <p class="text-xs text-purple-600 dark:text-purple-400">Partner sites</p>
                </div>
            </div>

            <div class="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950 dark:to-orange-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="rounded-lg bg-orange-600 p-2">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-orange-700 dark:text-orange-300">Outcomes</p>
                            <p class="text-3xl font-bold text-orange-900 dark:text-orange-100">{{ $program->projects->sum('outcome_count') }}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-orange-200 dark:border-orange-800">
                    <p class="text-xs text-orange-600 dark:text-orange-400">Deliverables & prototypes</p>
                </div>
            </div>
        </div>

        <!-- Program Details -->
        <div class="grid gap-6 lg:grid-cols-2">
            <div class="rounded-xl border bg-card p-6">
                <h2 class="text-xl font-semibold mb-4">Program Information</h2>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Program ID:</span>
                        <span class="text-muted-foreground bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full text-sm">{{ $program->program_id }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">National Alignment:</span>
                        <span class="text-muted-foreground bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full text-sm">{{ $program->national_alignment }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Focus Areas:</span>
                        <span class="text-muted-foreground">{{ $program->focus_areas }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Phases:</span>
                        <span class="text-muted-foreground">{{ $program->phases }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Status:</span>
                        <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">{{ $program->status }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Created:</span>
                        <span class="text-muted-foreground">{{ $program->created_at->format('M d, Y') }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Last Updated:</span>
                        <span class="text-muted-foreground">{{ $program->updated_at->format('M d, Y') }}</span>
                    </div>
                </div>
            </div>

            <div class="rounded-xl border bg-card p-6">
                <h2 class="text-xl font-semibold mb-4">Implementation Progress</h2>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="font-medium">Projects Completed</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div class="bg-green-600 h-2 rounded-full" style="width: {{ $program->projects->where('status', 'completed')->count() / max($program->projects->count(), 1) * 100 }}%"></div>
                            </div>
                            <span class="text-sm font-medium">{{ $program->projects->where('status', 'completed')->count() }}/{{ $program->projects->count() }}</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="font-medium">In Development</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div class="bg-blue-600 h-2 rounded-full" style="width: {{ $program->projects->where('status', 'development')->count() / max($program->projects->count(), 1) * 100 }}%"></div>
                            </div>
                            <span class="text-sm font-medium">{{ $program->projects->where('status', 'development')->count() }}/{{ $program->projects->count() }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Search and Filter -->
        <div class="flex items-center space-x-4">
            <div class="relative flex-1 max-w-sm">
                <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input
                    type="text"
                    placeholder="Search projects..."
                    class="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm"
                />
            </div>
            <div class="flex items-center space-x-2">
                <svg class="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
                <select class="rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>All Status</option>
                    <option>Development</option>
                    <option>Testing</option>
                    <option>Completed</option>
                </select>
            </div>
        </div>

        <!-- Projects Grid -->
        @if($program->projects->count() > 0)
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                @foreach($program->projects as $project)
                    <div class="group rounded-lg border bg-card p-6 opacity-100">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex items-center space-x-2">
                                <svg class="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
                                </svg>
                                <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                                    @if($project->status === 'completed') bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300
                                    @elseif($project->status === 'development') bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300
                                    @else bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300
                                    @endif">
                                    {{ ucfirst($project->status) }}
                                </span>
                            </div>
                            <div class="flex items-center space-x-1">
                                <a href="{{ route('projects.show', $project->project_id) }}" class="p-1.5 hover:bg-muted rounded-lg" title="View Details">
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                </a>
                                <a href="{{ route('projects.edit', $project->project_id) }}" class="p-1.5 hover:bg-muted rounded-lg" title="Edit Project">
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <h3 class="font-semibold text-lg mb-2">{{ $project->title }}</h3>
                        <p class="text-sm text-muted-foreground mb-4 line-clamp-2">{{ $project->description ?? 'No description provided' }}</p>

                        <div class="space-y-2 mb-4">
                            <div class="flex items-center text-sm">
                                <svg class="h-4 w-4 mr-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                                <span class="font-medium">Participants:</span>
                                <span class="ml-1">{{ $project->participant_count }}</span>
                            </div>
                            <div class="flex items-center text-sm">
                                <svg class="h-4 w-4 mr-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                                <span class="font-medium">Facility:</span>
                                <span class="ml-1">{{ $project->facility->name ?? 'Not Assigned' }}</span>
                            </div>
                            <div class="flex items-center text-sm">
                                <svg class="h-4 w-4 mr-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                                <span class="font-medium">Outcomes:</span>
                                <span class="ml-1">{{ $project->outcomes->count() }}</span>
                            </div>
                        </div>

                        <div class="flex items-center text-sm text-muted-foreground">
                            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>{{ $project->prototype_stage }}</span>
                        </div>
                    </div>
                @endforeach
            </div>
        @else
            <div class="text-center py-12">
                <svg class="h-12 w-12 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
                </svg>
                <h3 class="text-lg font-semibold mb-2">No projects found</h3>
                <p class="text-muted-foreground">
                    No deleted projects found matching your criteria
                </p>
            </div>
        @endif

        <!-- Summary -->
        @if($program->projects->count() > 0)
            <div class="mt-6 p-4 bg-muted rounded-lg">
                <div class="flex items-center justify-between text-sm">
                    <span class="font-medium">
                        {{ $program->projects->count() }} projects
                    </span>
                    <div class="flex items-center space-x-4 text-muted-foreground">
                        <span>Status: {{ $program->projects->where('status', 'completed')->count() }} completed, {{ $program->projects->where('status', 'development')->count() }} in development</span>
                        <span>Total participants: {{ $program->projects->sum('participant_count') }}</span>
                    </div>
                </div>
            </div>
        @endif
    </div>
@endsection