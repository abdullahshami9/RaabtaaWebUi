<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotesController extends Controller
{
    public function index()
    {
        $notes = auth()->user()->notes()->latest()->get();
        
        return response()->json($notes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'color_id' => 'nullable|exists:colors,id',
            'is_pinned' => 'boolean',
        ]);

        $note = auth()->user()->notes()->create($validated);
        $note->load('color'); // Load color relationship
        
        return response()->json($note);
    }

    public function update(Request $request, Note $note)
    {
        $this->authorize('update', $note);
        
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'color_id' => 'nullable|exists:colors,id',
            'is_pinned' => 'boolean',
        ]);

        $note->update($validated);
        $note->load('color'); // Load color relationship
        
        return response()->json($note);
    }

    public function destroy(Note $note)
    {
        $this->authorize('delete', $note);
        $note->delete();
        
        return response()->json(['success' => true]);
    }
} 