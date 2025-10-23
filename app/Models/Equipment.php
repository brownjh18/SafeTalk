<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Equipment extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     */
    protected $table = 'equipment';

    /**
     * The primary key associated with the table.
     */
    protected $primaryKey = 'equipment_id';

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
        'equipment_id',
        'facility_id',
        'name',
        'capabilities',
        'description',
        'inventory_code',
        'usage_domain',
        'support_phase',
    ];

    /**
     * Use equipment_id for route model binding.
     */
    public function getRouteKeyName()
    {
        return 'equipment_id';
    }

    /**
     * Allowed values for usage_domain and support_phase.
     */
    public const USAGE_DOMAINS = ['Electronics', 'Mechanical', 'IoT'];
    public const SUPPORT_PHASES = ['Training', 'Prototyping', 'Testing', 'Commercialization'];

    /**
     * Relationships
     */
    public function facility()
    {
        return $this->belongsTo(Facility::class, 'facility_id', 'facility_id');
    }
}
