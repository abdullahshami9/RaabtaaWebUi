import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';

const AddNote = ({ onAdd }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !title.trim()) return;

        try {
            const response = await axios.post('/notes', {
                title: title.trim() || null,
                content: content.trim(),
            });
            onAdd(response.data);
            setTitle('');
            setContent('');
            setIsExpanded(false);
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mb-8">
            <form 
                onSubmit={handleSubmit}
                className={`bg-white rounded-lg shadow-md transition-all duration-200 ${
                    isExpanded ? 'p-6' : 'p-4'
                }`}
            >
                {isExpanded && (
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full mb-3 text-lg font-medium placeholder-gray-400 border-none focus:ring-0"
                    />
                )}
                <div className="relative">
                    <textarea
                        placeholder="Take a note..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onClick={() => setIsExpanded(true)}
                        rows={isExpanded ? 3 : 1}
                        className="w-full resize-none border-none placeholder-gray-400 focus:ring-0"
                    />
                    {isExpanded && (
                        <div className="flex justify-end mt-4">
                            <button
                                type="submit"
                                className="flex items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                            >
                                <FaPlus className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddNote; 