@extends('layouts.app')

@section('content')
    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold">Outcomes</h1>
                <p class="text-muted-foreground">Manage project outcomes and deliverables</p>
            </div>
            <div class="flex items-center space-x-2">
                <a href="{{ route('outcomes.create') }}" class="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Create Outcome
                </a>
            </div>
        </div>

        <!-- Outcomes Grid -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            @forelse($outcomes as $outcome)
                <div class="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex-1">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ $outcome->title }}</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ Str::limit($outcome->description, 100) }}</p>

                            <div class="flex items-center space-x-2 mb-3">
                                <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                                    @if($outcome->outcome_type === 'prototype') bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300
                                    @elseif($outcome->outcome_type === 'publication') bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300
                                    @elseif($outcome->outcome_type === 'patent') bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300
                                    @else bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300
                                    @endif">
                                    {{ ucfirst($outcome->outcome_type) }}
                                </span>
                                <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                                    @if($outcome->status === 'completed') bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300
                                    @elseif($outcome->status === 'in_progress') bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300
                                    @elseif($outcome->status === 'pending') bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300
                                    @else bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300
                                    @endif">
                                    {{ ucfirst(str_replace('_', ' ', $outcome->status ?? 'active')) }}
                                </span>
                            </div>

                            <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <div class="flex items-center space-x-2">
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    <span>{{ $outcome->project->title }}</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                    </svg>
                                    <span>{{ $outcome->project->facility->name }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div class="flex items-center space-x-2">
                            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            <span class="text-sm text-gray-500 dark:text-gray-400">{{ $outcome->project->participant_count }} participants</span>
                        </div>

                        <div class="flex items-center space-x-2">
                            <a href="{{ route('outcomes.show', $outcome->outcome_id) }}" class="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors">
                                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                                View Details
                            </a>
                            <a href="{{ route('outcomes.edit', $outcome->outcome_id) }}" class="inline-flex items-center gap-1 rounded-md bg-gray-600 px-3 py-1 text-xs font-medium text-white hover:bg-gray-700 transition-colors">
                                Edit
                            </a>
                        </div>
                    </div>
                </div>
            @empty
                <div class="col-span-full">
                    <div class="text-center py-12">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No outcomes found</h3>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating your first project outcome.</p>
                        <div class="mt-6">
                            <a href="{{ route('outcomes.create') }}" class="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                Create Outcome
                            </a>
                        </div>
                    </div>
                </div>
            @endforelse
        </div>

        <!-- Pagination -->
        @if($outcomes->hasPages())
            <div class="flex items-center justify-between pt-6">
                <div class="text-sm text-gray-700 dark:text-gray-300">
                    Showing {{ $outcomes->firstItem() }} to {{ $outcomes->lastItem() }} of {{ $outcomes->total() }} results
                </div>
                <div class="flex items-center space-x-2">
                    @if($outcomes->onFirstPage())
                        <span class="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 rounded-md cursor-not-allowed">
                            Previous
                        </span>
                    @else
                        <a href="{{ $outcomes->previousPageUrl() }}" class="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                            Previous
                        </a>
                    @endif

                    @foreach($outcomes->getUrlRange(1, $outcomes->lastPage()) as $page => $url)
                        @if($page == $outcomes->currentPage())
                            <span class="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md">
                                {{ $page }}
                            </span>
                        @else
                            <a href="{{ $url }}" class="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                                {{ $page }}
                            </a>
                        @endif
                    @endforeach

                    @if($outcomes->hasMorePages())
                        <a href="{{ $outcomes->nextPageUrl() }}" class="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                            Next
                        </a>
                    @else
                        <span class="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 rounded-md cursor-not-allowed">
                            Next
                        </span>
                    @endif
                </div>
            </div>
        @endif
    </div>
@endsection
