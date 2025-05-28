<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\SocialLink;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

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

            $baseValidation = [
                'usage_type' => 'required|in:personal,business',
                'selected_platforms' => 'required|array|min:1',
                'social_links' => 'required|array'
            ];

            $validatedData = $request->validate($baseValidation);

            // Validate social links format
            foreach ($validatedData['social_links'] as $platform => $url) {
                if (!empty($url) && !filter_var($url, FILTER_VALIDATE_URL)) {
                    throw ValidationException::withMessages([
                        'social_links' => "Invalid URL format for $platform"
                    ]);
                }
            }

            if ($validatedData['usage_type'] === 'business') {
                $request->validate([
                    'business_info.business_name' => 'required|string|max:255',
                    'business_info.parent_industry_id' => 'required|exists:parent_industries,id',
                    'business_info.child_industry_id' => 'required|exists:child_industries,id',
                    'payment.card_holder_name' => 'required|string|max:255',
                    'payment.card_number' => 'required|digits:16',
                    'payment.expiry_date' => ['required', 'regex:/^(0[1-9]|1[0-2])\/\d{2}$/'],
                    'payment.cvc' => 'required|digits_between:3,4'
                ]);
                
                // Store only last 4 digits of card number
                $validatedData['payment']['card_number'] = substr(
                    $request->input('payment.card_number'), -4
                );
            }

            // Update user and social links
            $user = auth()->user();
            $user->update([
                'usage_type' => $validatedData['usage_type'],
                'has_completed_survey' => true
            ]);

            // Sync social links
            $user->socialLinks()->delete();
            foreach ($validatedData['social_links'] as $platform => $url) {
                if (!empty($url)) {
                    $user->socialLinks()->create([
                        'platform' => $platform,
                        'url' => $url
                    ]);
                }
            }

            // Handle business info
            if ($validatedData['usage_type'] === 'business') {

                $slug = Str::slug($request->business_name);
                $user->userIndustry()->updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'business_name_slug' => $slug,
                        'business_name' => $request->input('business_info.business_name'),
                        'parent_industry_id' => $request->input('business_info.parent_industry_id'),
                        'child_industry_id' => $request->input('business_info.child_industry_id')
                    ]
                );

                // Handle payment
                $user->payments()->updateOrCreate(
                    ['user_id' => $user->id],
                    $request->input('payment')
                );
            }

            DB::commit();

            return response()->json([
                'redirect' => $validatedData['usage_type'] === 'business' 
                    ? route('store') 
                    : route('dashboard'),
                'message' => 'Profile setup completed successfully!'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }
} 