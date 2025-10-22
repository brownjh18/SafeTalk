<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'projects';

    /**
     * The primary key associated with the table.
     */
    protected $primaryKey = 'project_id';

    /**
     * Indicates if the IDs are auto-incrementing.
     */
    public $incrementing = false;

    /**
     * The data type of the primary key.
     */
    protected $keyType = 'string';

    /**
     * Use project_id for route model binding.
     */
    public function getRouteKeyName()
    {
        return 'project_id';
    }

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'project_id',
        'project_code',
        'program_id',
        'facility_id',
        'title',
        'nature_of_project',
        'description',
        'innovation_focus',
        'prototype_stage',
        'testing_requirements',
        'commercialization_plan',
        // Attributes used by unit tests
        'name',
        'team_members',
        'status',
        'outcomes',
        'requirements',
        'facility_capabilities',
    ];

    /**
     * Get the program that owns the project.
     */
    public function program()
    {
        return $this->belongsTo(Program::class, 'program_id', 'program_id');
    }

    /**
     * Get the facility that hosts the project.
     */
    public function facility()
    {
         return $this->belongsTo(Facility::class, 'facility_id', 'facility_id');
    }

    /**
     * Get the participants involved in this project (many-to-many).
     */
    public function participants()
    {
        return $this->belongsToMany(Participant::class, 'participant_project', 'project_id', 'participant_id');
    }

    /**
     * Get the outcomes for the project.
     */
    public function outcomes()
    {
        return $this->hasMany(Outcome::class, 'project_id', 'project_id');
    }

    protected static function booted()
    {
        static::creating(function (Project $project) {
            if (empty($project->project_code) && !empty($project->title)) {
                $base = strtoupper(preg_replace('/[^A-Z0-9]+/i', '-', $project->title));
                $base = trim($base, '-');
                $prefix = 'PRJ-';
                $candidate = $prefix . substr($base, 0, 8);
                $i = 1;
                while (self::where('project_code', $candidate)->exists()) {
                    $candidate = $prefix . substr($base, 0, 8) . '-' . $i++;
                }
                $project->project_code = $candidate;
            }
        });
    }
}
