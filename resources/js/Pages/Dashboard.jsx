import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Note from '@/Components/Notes/Note';
import AddNote from '@/Components/Notes/AddNote';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';

export default function Dashboard({ auth, notes: initialNotes, colors }) {
    const [notes, setNotes] = useState(initialNotes || []);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        if (active.id !== over.id) {
            setNotes((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const filteredNotes = notes.filter(note =>
        note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pinnedNotes = filteredNotes.filter(note => note.is_pinned);
    const unpinnedNotes = filteredNotes.filter(note => !note.is_pinned);

    const handleNoteUpdate = (updatedNote) => {
        setNotes(notes.map(note => 
            note.id === updatedNote.id ? updatedNote : note
        ));
    };

    const handleDeleteNote = async (noteId) => {
        setNotes(notes.filter(note => note.id !== noteId));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            viewMode={viewMode}
            setViewMode={setViewMode}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <AddNote onAdd={(newNote) => setNotes([newNote, ...notes])} />
                    
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={filteredNotes}
                            strategy={rectSortingStrategy}
                        >
                            {pinnedNotes.length > 0 && (
                                <>
                                    <h2 className="text-sm font-medium text-gray-500 mb-4">PINNED</h2>
                                    <div className={`grid gap-4 mb-8 ${
                                        viewMode === 'grid'
                                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                            : 'grid-cols-1'
                                    }`}>
                                        {pinnedNotes.map(note => (
                                            <Note
                                                key={note.id}
                                                note={note}
                                                colors={colors}
                                                onUpdate={handleNoteUpdate}
                                                onDelete={handleDeleteNote}
                                            />
                                        ))}
                                    </div>
                                    <h2 className="text-sm font-medium text-gray-500 mb-4">OTHERS</h2>
                                </>
                            )}
                            
                            <div className={`grid gap-4 ${
                                viewMode === 'grid'
                                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                    : 'grid-cols-1'
                            }`}>
                                {unpinnedNotes.map(note => (
                                    <Note
                                        key={note.id}
                                        note={note}
                                        colors={colors}
                                        onUpdate={handleNoteUpdate}
                                        onDelete={handleDeleteNote}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
