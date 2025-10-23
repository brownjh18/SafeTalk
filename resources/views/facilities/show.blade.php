@extends('layouts.app')

@section('content')
    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <a href="{{ route('facilities.index') }}" class="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back to Facilities
                </a>
                <div>
                    <h1 class="text-3xl font-bold">{{ $facility->name }}</h1>
                    <p class="text-muted-foreground">{{ $facility->description }}</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <a href="{{ route('facilities.edit', $facility->facility_id) }}" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit Facility
                </a>
            </div>
        </div>

        <!-- Facility Stats -->
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
                            <p class="text-sm font-medium text-blue-700 dark:text-blue-300">Projects</p>
                            <p class="text-3xl font-bold text-blue-900 dark:text-blue-100">{{ $facility->projects->count() }}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                    <p class="text-xs text-blue-600 dark:text-blue-400">Active projects</p>
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
                            <p class="text-sm font-medium text-green-700 dark:text-green-300">Services</p>
                            <p class="text-3xl font-bold text-green-900 dark:text-green-100">{{ $facility->services->count() }}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                    <p class="text-xs text-green-600 dark:text-green-400">Available services</p>
                </div>
            </div>

            <div class="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950 dark:to-purple-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="rounded-lg bg-purple-600 p-2">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-purple-700 dark:text-purple-300">Equipment</p>
                            <p class="text-3xl font-bold text-purple-900 dark:text-purple-100">{{ $facility->equipment->count() }}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
                    <p class="text-xs text-purple-600 dark:text-purple-400">Equipment items</p>
                </div>
            </div>

            <div class="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950 dark:to-orange-900/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="rounded-lg bg-orange-600 p-2">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-orange-700 dark:text-orange-300">Participants</p>
                            <p class="text-3xl font-bold text-orange-900 dark:text-orange-100">{{ $facility->projects->sum('participant_count') }}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-orange-200 dark:border-orange-800">
                    <p class="text-xs text-orange-600 dark:text-orange-400">Total participants</p>
                </div>
            </div>
        </div>

        <!-- Facility Details -->
        <div class="grid gap-6 lg:grid-cols-2">
            <div class="rounded-xl border bg-card p-6">
                <h2 class="text-xl font-semibold mb-4">Facility Information</h2>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Facility ID:</span>
                        <span class="text-muted-foreground bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full text-sm">{{ $facility->facility_id }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Type:</span>
                        <span class="text-muted-foreground">{{ $facility->facility_type }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Partner Organization:</span>
                        <span class="text-muted-foreground">{{ $facility->partner_organization }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Location:</span>
                        <span class="text-muted-foreground">{{ $facility->location }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Capabilities:</span>
                        <div class="text-right">
                            @foreach(explode(',', $facility->capabilities) as $capability)
                                <span class="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs mr-1 mb-1">{{ trim($capability) }}</span>
                            @endforeach
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Created:</span>
                        <span class="text-muted-foreground">{{ $facility->created_at->format('M d, Y') }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Last Updated:</span>
                        <span class="text-muted-foreground">{{ $facility->updated_at->format('M d, Y') }}</span>
                    </div>
                </div>
            </div>

            <div class="rounded-xl border bg-card p-6">
                <h2 class="text-xl font-semibold mb-4">Facility Overview</h2>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="font-medium">Active Projects</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div class="bg-green-600 h-2 rounded-full" style="width: {{ $facility->projects->where('status', 'development')->count() / max($facility->projects->count(), 1) * 100 }}%"></div>
                            </div>
                            <span class="text-sm font-medium">{{ $facility->projects->where('status', 'development')->count() }}/{{ $facility->projects->count() }}</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span class="font-medium">Services Available</span>
                        </div>
                        <span class="text-sm font-medium">{{ $facility->services->count() }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <svg class="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                            </svg>
                            <span class="font-medium">Equipment Items</span>
                        </div>
                        <span class="text-sm font-medium">{{ $facility->equipment->count() }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Facility Actions -->
        <div class="rounded-xl border bg-card p-6">
            <h2 class="text-xl font-semibold mb-4">Facility Actions</h2>
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <a href="{{ route('facilities.equipment.index', $facility->facility_id) }}" class="group relative overflow-hidden rounded-lg border bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/30 p-4 transition-all hover:shadow-md hover:-translate-y-1">
                    <div class="flex items-center space-x-3">
                        <div class="rounded-lg bg-blue-600 p-2">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold">View Equipment</h3>
                            <p class="text-sm text-muted-foreground">Manage facility equipment</p>
                        </div>
                    </div>
                </a>

                <a href="{{ route('facilities.edit', $facility->facility_id) }}" class="group relative overflow-hidden rounded-lg border bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-950 dark:to-green-900/30 p-4 transition-all hover:shadow-md hover:-translate-y-1">
                    <div class="flex items-center space-x-3">
                        <div class="rounded-lg bg-green-600 p-2">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold">Edit Facility</h3>
                            <p class="text-sm text-muted-foreground">Update facility details</p>
                        </div>
                    </div>
                </a>

                <div class="group relative overflow-hidden rounded-lg border bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-950 dark:to-orange-900/30 p-4">
                    <div class="flex items-center space-x-3">
                        <div class="rounded-lg bg-orange-600 p-2">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold">Facility Analytics</h3>
                            <p class="text-sm text-muted-foreground">View detailed statistics</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection