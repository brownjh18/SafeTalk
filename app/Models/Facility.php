<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'facilities';

    /**
     * The primary key associated with the table.
     */
    protected $primaryKey = 'facility_id';

    /**
     * Indicates if the IDs are auto-incrementing.
     */
    public $incrementing = false;

    /**
     * The data type of the primary key.
     */
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'facility_id',
        'facility_code',
        'name',
        'location',
        'description',
        'partner_organization',
        'facility_type',
        'capabilities',
        // Additional attributes used by unit tests
        'manager_name',
        'capacity',
        'program_id',
    ];

    /**
     * Use facility_id for route model binding.
     */
    public function getRouteKeyName()
    {
        return 'facility_id';
    }

    /**
     * Allowed values for facility_type.
     */
    public const FACILITY_TYPES = ['Lab', 'Workshop', 'Testing Center'];

    /**
     * Relationships
     */
    public function projects()
    {
        return $this->hasMany(Project::class, 'facility_id', 'facility_id');
    }

    public function services()
    {
        return $this->hasMany(Service::class, 'facility_id', 'facility_id');
    }

    public function equipment()
    {
        return $this->hasMany(Equipment::class, 'facility_id', 'facility_id');
    }

    protected static function booted()
    {
        static::creating(function (Facility $facility) {
            if (empty($facility->facility_code) && !empty($facility->name)) {
                $base = strtoupper(preg_replace('/[^A-Z0-9]+/i', '-', $facility->name));
                $base = trim($base, '-');
                $prefix = 'FAC-';
                $candidate = $prefix . substr($base, 0, 8);
                $i = 1;
                while (self::where('facility_code', $candidate)->exists()) {
                    $candidate = $prefix . substr($base, 0, 8) . '-' . $i++;
                }
                $facility->facility_code = $candidate;
            }
        });
    }
}
