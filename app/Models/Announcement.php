<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = [
        'title',
        'message',
        'target_roles',
        'is_active',
    ];

    protected $casts = [
        'target_roles' => 'array',
        'is_active' => 'boolean',
    ];
}
