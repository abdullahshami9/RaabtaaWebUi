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

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: note.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleColorChange = async (colorId, e) => {
        e.stopPropagation(); // Prevent modal from opening
        try {
            const response = await axios.patch(`/notes/${note.id}`, {
                color_id: colorId
            });
            onUpdate(response.data);
            setShowColorPicker(false);
        } catch (error) {
            console.error('Error updating note color:', error);
        }
    };

    const handlePin = async (e) => {
        e.stopPropagation(); // Prevent modal from opening
        try {
            const response = await axios.patch(`/notes/${note.id}`, {
                is_pinned: !note.is_pinned
            });
            onUpdate(response.data);
        } catch (error) {
            console.error('Error toggling pin:', error);
        }
    };

    const handleNoteClick = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className={`group relative rounded-lg shadow-md p-4 hover:shadow-lg transition-all cursor-pointer ${note.color ? `bg-${note.color.name}-100` : 'bg-white'}`}
                onClick={handleNoteClick}
                onMouseEnter={() => setShowHoverActions(true)}
                onMouseLeave={() => {
                    setShowHoverActions(false);
                    setShowColorPicker(false);
                }}
            >
                {/* Pin and Color Actions */}
                {showHoverActions && (
                    <div className="absolute top-2 right-2 flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-1 z-10">
                        <button
                            onClick={handlePin}
                            className="p-1.5 hover:bg-black/10 rounded-full transition-colors"
                            title={note.is_pinned ? "Unpin note" : "Pin note"}
                        >
                            <FaThumbtack 
                                className={`h-3.5 w-3.5 ${note.is_pinned ? 'text-yellow-600' : 'text-gray-600'}`}
                                style={{ transform: note.is_pinned ? 'rotate(45deg)' : 'none' }}
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

                {/* Note Content */}
                {note.title && <h3 className="text-lg font-medium mb-2">{note.title}</h3>}
                <p className="text-gray-600">{note.content}</p>
            </div>

            {/* Note Modal */}
            {isModalOpen && (
                <NoteModal
                    note={note}
                    onClose={() => setIsModalOpen(false)}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    colors={colors}
                />
            )}
        </>
    );
};

export default Note; 