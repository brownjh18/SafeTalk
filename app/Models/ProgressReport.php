<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgressReport extends Model
{
    protected $fillable = [
        'client_id',
        'counselor_id',
        'session_id',
        'content',
        'date',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function counselor()
    {
        return $this->belongsTo(User::class, 'counselor_id');
    }

    public function session()
    {
        return $this->belongsTo(CounselingSession::class, 'session_id');
    }
}
