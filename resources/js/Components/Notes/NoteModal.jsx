import React, { useState } from 'react';
import { FaThumbtack, FaPalette, FaTrash, FaRegClock, FaImage } from 'react-icons/fa';
import axios from 'axios';

const NoteModal = ({ note, onClose, onUpdate, onDelete, colors }) => {
    const [title, setTitle] = useState(note.title || '');
    const [content, setContent] = useState(note.content || '');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [isPinned, setIsPinned] = useState(note.is_pinned);

    const handleSubmit = async () => {
        if (!content.trim() && !title.trim()) {
            onClose();
            return;
        }

        setIsSaving(true);
        try {
            const response = await axios.patch(`/notes/${note.id}`, {
                title: title.trim() || null,
                content: content.trim(),
                is_pinned: isPinned,
                color_id: note.color?.id || null
            });
            onUpdate(response.data);
            setShowSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            console.error('Error updating note:', error);
            setIsSaving(false);
        }
    };

    const handleColorChange = async (colorId) => {
        try {
            const response = await axios.patch(`/notes/${note.id}`, {
                color_id: colorId,
                title: title.trim() || null,
                content: content.trim(),
                is_pinned: isPinned
            });
            onUpdate(response.data);
            setShowColorPicker(false);
        } catch (error) {
            console.error('Error updating note color:', error);
        }
    };

    const handlePinToggle = async () => {
        try {
            const newPinnedState = !isPinned;
            setIsPinned(newPinnedState);
            
            const response = await axios.patch(`/notes/${note.id}`, {
                is_pinned: newPinnedState,
                title: title.trim() || null,
                content: content.trim(),
                color_id: note.color?.id || null
            });
            onUpdate(response.data);
        } catch (error) {
            console.error('Error toggling pin:', error);
            setIsPinned(!newPinnedState);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div 
                className={`relative bg-white w-full max-w-2xl mx-4 rounded-xl shadow-2xl transform transition-all ${
                    note.color ? `bg-${note.color.name}-50` : ''
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="w-full text-2xl font-medium bg-transparent border-none focus:ring-0 placeholder-gray-400"
                    />
                    
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Take a note..."
                        className="w-full mt-4 min-h-[200px] bg-transparent border-none focus:ring-0 resize-none placeholder-gray-400 text-gray-600"
                    />
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50/80 rounded-b-xl border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        {/* Left Actions */}
                        <div className="flex items-center space-x-2">
                            <button 
                                className={`tool-button ${isPinned ? 'bg-yellow-50' : ''}`}
                                onClick={handlePinToggle}
                                title={isPinned ? "Unpin note" : "Pin note"}
                            >
                                <FaThumbtack 
                                    className={`w-4 h-4 transform transition-transform ${
                                        isPinned ? 'text-yellow-600 rotate-45' : 'text-gray-500'
                                    }`}
                                />
                            </button>
                            <button className="tool-button" title="Add image">
                                <FaImage className="w-4 h-4 text-gray-500" />
                            </button>
                            <div className="relative">
                                <button
                                    className="tool-button"
                                    onClick={() => setShowColorPicker(!showColorPicker)}
                                    title="Change color"
                                >
                                    <FaPalette className="w-4 h-4 text-gray-500" />
                                </button>
                                {showColorPicker && (
                                    <div className="absolute bottom-full left-0 mb-2 p-2 bg-white rounded-lg shadow-xl grid grid-cols-5 gap-1 min-w-[180px]">
                                        {colors.map((color) => (
                                            <button
                                                key={color.id}
                                                onClick={() => handleColorChange(color.id)}
                                                className="w-8 h-8 rounded-full border border-gray-200 hover:border-gray-400 transition-transform hover:scale-110"
                                                style={{ backgroundColor: color.value }}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button className="tool-button" title="Remind me">
                                <FaRegClock className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => onDelete(note.id)}
                                className="tool-button text-red-500 hover:bg-red-50"
                                title="Delete note"
                            >
                                <FaTrash className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSaving}
                                className="save-button"
                            >
                                {showSuccess ? (
                                    <svg className="w-6 h-6 mx-auto animate-check" viewBox="0 0 24 24">
                                        <path
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M20 6L9 17l-5-5"
                                            className="animate-draw"
                                        />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6 mx-auto" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteModal; 