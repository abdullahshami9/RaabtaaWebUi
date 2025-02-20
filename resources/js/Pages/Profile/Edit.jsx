import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { FaUser, FaLock, FaShieldAlt, FaCamera } from 'react-icons/fa';

export default function Edit({ auth, mustVerifyEmail, status }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [showAvatarHover, setShowAvatarHover] = useState(false);

    const tabs = [
        { 
            id: 'profile', 
            label: 'Personal Info',
            icon: FaUser,
            description: 'Basic info, like your name and photo'
        },
        { 
            id: 'security', 
            label: 'Security',
            icon: FaLock,
            description: 'Settings and recommendations to help you keep your account secure'
        },
        { 
            id: 'privacy', 
            label: 'Data & Privacy',
            icon: FaShieldAlt,
            description: 'Controls for managing your data and privacy settings'
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Profile" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {/* Profile Header */}
                    <div className="flex flex-col items-center mb-12">
                        {/* Avatar Section */}
                        <div 
                            className="relative group"
                            onMouseEnter={() => setShowAvatarHover(true)}
                            onMouseLeave={() => setShowAvatarHover(false)}
                        >
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center text-4xl font-semibold text-white shadow-lg">
                                {auth.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className={`absolute inset-0 rounded-full bg-black/50 flex items-center justify-center transition-opacity duration-200 cursor-pointer ${showAvatarHover ? 'opacity-100' : 'opacity-0'}`}>
                                <FaCamera className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        
                        <h1 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
                            {auth.user.name}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">{auth.user.email}</p>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    p-4 rounded-xl text-left transition-all duration-200
                                    ${activeTab === tab.id
                                        ? 'bg-white dark:bg-gray-800 shadow-md scale-[1.02]'
                                        : 'bg-gray-100 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md'
                                    }
                                `}
                            >
                                <div className="flex items-center space-x-3">
                                    <tab.icon className={`w-5 h-5 ${
                                        activeTab === tab.id 
                                            ? 'text-blue-500 dark:text-blue-400' 
                                            : 'text-gray-500 dark:text-gray-400'
                                    }`} />
                                    <span className={`font-medium ${
                                        activeTab === tab.id
                                            ? 'text-blue-500 dark:text-blue-400'
                                            : 'text-gray-900 dark:text-white'
                                    }`}>
                                        {tab.label}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    {tab.description}
                                </p>
                            </button>
                        ))}
                    </div>

                    {/* Content Panel */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="p-8">
                            {activeTab === 'profile' && (
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />
                            )}

                            {activeTab === 'security' && (
                                <UpdatePasswordForm />
                            )}

                            {activeTab === 'privacy' && (
                                <DeleteUserForm />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
