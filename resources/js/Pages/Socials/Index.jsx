import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FaPlus, FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaTiktok, FaFacebook, FaYoutube, FaGlobe, FaTimes, FaCheck, FaLink } from 'react-icons/fa';
import axios from 'axios';

// Common button styles - you can add this as a constant at the top of your file
const circleButtonStyles = {
    base: `
        w-11 h-11 rounded-full flex items-center justify-center
        border-2 transition-all duration-300
        hover:scale-105 hover:shadow-lg
    `,
    disabled: "border-gray-200 dark:border-gray-700 cursor-not-allowed",
    enabled: {
        neutral: "border-gray-400 dark:border-gray-500 hover:border-gray-600 dark:hover:border-gray-400",
        green: "border-green-500 dark:border-green-400 hover:border-green-600 dark:hover:border-green-300",
    },
    icon: {
        base: "w-5 h-5 transition-transform duration-300",
        disabled: "text-gray-300 dark:text-gray-600",
        enabled: {
            neutral: "text-gray-600 dark:text-gray-400",
            green: "text-green-500 dark:text-green-400",
        }
    }
};

export default function Index({ auth, socialLinks: initialSocialLinks }) {
    const [socialLinks, setSocialLinks] = useState(initialSocialLinks || []);
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [username, setUsername] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);

    const socialPlatforms = {
        facebook: {
            id: 'facebook',
            name: 'Facebook',
            icon: FaFacebook,
            color: "text-[#1877F2]",
            prefix: "https://facebook.com/"
        },
        twitter: {
            id: 'twitter',
            name: 'Twitter',
            icon: FaTwitter,
            color: "text-[#1DA1F2]",
            prefix: "https://twitter.com/"
        },
        instagram: {
            id: 'instagram',
            name: 'Instagram',
            icon: FaInstagram,
            color: "text-[#E4405F]",
            prefix: "https://instagram.com/"
        },
        linkedin: {
            id: 'linkedin',
            name: 'LinkedIn',
            icon: FaLinkedin,
            color: "text-[#0A66C2]",
            prefix: "https://linkedin.com/in/"
        },
        github: {
            id: 'github',
            name: 'GitHub',
            icon: FaGithub,
            color: "text-gray-900 dark:text-white",
            prefix: "https://github.com/"
        },
        youtube: {
            id: 'youtube',
            name: 'YouTube',
            icon: FaYoutube,
            color: "text-[#FF0000]",
            prefix: "https://youtube.com/"
        },
        tiktok: {
            id: 'tiktok',
            name: 'TikTok',
            icon: FaTiktok,
            color: "text-gray-900 dark:text-white",
            prefix: "https://tiktok.com/@"
        },
        website: {
            id: 'website',
            name: 'Website',
            icon: FaGlobe,
            color: "text-gray-600 dark:text-gray-300",
            prefix: "https://"
        }
    };

    // Filter out already added platforms
    const availablePlatforms = Object.entries(socialPlatforms).filter(
        ([key]) => !socialLinks.some(link => link.platform === key)
    );

    const validateUsername = (platform, username) => {
        if (!username) return false;
        
        const patterns = {
            facebook: /^[a-zA-Z0-9.]{5,}$/,
            twitter: /^[a-zA-Z0-9_]{4,15}$/,
            instagram: /^[a-zA-Z0-9._]{1,30}$/,
            linkedin: /^[a-zA-Z0-9-]{3,100}$/,
            github: /^[a-zA-Z0-9-]{1,39}$/,
            youtube: /^[@a-zA-Z0-9_-]{3,30}$/,
            tiktok: /^[a-zA-Z0-9._]{2,24}$/,
            website: /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        };

        return patterns[platform]?.test(username) ?? true;
    };

    const handleUsernameChange = (value) => {
        setUsername(value);
        setIsValid(validateUsername(selectedPlatform, value.trim()));
    };

    const resetForm = () => {
        setSelectedPlatform('');
        setUsername('');
        setIsValid(false);
        setIsAddSectionOpen(false);
    };

    const handleAdd = async () => {
        if (!isValid) return;
        try {
            const response = await axios.post('/social-links', {
                platform: selectedPlatform,
                url: socialPlatforms[selectedPlatform].prefix + username.trim()
            });
            setSocialLinks([...socialLinks, response.data]);
            resetForm();
        } catch (error) {
            console.error('Error adding social link:', error);
        }
    };

    const handleDelete = async (linkId) => {
        try {
            await axios.delete(`/social-links/${linkId}`);
            setSocialLinks(socialLinks.filter(link => link.id !== linkId));
        } catch (error) {
            console.error('Error deleting social link:', error);
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Social Links" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Add Social Link Section */}
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            {!isAddSectionOpen ? (
                                <button
                                    onClick={() => setIsAddSectionOpen(true)}
                                    className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                        <FaPlus className="w-4 h-4" />
                                        <span className="font-semibold">Add Social Link</span>
                                    </div>
                                </button>
                            ) : (
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Add Social Link
                                        </h2>
                                        <button
                                            onClick={resetForm}
                                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                        >
                                            <FaTimes className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        {availablePlatforms.map(([key, platform]) => (
                                            <button
                                                key={key}
                                                onClick={() => setSelectedPlatform(key)}
                                                className={`p-4 border-2 rounded-xl transition-colors ${
                                                    selectedPlatform === key
                                                        ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-500/50'
                                                }`}
                                            >
                                                <platform.icon className={`w-8 h-8 mx-auto mb-2 ${platform.color}`} />
                                                <p className="text-sm font-medium text-center text-gray-900 dark:text-white">
                                                    {platform.name}
                                                </p>
                                            </button>
                                        ))}
                                    </div>

                                    {selectedPlatform && (
                                        <div>
                                            <div className={`flex items-center border-2 rounded-lg transition-colors ${
                                                username 
                                                    ? isValid 
                                                        ? 'border-green-500 dark:border-green-400' 
                                                        : 'border-red-500 dark:border-red-400'
                                                    : 'border-gray-200 dark:border-gray-700'
                                            }`}>
                                                    <span className="pl-4 pr-2 py-3 text-gray-500 dark:text-gray-400 border-r-2 border-gray-200 dark:border-gray-700">
                                                        {socialPlatforms[selectedPlatform].prefix}
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={username}
                                                        onChange={(e) => handleUsernameChange(e.target.value)}
                                                        className="flex-1 px-3 py-3 bg-transparent border-none focus:ring-0 dark:text-white"
                                                        placeholder="username"
                                                    />
                                                    {username && (
                                                        <div className="pr-4">
                                                            {isValid ? (
                                                                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                                    <FaCheck className="w-3 h-3 text-green-500 dark:text-green-400" />
                                                                </div>
                                                            ) : (
                                                                <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                                                    <FaTimes className="w-3 h-3 text-red-500 dark:text-red-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            {username && !isValid && (
                                                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                                                    Invalid {socialPlatforms[selectedPlatform].name} username format
                                                </p>
                                            )}
                                            <div className="flex justify-end mt-4">
                                                <button
                                                    onClick={handleAdd}
                                                    disabled={!isValid || !username.trim()}
                                                    className={`
                                                        ${circleButtonStyles.base}
                                                        ${!isValid || !username.trim() 
                                                            ? circleButtonStyles.disabled
                                                            : circleButtonStyles.enabled.green}
                                                        group
                                                    `}
                                                >
                                                    <FaPlus 
                                                        className={`
                                                            ${circleButtonStyles.icon.base}
                                                            ${!isValid || !username.trim()
                                                                ? circleButtonStyles.icon.disabled
                                                                : circleButtonStyles.icon.enabled.green}
                                                            group-hover:rotate-90
                                                        `}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Social Links List Section */}
                    <div className="p-6">
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {socialLinks.map((link) => {
                                const platform = socialPlatforms[link.platform];
                                if (!platform) return null;

                                const IconComponent = platform.icon;
                                return (
                                    <div key={link.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <IconComponent className={`w-6 h-6 ${platform.color}`} />
                                            <div>
                                                <div className="font-medium dark:text-white">
                                                    {platform.name}
                                                </div>
                                                <a 
                                                    href={link.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
                                                >
                                                    {link.url.replace(platform.prefix, '')}
                                                </a>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(link.id)}
                                                className="ml-auto text-gray-400 hover:text-red-500"
                                            >
                                                <FaTimes className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 