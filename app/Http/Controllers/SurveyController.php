<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\SocialLink;
use Illuminate\Support\Facades\DB;

class SurveyController extends Controller
{
    public function show()
    {
        // Check if user has already completed survey
        if (auth()->user()->has_completed_survey) {
            return redirect()->route('dashboard');
        }
        
        return Inertia::render('Survey/Index');
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $validated = $request->validate([
                'usage_type' => 'required|in:personal,business',
                'selected_platforms' => 'required|array',
                'social_links' => 'required|array'
            ]);

            // Update user
            $user = auth()->user();
            $user->update([
                'usage_type' => $validated['usage_type'],
                'has_completed_survey' => true
            ]);

            // Delete existing social links if any
            $user->socialLinks()->delete();

            // Store social links
            foreach ($validated['social_links'] as $platform => $url) {
                if (!empty($url)) { // Only store if URL is provided
                    $user->socialLinks()->create([
                        'platform' => $platform,
                        'url' => $url
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('dashboard')->with('success', 'Profile setup completed successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Something went wrong. Please try again.');
        }
    }
} 