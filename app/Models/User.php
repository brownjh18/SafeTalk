<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'verified',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'verified' => 'boolean',
            'notification_preferences' => 'array',
        ];
    }

    public function counselingSessionsAsClient()
    {
        return $this->hasMany(CounselingSession::class, 'client_id');
    }

    public function counselingSessionsAsCounselor()
    {
        return $this->hasMany(CounselingSession::class, 'counselor_id');
    }

    public function counselingSessions()
    {
        return $this->hasMany(CounselingSession::class, 'counselor_id');
    }

    public function chats()
    {
        return $this->hasMany(Chat::class, 'sender_id');
    }

    public function counselorRatings()
    {
        return $this->hasMany(CounselorRating::class, 'counselor_id');
    }

    public function clientRatings()
    {
        return $this->hasMany(CounselorRating::class, 'client_id');
    }

    public function getAverageRatingAttribute()
    {
        return $this->counselorRatings()->avg('rating') ?? 0;
    }

    public function getTotalRatingsAttribute()
    {
        return $this->counselorRatings()->count();
    }

    public function resources()
    {
        return $this->hasMany(Resource::class, 'uploaded_by');
    }

    public function progressReports()
    {
        return $this->hasMany(ProgressReport::class, 'client_id');
    }

    public function notifications()
    {
        return $this->hasMany(AppNotification::class);
    }

    public function groupChatSessions()
    {
        return $this->belongsToMany(GroupChatSession::class, 'group_chat_participants', 'user_id', 'group_chat_session_id')
                    ->withPivot('joined_at', 'role')
                    ->withTimestamps();
    }

    public function createdGroupChatSessions()
    {
        return $this->hasMany(GroupChatSession::class, 'creator_id');
    }
}
