import React from 'react';
import { FaSearch, FaList, FaThLarge } from 'react-icons/fa';

const SearchBar = ({ searchQuery, setSearchQuery, viewMode, setViewMode }) => {
    return (
        <div className="flex items-center gap-4 w-full max-w-4xl">
            <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Search notes"
                />
            </div>
            <button 
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
                {viewMode === 'grid' ? (
                    <FaList className="h-5 w-5 text-gray-600" />
                ) : (
                    <FaThLarge className="h-5 w-5 text-gray-600" />
                )}
            </button>
        </div>
    );
};

export default SearchBar; 