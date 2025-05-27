<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Color;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => auth()->user()
            ],
            'notes' => auth()->user()->notes()->with('color')->latest()->get(),
            'colors' => Color::all()
        ]);
    }

    public function digitalCard()
    {
        return Inertia::render('DigitalCard/Index', [
            'auth' => ['user' => auth()->user()]
        ]);
    }

    public function notifications()
    {
        return Inertia::render('Notifications/Index', [
            'auth' => ['user' => auth()->user()]
        ]);
    }

    public function reminders()
    {
        return Inertia::render('Reminders/Index', [
            'auth' => ['user' => auth()->user()]
        ]);
    }
} 