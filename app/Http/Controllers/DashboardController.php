<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\User;
use App\Models\Color;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => auth()->user()->load('userIndustry'), // This eager loads the relationship
            ],
            'notes' => auth()->user()->notes()->with('color')->latest()->get(),
            'colors' => Color::all()
        ]);
    }

    public function digitalCard($businessName)
    {
        $user = User::whereHas('userIndustry', function($query) use ($businessName) {
                $query->where('business_name_slug', $businessName);
            })
            ->with([
                'userIndustry.parentIndustry', 
                'userIndustry.childIndustry', 
                'socialLinks',
                'skills' => function($query) {
                    $query->select('skills.id', 'skills.name');
                },
                'achievements' => function($query) {
                    $query->select('achievements.id', 'achievements.title', 'achievements.description');
                }
            ])
            ->firstOrFail();

        $user->increment('view_count');

        return Inertia::render('DigitalCard/Index', [
            'user' => $user,
            'userData' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'business_name' => optional($user->userIndustry)->business_name,
                'business_name_slug' => optional($user->userIndustry)->business_name_slug,
                'parent_industry' => optional($user->userIndustry)->parentIndustry,
                'child_industry' => optional($user->userIndustry)->childIndustry,
                'bio' => $user->bio,
                'skills' => optional($user->skills)->pluck('name')->toArray() ?? [],
                'achievements' => optional($user->achievements)->map(fn($achievement) => $achievement->title)->toArray() ?? [],
                'gallery_images' => $user->gallery_images ? json_decode($user->gallery_images) : [],
                'view_count' => $user->view_count,
                'like_count' => $user->like_count,
                'created_at' => $user->created_at,
            ],
            'socialLinks' => $user->socialLinks ?? [],
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