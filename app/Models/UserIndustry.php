<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserIndustry extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 
        'parent_industry_id', 
        'child_industry_id',
        'business_name'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function parentIndustry()
    {
        return $this->belongsTo(ParentIndustry::class);
    }

    public function childIndustry()
    {
        return $this->belongsTo(ChildIndustry::class);
    }
}