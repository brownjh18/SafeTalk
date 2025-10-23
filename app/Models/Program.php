<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Program extends Model
{
    use HasFactory, SoftDeletes;
    
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'programs';

    protected $primaryKey = 'program_id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'program_id',
        'program_code',
        'name',
        'description',
        'national_alignment',
        'focus_areas',
        'phases',
    ];

    /**
     * Use program_id for route model binding.
     */
    public function getRouteKeyName()
    {
        return 'program_id';
    }

    /**
     * Get the projects for the program.
     */
    public function projects()
    {
        return $this->hasMany(Project::class, 'program_id', 'program_id');
    }

    protected static function booted()
    {
        static::creating(function (Program $program) {
            if (empty($program->program_code) && !empty($program->name)) {
                $base = strtoupper(preg_replace('/[^A-Z0-9]+/i', '-', $program->name));
                $base = trim($base, '-');
                $prefix = 'PRG-';
                $candidate = $prefix . substr($base, 0, 8);
                $i = 1;
                while (self::where('program_code', $candidate)->exists()) {
                    $candidate = $prefix . substr($base, 0, 8) . '-' . $i++;
                }
                $program->program_code = $candidate;
            }
        });
    }
}