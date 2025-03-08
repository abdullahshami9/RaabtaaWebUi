<?php

namespace App\Http\Controllers;

use App\Models\SocialLink;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SocialLinkController extends Controller
{
    public function index()
    {
        return auth()->user()->socialLinks;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'platform' => 'required|string',
            'url' => 'required|url'
        ]);

        $socialLink = auth()->user()->socialLinks()->create($validated);
        return response()->json($socialLink);
    }

    public function update(Request $request, SocialLink $socialLink)
    {
        $this->authorize('update', $socialLink);

        $validated = $request->validate([
            'url' => 'required|url'
        ]);

        $socialLink->update($validated);
        return response()->json($socialLink);
    }

    public function destroy(SocialLink $socialLink)
    {
        $this->authorize('delete', $socialLink);
        $socialLink->delete();
        return response()->json(['success' => true]);
    }

    public function showPage()
    {
        // Debug what's being passed
        $data = [
            'socialLinks' => auth()->user()->socialLinks,
            'auth' => [
                'user' => auth()->user()
            ]
        ];
        
        // Log the data
        \Log::info('Social Links Data:', $data);
        
        return Inertia::render('Socials/Index', $data);
    }

    public function reorder(Request $request)
    {
        $items = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:social_links,id',
            'items.*.order' => 'required|integer'
        ])['items'];

        foreach ($items as $item) {
            SocialLink::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json(['success' => true]);
    }
} 