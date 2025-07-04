<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'usage_type',
        'has_completed_survey'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    public function socialLinks()
    {
        return $this->hasMany(SocialLink::class);
    }

    public function userIndustry()
    {
        return $this->hasOne(UserIndustry::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class,'user_skill')
            ->withPivot('proficiency')
            ->withTimestamps();
    }

    public function achievements()
    {
        return $this->belongsToMany(Achievement::class, 'user_achievement')
            ->withPivot(['achieved_at', 'notes'])
            ->withTimestamps();
    }

}
