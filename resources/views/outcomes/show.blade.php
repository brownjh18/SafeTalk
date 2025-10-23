@extends('layouts.app')

@section('content')
    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <a href="{{ route('outcomes.index') }}" class="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back to Outcomes
                </a>
                <div>
                    <h1 class="text-3xl font-bold">{{ $outcome->title }}</h1>
                    <p class="text-muted-foreground">{{ $outcome->description }}</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <a href="{{ route('outcomes.edit', $outcome->outcome_id) }}" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit Outcome
                </a>
            </div>
        </div>

        <!-- Outcome Stats -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div class="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="rounded-lg bg-blue-600 p-2">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-blue-700 dark:text-blue-300">Project</p>
                            <p class="text-3xl font-bold text-blue-900 dark:text-blue-100">{{ $outcome->project->title ?? 'Not Assigned' }}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                    <p class="text-xs text-blue-600 dark:text-blue-400">Parent project</p>
                </div>
            </div>

            <div class="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950 dark:to-green-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="rounded-lg bg-green-600 p-2">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-green-700 dark:text-green-300">Outcome Type</p>
                            <p class="text-3xl font-bold text-green-900 dark:text-green-100">{{ ucfirst($outcome->outcome_type) }}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                    <p class="text-xs text-green-600 dark:text-green-400">Deliverable category</p>
                </div>
            </div>

            <div class="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950 dark:to-purple-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="rounded-lg bg-purple-600 p-2">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-purple-700 dark:text-purple-300">Facility</p>
                            <p class="text-3xl font-bold text-purple-900 dark:text-purple-100">{{ $outcome->project->facility->name ?? 'N/A' }}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
                    <p class="text-xs text-purple-600 dark:text-purple-400">Development location</p>
                </div>
            </div>

            <div class="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950 dark:to-orange-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="rounded-lg bg-orange-600 p-2">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-orange-700 dark:text-orange-300">Status</p>
                            <p class="text-3xl font-bold text-orange-900 dark:text-orange-100">{{ ucfirst(str_replace('_', ' ', $outcome->status ?? 'active')) }}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-orange-200 dark:border-orange-800">
                    <p class="text-xs text-orange-600 dark:text-orange-400">Current status</p>
                </div>
            </div>
        </div>

        <!-- Outcome Details -->
        <div class="grid gap-6 lg:grid-cols-2">
            <div class="rounded-xl border bg-card p-6">
                <h2 class="text-xl font-semibold mb-4">Outcome Information</h2>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Outcome ID:</span>
                        <span class="text-muted-foreground bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full text-sm">{{ $outcome->outcome_id }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Title:</span>
                        <span class="text-muted-foreground">{{ $outcome->title }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Project:</span>
                        <span class="text-muted-foreground">{{ $outcome->project->title ?? 'Not Assigned' }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Outcome Type:</span>
                        <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                            @if($outcome->outcome_type === 'prototype') bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300
                            @elseif($outcome->outcome_type === 'publication') bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300
                            @elseif($outcome->outcome_type === 'patent') bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300
                            @else bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300
                            @endif">
                            {{ ucfirst($outcome->outcome_type) }}
                        </span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Status:</span>
                        <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                            @if($outcome->status === 'completed') bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300
                            @elseif($outcome->status === 'in_progress') bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300
                            @elseif($outcome->status === 'pending') bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300
                            @else bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300
                            @endif">
                            {{ ucfirst(str_replace('_', ' ', $outcome->status ?? 'active')) }}
                        </span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Description:</span>
                        <span class="text-muted-foreground">{{ $outcome->description }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Created:</span>
                        <span class="text-muted-foreground">{{ $outcome->created_at->format('M d, Y') }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Last Updated:</span>
                        <span class="text-muted-foreground">{{ $outcome->updated_at->format('M d, Y') }}</span>
                    </div>
                </div>
            </div>

            <div class="rounded-xl border bg-card p-6">
                <h2 class="text-xl font-semibold mb-4">Outcome Overview</h2>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="font-medium">Outcome Status</span>
                        </div>
                        <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                            @if($outcome->status === 'completed') bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300
                            @elseif($outcome->status === 'in_progress') bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300
                            @elseif($outcome->status === 'pending') bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300
                            @else bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300
                            @endif">
                            {{ ucfirst(str_replace('_', ' ', $outcome->status ?? 'active')) }}
                        </span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                            <span class="font-medium">Project Title</span>
                        </div>
                        <span class="text-sm font-medium">{{ $outcome->project->title ?? 'N/A' }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <svg class="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span class="font-medium">Outcome Type</span>
                        </div>
                        <span class="text-sm font-medium">{{ ucfirst($outcome->outcome_type) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Outcome Actions -->
        <div class="rounded-xl border bg-card p-6">
            <h2 class="text-xl font-semibold mb-4">Outcome Actions</h2>
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <a href="{{ route('outcomes.edit', $outcome->outcome_id) }}" class="group relative overflow-hidden rounded-lg border bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-950 dark:to-green-900/30 p-4 transition-all hover:shadow-md hover:-translate-y-1">
                    <div class="flex items-center space-x-3">
                        <div class="rounded-lg bg-green-600 p-2">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold">Edit Outcome</h3>
                            <p class="text-sm text-muted-foreground">Update outcome details</p>
                        </div>
                    </div>
                </a>

                <div class="group relative overflow-hidden rounded-lg border bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/30 p-4">
                    <div class="flex items-center space-x-3">
                        <div class="rounded-lg bg-blue-600 p-2">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold">Outcome Analytics</h3>
                            <p class="text-sm text-muted-foreground">View impact statistics</p>
                        </div>
                    </div>
                </div>

                <div class="group relative overflow-hidden rounded-lg border bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-950 dark:to-orange-900/30 p-4">
                    <div class="flex items-center space-x-3">
                        <div class="rounded-lg bg-orange-600 p-2">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold">Download Files</h3>
                            <p class="text-sm text-muted-foreground">Access outcome deliverables</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection