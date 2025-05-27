<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'card_holder_name',
        'card_number',
        'expiry_date',
        'cvc'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 