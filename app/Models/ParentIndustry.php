<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParentIndustry extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function children()
    {
        return $this->hasMany(ChildIndustry::class);
    }

    public function users()
    {
        return $this->hasManyThrough(User::class, UserIndustry::class);
    }
}