import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaThumbtack, FaPalette } from 'react-icons/fa';
import axios from 'axios';
import NoteModal from './NoteModal';

const Note = ({ note, onUpdate, onDelete, colors }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showHoverActions, setShowHoverActions] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [isPinned, setIsPinned] = useState(note.is_pinned);

    const {
        attributes,
        listeners: dndListeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ 
        id: note.id,
        disabled: showColorPicker
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        backgroundColor: note.color?.value || 'white',
    };

    const handleColorChange = async (colorId, e) => {
        e.stopPropagation();
        try {
            const response = await axios.patch(`/notes/${note.id}`, {
                color_id: colorId,
                title: note.title || null,
                content: note.content,
                is_pinned: isPinned
            });
            onUpdate(response.data);
            setShowColorPicker(false);
        } catch (error) {
            console.error('Error updating note color:', error);
        }
    };

    const handlePin = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        try {
            const newPinnedState = !isPinned;
            setIsPinned(newPinnedState);
            
            const response = await axios.patch(`/notes/${note.id}`, {
                is_pinned: newPinnedState,
                title: note.title || null,
                content: note.content,
                color_id: note.color?.id || null
            });
            onUpdate(response.data);
        } catch (error) {
            console.error('Error toggling pin:', error);
            setIsPinned(!newPinnedState); // Revert on error
        }
    };

    const handleNoteClick = (e) => {
        if (e.target.closest('.note-actions')) {
            return;
        }
        setIsModalOpen(true);
    };

    const getTextColor = () => {
        if (!note.color?.value) return 'text-gray-600';
        return 'text-gray-800';
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                className={`group relative rounded-lg shadow-md p-4 hover:shadow-lg transition-all cursor-pointer`}
                onClick={handleNoteClick}
                onMouseEnter={() => setShowHoverActions(true)}
                onMouseLeave={() => {
                    setShowHoverActions(false);
                    setShowColorPicker(false);
                }}
            >
                <div 
                    className="absolute top-1/2 left-0 w-6 h-12 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-move"
                    {...dndListeners}
                >
                    <div className="w-1 h-6 bg-gray-300 rounded-full mx-auto my-1" />
                    <div className="w-1 h-6 bg-gray-300 rounded-full mx-auto my-1" />
                </div>

                {showHoverActions && (
                    <div className="note-actions absolute top-2 right-2 flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-1 z-10">
                        <button
                            type="button"
                            onClick={handlePin}
                            className={`p-1.5 hover:bg-black/10 rounded-full transition-colors ${
                                isPinned ? 'bg-yellow-50' : ''
                            }`}
                            title={isPinned ? "Unpin note" : "Pin note"}
                        >
                            <FaThumbtack 
                                className={`h-3.5 w-3.5 transform transition-transform ${
                                    isPinned ? 'text-yellow-600 rotate-45' : 'text-gray-600'
                                }`}
                            />
                        </button>
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowColorPicker(!showColorPicker);
                                }}
                                className="p-1.5 hover:bg-black/10 rounded-full transition-colors"
                                title="Change color"
                            >
                                <FaPalette className="h-3.5 w-3.5 text-gray-600" />
                            </button>
                            {showColorPicker && (
                                <div 
                                    className="absolute top-full right-0 mt-1 p-2 bg-white rounded-lg shadow-xl grid grid-cols-4 gap-1 z-20"
                                    onClick={e => e.stopPropagation()}
                                >
                                    {colors.map((color) => (
                                        <button
                                            key={color.id}
                                            onClick={(e) => handleColorChange(color.id, e)}
                                            className="w-6 h-6 rounded-full border border-gray-200 hover:border-gray-400"
                                            style={{ backgroundColor: color.value }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="note-content pl-6">
                    {note.title && (
                        <h3 className={`text-lg font-medium mb-2 ${getTextColor()}`}>
                            {note.title}
                        </h3>
                    )}
                    <p className={getTextColor()}>{note.content}</p>
                </div>
            </div>

            {isModalOpen && (
                <NoteModal
                    note={{...note, is_pinned: isPinned}}
                    onClose={() => setIsModalOpen(false)}
                    onUpdate={(updatedNote) => {
                        setIsPinned(updatedNote.is_pinned);
                        onUpdate(updatedNote);
                    }}
                    onDelete={onDelete}
                    colors={colors}
                />
            )}
        </>
    );
};

export default Note; 