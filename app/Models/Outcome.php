<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Outcome extends Model
{
    use HasFactory;

    /**
     * Table associated with the model.
     */
    protected $table = 'outcomes';

    /**
     * The primary key associated with the table.
     */
    protected $primaryKey = 'outcome_id';

    /**
     * Indicates if the IDs are auto-incrementing.
     */
    public $incrementing = false;

    /**
     * The data type of the primary key.
     */
    protected $keyType = 'string';

    /**
     * Mass assignable fields.
     */
    protected $fillable = [
        'outcome_id',
        'project_id',
        'title',
        'description',
        'artifact_link',
        'outcome_type',
        'quality_certification',
        'commercialization_status',
    ];

    /**
     * Route model binding key.
     */
    public function getRouteKeyName()
    {
        return 'outcome_id';
    }

    /**
     * Enumerations for types and statuses.
     */
    public const OUTCOME_TYPES = ['CAD', 'PCB', 'Prototype', 'Report', 'Business Plan'];
    public const COMMERCIALIZATION_STATUSES = ['Demoed', 'Market Linked', 'Launched'];

    /**
     * Relationships
     */
    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id', 'project_id');
    }
}
