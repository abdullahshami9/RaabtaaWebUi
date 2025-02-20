<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Color extends Model
{
    protected $fillable = ['name', 'value'];

    public function notes()
    {
        return $this->hasMany(Note::class);
    }
} 