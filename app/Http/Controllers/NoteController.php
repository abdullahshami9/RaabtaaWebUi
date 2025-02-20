<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function update(Request $request, Note $note)
    {
        $this->authorize('update', $note); // Make sure user owns the note

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'color_id' => 'sometimes|nullable|exists:colors,id',
            'is_pinned' => 'sometimes|boolean',
        ]);

        $note->update($validated);

        return response()->json($note->load('color'));
    }
} 