import { useState, useEffect, useRef } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import SearchBar from '@/Components/Notes/SearchBar';
import { IoRefresh, IoSettingsOutline } from 'react-icons/io5';
import axios from 'axios';
import NoteModal from '@/Components/Notes/NoteModal';
import { FaMoon, FaSun, FaTh, FaThList, FaUserCircle, FaTachometerAlt, FaShareAlt, FaSignOutAlt, FaFileAlt, FaTimes, FaBars, FaUser, FaQrcode, FaCreditCard, FaIdCard, FaBell, FaEnvelopeOpenText, FaLightbulb, FaStore, FaMoneyBill, FaClock } from 'react-icons/fa';
import { useDarkMode } from '@/Contexts/DarkModeContext';
import { Head } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import BusinessCard from '@/Components/Profile/BusinessCard';
import SimpleCard from '@/Components/Profile/SimpleCard';
import ProfileInfoDisplay from '@/Components/Profile/ProfileInfoDisplay';

export default function AuthenticatedLayout({ user, header, children, searchQuery, setSearchQuery, viewMode, setViewMode }) {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleView = () => {
        setViewMode(viewMode === 'grid' ? 'list' : 'grid');
    };

    // Safely handle user data
    const userName = user?.name || ''; // Fallback to empty string if name is undefined
    const lowerCaseName = userName.toLowerCase(); // Now safe to call toLowerCase

    // Define navigation items
    const navigationItems = [
        // {
        //     name: 'Dashboard',
        //     icon: <FaTachometerAlt className="w-5 h-5" />,
        //     route: route('dashboard'),
        //     visible: true // Always visible
        // },
        {
            name: 'Socials',
            icon: <FaShareAlt className="w-5 h-5" />,
            route: route('socials'),
            visible: true // Always visible
        },
        {
            name: 'Notes',
            icon: <FaFileAlt className="w-5 h-5" />,
            route: route('dashboard'), // Notes are under the dashboard route
            visible: true // Always visible
        },
        {
            name: 'My Card',
            icon: <FaIdCard className="w-5 h-5" />,
            route: user?.user_industry?.business_name_slug
                ? route('business-profile', { businessName: user.user_industry.business_name_slug })
                : route('profile.edit'), // Fallback to profile if no business name
            visible: true,
            disabled: !user?.user_industry?.business_name_slug,
            tooltip: !user?.user_industry?.business_name_slug 
                ? "Complete your business profile to access this feature" 
                : null
        },
        {
            name: 'Profile',
            icon: <FaUser className="w-5 h-5" />,
            route: route('profile.edit'),
            visible: true // Always visible
        },
        {
            name: 'Payments',
            icon: <FaMoneyBill className="w-5 h-5" />,
            route: route('payments'),
            visible: true // Always visible
        },
        // {
        //     name: 'Store',
        //     icon: <FaStore className="w-5 h-5" />,
        //     route: route('store'),
        //     visible: true // Always visible
        // },
        // {
        //     name: 'Reminders',
        //     icon: <FaClock className="w-5 h-5" />,
        //     route: route('reminders'),
        //     visible: true // Always visible
        // },
        // Add other navigation items here...
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Head title="Raabta" />

            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center">
                        {/* Add left padding to the logo to make space for menu icon */}
                        <Link href="/dashboard" className="flex items-center space-x-2 pl-12">
                            <ApplicationLogo className="h-9 w-auto fill-current text-gray-800 dark:text-white" />
                            <span className="text-xl font-semibold text-gray-800 dark:text-white">Raabta</span>
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

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                        >
                            {isDarkMode ? (
                                <FaSun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            ) : (
                                <FaMoon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="py-12">
                {children}
            </main>

            {/* Mobile Menu Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Menu */}
            <div 
                className={`
                    fixed inset-y-0 left-0 
                    w-64 bg-white dark:bg-gray-800 
                    transform transition-transform duration-300 ease-in-out 
                    shadow-2xl z-50 lg:hidden
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Menu Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <ApplicationLogo className="h-8 w-auto" />
                        <span className="text-xl font-semibold text-gray-900 dark:text-white">
                            Raabta
                        </span>
                    </div>
                </div>

                {/* Menu Items */}
                <nav className="p-4 space-y-2">
                    {navigationItems
                        .filter(item => item.visible) // Filter based on visibility
                        .map((item) => {
                            const itemName = item?.name || ''; // Safely access name with fallback
                            const lowerCaseItemName = itemName.toLowerCase(); // Now safe to call toLowerCase
                            return (
                                <Link
                                    key={item.name}
                                    href={item.route}
                                    className={`
                                        flex items-center space-x-3 p-3 rounded-xl
                                        transition-all duration-200
                                        ${route().current(item.route === '/' ? 'dashboard' : lowerCaseItemName)
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300'
                                        }
                                    `}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <div className="flex-shrink-0 p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {item.description}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                </nav>

                {/* Bottom Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                        href={route('logout')} 
                        method="post" 
                        as="button"
                        className="
                            flex items-center space-x-3 p-3 rounded-xl w-full
                            text-red-600 dark:text-red-400 
                            hover:bg-red-50 dark:hover:bg-red-900/20
                            transition-all duration-200
                        "
                    >
                        <div className="flex-shrink-0 p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                            <FaSignOutAlt className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-medium">Sign Out</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Log out of your account
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Desktop Sidebar - Keep your existing sidebar code for desktop */}
            <div className="hidden lg:block">
                <div 
                    ref={sidebarRef}
                    className={`
                        fixed top-0 left-0 h-full
                        transition-all duration-300 ease-in-out z-40
                        ${isSidebarOpen ? 'w-56 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm' : 'w-14 bg-transparent'}
                        pt-16
                    `}
                >
                    <div className="flex flex-col h-full justify-between">
                        <nav className="px-1 py-3">
                            {navigationItems
                                .filter(item => item.visible) // Filter based on visibility
                                .map((item) => {
                                    const itemName = item?.name || ''; // Safely access name with fallback
                                    const lowerCaseItemName = itemName.toLowerCase(); // Now safe to call toLowerCase
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.route}
                                            className={`
                                                flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'}
                                                px-3 py-2 text-sm font-medium rounded-lg
                                                transition-colors duration-200 group
                                                ${route().current(item.route === '/' ? 'dashboard' : lowerCaseItemName)
                                                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/20'
                                                }
                                            `}
                                        >
                                            <div className={isSidebarOpen ? "flex-shrink-0" : "flex items-center justify-center"}>
                                                {item.icon}
                                            </div>
                                            {isSidebarOpen && (
                                                <span className="ml-3 transition-all duration-200">
                                                    {item.name}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                        </nav>

                        {/* Sign Out Button - Only show when menu is open */}
                        {isSidebarOpen && (
                            <div className="px-2 py-3 mt-auto">
                                <Link
                                    href={route('logout')} 
                                    method="post" 
                                    as="button"
                                    className={`
                                        flex items-center justify-start
                                        px-3 py-2 text-sm font-medium rounded-lg w-full
                                        transition-colors duration-200 group
                                        text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20
                                    `}
                                >
                                    <div className="flex-shrink-0">
                                        <FaSignOutAlt className="w-5 h-5" />
                                    </div>
                                    <span className="ml-3 transition-all duration-200">
                                        LogOut
                                    </span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Menu Icon - Single instance */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
            >
                {isSidebarOpen ? (
                    <FaTimes className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                    <FaBars className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
            </button>
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
