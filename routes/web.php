<?php


use App\Http\Controllers\participants\ParticipantsController;
use App\Http\Controllers\outcomes\OutcomesController;
use App\Http\Controllers\facilities\FacilitiesController;
use App\Http\Controllers\Programs\ProgramController;
use App\Http\Controllers\equipment\EquipmentController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\services\ServicesController;
use App\Http\Controllers\projects\ProjectsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TrashController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('activity', [DashboardController::class, 'activity'])->name('activity.index');







});


Route::resource('programs', ProgramController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy']);

// Nested route: list all projects under a program
Route::get('/programs/{program}/projects', [ProgramController::class, 'projects'])->name('programs.projects');

// Projects resource routes
Route::resource('projects', ProjectsController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy']);

// Outcomes nested under projects

Route::get('projects/{project}/outcomes', [OutcomesController::class, 'index'])->name('projects.outcomes.index');
Route::get('projects/{project}/outcomes/create', [OutcomesController::class, 'create'])->name('projects.outcomes.create');
Route::post('projects/{project}/outcomes', [OutcomesController::class, 'store'])->name('projects.outcomes.store');
Route::get('projects/{project}/outcomes/{outcome}/edit', [OutcomesController::class, 'edit'])->name('projects.outcomes.edit');
Route::put('projects/{project}/outcomes/{outcome}', [OutcomesController::class, 'update'])->name('projects.outcomes.update');
Route::delete('projects/{project}/outcomes/{outcome}', [OutcomesController::class, 'destroy'])->name('projects.outcomes.destroy');
Route::get('projects/{project}/outcomes/{outcome}/download', [OutcomesController::class, 'download'])->name('projects.outcomes.download');

// Services resource routes
Route::resource('services', ServicesController::class)->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);

// Facilities resource routes
Route::resource('facilities', FacilitiesController::class)->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);

// Equipment resource routes
Route::get('facilities/{facility}/equipment', [EquipmentController::class, 'byFacility'])->name('facilities.equipment.index');
Route::resource('equipment', EquipmentController::class)->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);

// Participants resource routes
Route::resource('participants', ParticipantsController::class)->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);
Route::post('participants/{participant}/assign', [ParticipantsController::class, 'assignToProject'])->name('participants.assign');
Route::delete('participants/{participant}/projects/{project}', [ParticipantsController::class, 'removeFromProject'])->name('participants.projects.remove');


// Standalone outcomes index route
Route::get('/outcomes', [OutcomesController::class, 'all'])->name('outcomes.index');

// Note: Outcomes are nested under projects, so we only need specific routes
// Route::resource('outcomes', OutcomesController::class)->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);

// Trash Management Routes
Route::get('/trash', [TrashController::class, 'index'])->name('trash.index');
Route::post('/trash/{type}/{id}/restore', [TrashController::class, 'restore'])->name('trash.restore');
Route::delete('/trash/{type}/{id}/permanent', [TrashController::class, 'permanentDelete'])->name('trash.permanent-delete');
use App\Http\Controllers\ViewDetailsController;

// View Details Route
Route::get('/viewdetails', [ViewDetailsController::class, 'index'])->name('viewdetails');
Route::delete('/trash/empty', [TrashController::class, 'emptyTrash'])->name('trash.empty');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
