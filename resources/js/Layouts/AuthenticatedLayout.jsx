import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import SearchBar from '@/Components/Notes/SearchBar';
import { IoRefresh, IoSettingsOutline } from 'react-icons/io5';
import axios from 'axios';
import NoteModal from '@/Components/Notes/NoteModal';
import { FaMoon, FaSun, FaTh, FaThList } from 'react-icons/fa';
import { useDarkMode } from '@/Contexts/DarkModeContext';

export default function Authenticated({ user, children, searchQuery, setSearchQuery, viewMode, setViewMode }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [note, setNote] = useState(null);
    const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    const handleColorChange = async (colorId) => {
        try {
            const response = await axios.patch(`/notes/${note.id}`, {
                color_id: colorId
            });
            setNote(response.data);
        } catch (error) {
            console.error('Error updating note color:', error);
        }
    };

    const handlePinToggle = async () => {
        try {
            const response = await axios.patch(`/notes/${note.id}`, {
                is_pinned: !note.is_pinned
            });
            setNote(response.data);
        } catch (error) {
            console.error('Error toggling pin:', error);
        }
    };

    const toggleView = () => {
        setViewMode(viewMode === 'grid' ? 'list' : 'grid');
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="flex items-center space-x-2">
                                <ApplicationLogo className="h-9 w-auto fill-current text-gray-800 dark:text-white" />
                                <span className="text-xl font-semibold text-gray-800 dark:text-white">Keep</span>
                            </Link>
                        </div>

                        <div className="flex-1 max-w-3xl mx-8">
                            <SearchBar
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* View Toggle Button */}
                            <button
                                onClick={toggleView}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
                            >
                                {viewMode === 'grid' ? (
                                    <FaThList className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                ) : (
                                    <FaTh className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                )}
                            </button>

                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                <IoRefresh className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </button>
                            
                            {/* Settings Dropdown */}
                            <div className="relative">
                                <button 
                                    onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                >
                                    <IoSettingsOutline className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                </button>

                                {showSettingsDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                                        <div className="px-4 py-2">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Settings</p>
                                            <button
                                                onClick={() => {
                                                    toggleDarkMode();
                                                    setShowSettingsDropdown(false);
                                                }}
                                                className="flex items-center space-x-2 w-full p-2 mt-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                {isDarkMode ? (
                                                    <>
                                                        <FaSun className="h-5 w-5 text-yellow-500" />
                                                        <span className="text-gray-600 dark:text-gray-300">Light Mode</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaMoon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                                        <span className="text-gray-600 dark:text-gray-300">Dark Mode</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                            {user.profile_photo_url ? (
                                                <img
                                                    src={user.profile_photo_url}
                                                    alt={user.name}
                                                    className="h-full w-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-800 dark:text-white">{user.name}</p>
                                        </div>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="py-6 dark:bg-gray-900">{children}</main>

            {showModal && (
                <NoteModal
                    note={note}
                    onClose={() => setShowModal(false)}
                    onUpdate={setNote}
                />
            )}
        </div>
    );
}

const Note = ({ note, onUpdate }) => {
    const [showModal, setShowModal] = useState(false);
    
    const handleColorChange = async (colorId) => {
        try {
            const response = await axios.patch(`/notes/${note.id}`, {
                color_id: colorId
            });
            onUpdate(response.data);
        } catch (error) {
            console.error('Error updating note color:', error);
        }
    };

    const handlePinToggle = async () => {
        try {
            const response = await axios.patch(`/notes/${note.id}`, {
                is_pinned: !note.is_pinned
            });
            onUpdate(response.data);
        } catch (error) {
            console.error('Error toggling pin:', error);
        }
    };

    return (
        <div 
            className={`note-card ${note.color ? `bg-${note.color.name}` : ''}`}
            onClick={() => setShowModal(true)}
        >
            <div className="note-actions" onClick={e => e.stopPropagation()}>
                <button
                    onClick={handlePinToggle}
                    className={`pin-button ${note.is_pinned ? 'pinned' : ''}`}
                >
                    📌
                </button>
                <div className="color-picker">
                    {colors.map(color => (
                        <button
                            key={color.id}
                            className={`color-option bg-${color.name}`}
                            onClick={() => handleColorChange(color.id)}
                        />
                    ))}
                </div>
            </div>

            <h3>{note.title}</h3>
            <p>{note.content}</p>

            {showModal && (
                <NoteModal
                    note={note}
                    onClose={() => setShowModal(false)}
                    onUpdate={onUpdate}
                />
            )}
        </div>
    );
};
