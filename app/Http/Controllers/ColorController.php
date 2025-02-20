<?php

namespace App\Http\Controllers;

use App\Models\Color;

class ColorController extends Controller
{
    public function index()
    {
        return response()->json(Color::all());
    }
} 