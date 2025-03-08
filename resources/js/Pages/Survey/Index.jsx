import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { FaBriefcase, FaUser, FaLink, FaSave, FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaTiktok, FaFacebook, FaYoutube, FaGlobe, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const StepIndicator = ({ currentStep }) => {
    const steps = [
        { number: 1, title: 'Usage Type', description: "How you'll use Raabta" },
        { number: 2, title: 'Platforms', description: 'Choose your platforms' },
        { number: 3, title: 'Profile Links', description: 'Add your social links' }
    ];

    return (
        <div className="mb-16">
            <div className="flex justify-between relative max-w-2xl mx-auto">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-[2px] bg-gray-200 dark:bg-gray-700" />
                <div 
                    className="absolute top-5 left-0 h-[2px] bg-green-500 transition-all duration-700 ease-in-out"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => (
                    <div key={step.number} className="relative flex flex-col items-center">
                        <div 
                            className={`
                                w-10 h-10 rounded-full flex items-center justify-center
                                transition-all duration-500 z-10 shadow-sm
                                ${currentStep > step.number
                                    ? 'bg-green-500 text-white scale-110'
                                    : currentStep === step.number
                                    ? 'bg-white dark:bg-gray-900 text-blue-500 ring-2 ring-blue-500 scale-110'
                                    : 'bg-white dark:bg-gray-900 text-gray-400 ring-1 ring-gray-300 dark:ring-gray-600'
                                }
                            `}
                        >
                            {currentStep > step.number ? (
                                <FaCheck className="w-4 h-4 transition-all animate-scale-check" />
                            ) : (
                                <span className="text-sm font-medium">{step.number}</span>
                            )}
                        </div>
                        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-32 text-center">
                            <p className={`text-sm font-medium mb-1 transition-colors ${
                                currentStep > step.number
                                    ? 'text-green-600 dark:text-green-400'
                                    : currentStep === step.number
                                    ? 'text-gray-900 dark:text-white'
                                    : 'text-gray-400'
                            }`}>
                                {step.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

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

export default function Survey({ auth }) {
    const [step, setStep] = useState(1);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        usage_type: '',
        selected_platforms: [],
        social_links: {}
    });
    const [validations, setValidations] = useState({});

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

    const handleUsageTypeSelect = (type) => {
        setFormData({ ...formData, usage_type: type });
        setStep(2);
    };

    const handlePlatformToggle = (platformId) => {
        const platforms = formData.selected_platforms.includes(platformId)
            ? formData.selected_platforms.filter(id => id !== platformId)
            : [...formData.selected_platforms, platformId];
        
        setFormData({ ...formData, selected_platforms: platforms });
    };

    const handleSocialLinkChange = (platform, value) => {
        const trimmedValue = value.trim();
        setFormData({
            ...formData,
            social_links: {
                ...formData.social_links,
                [platform]: trimmedValue  // Store only the username
            }
        });
        setValidations({
            ...validations,
            [platform]: validateUsername(platform, trimmedValue)
        });
    };

    const areAllLinksValid = () => {
        if (formData.selected_platforms.length === 0) return false;

        return formData.selected_platforms.every(platform => {
            const value = formData.social_links[platform]?.trim() || '';
            return value !== '' && validations[platform];
        });
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            setError(null);

            if (!areAllLinksValid()) {
                setError('Please add valid links for all selected platforms');
                setIsSubmitting(false);
                return;
            }

            // Construct the data with full URLs
            const submissionData = {
                ...formData,
                social_links: Object.entries(formData.social_links).reduce((acc, [platform, username]) => ({
                    ...acc,
                    [platform]: socialPlatforms[platform].prefix + username.trim()
                }), {})
            };

            const response = await axios.post('/survey', submissionData);
            
            if (response.data) {
                window.location = '/socials';
            }
        } catch (error) {
            console.error('Error submitting survey:', error);
            setError(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Head title="Complete Your Profile" />

            <div className="max-w-4xl mx-auto px-4 py-16">
                <StepIndicator currentStep={step} />

                {/* Step 1: Usage Type */}
                {step === 1 && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm transition-all duration-500 hover:shadow-md">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                How will you use Raabta?
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                Choose how you want to present yourself on the platform
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <button
                                    onClick={() => handleUsageTypeSelect('personal')}
                                    className="group p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-sm"
                                >
                                    <div className="bg-blue-50 dark:bg-blue-500/10 w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <FaUser className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Use</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        Share your personal profile and social media links
                                    </p>
                                </button>
                                <button
                                    onClick={() => handleUsageTypeSelect('business')}
                                    className="group p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-sm"
                                >
                                    <div className="bg-blue-50 dark:bg-blue-500/10 w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <FaBriefcase className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Business Use</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        Promote your business and professional presence
                                    </p>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Platform Selection */}
                {step === 2 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
                        {/* <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Select your social platforms
                        </h2> */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.values(socialPlatforms).map((platform) => (
                                <button
                                    key={platform.id}
                                    onClick={() => handlePlatformToggle(platform.id)}
                                    className={`p-4 border-2 rounded-xl transition-colors ${
                                        formData.selected_platforms.includes(platform.id)
                                            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
                                            : 'border-gray-200 dark:border-gray-700'
                                    }`}
                                >
                                    <platform.icon className={`w-8 h-8 mx-auto mb-2 ${platform.color}`} />
                                    <p className="text-sm font-medium text-center text-gray-900 dark:text-white">
                                        {platform.name}
                                    </p>
                                </button>
                            ))}
                        </div>
                        <div className="mt-12 flex justify-end">
                            <button
                                onClick={() => setStep(3)}
                                disabled={formData.selected_platforms.length === 0}
                                className={`
                                    ${circleButtonStyles.base}
                                    ${formData.selected_platforms.length === 0
                                        ? circleButtonStyles.disabled
                                        : circleButtonStyles.enabled.green}
                                    group
                                `}
                            >
                                <svg 
                                    className={`
                                        ${circleButtonStyles.icon.base}
                                        ${formData.selected_platforms.length === 0
                                            ? circleButtonStyles.icon.disabled
                                            : circleButtonStyles.icon.enabled.green}
                                        group-hover:translate-x-1
                                    `}
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Social Links */}
                {step === 3 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
                        {/* <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Add your social links
                        </h2> */}
                        
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            {formData.selected_platforms.map((platformId) => {
                                const platform = socialPlatforms[platformId];
                                const Icon = platform.icon;
                                const value = formData.social_links[platformId] || '';
                                const isValid = validations[platformId];
                                
                                return (
                                    <div key={platformId} className="flex items-center space-x-4">
                                        <Icon className={`w-6 h-6 ${platform.color}`} />
                                        <div className="flex-1">
                                            <div className={`flex items-center border-2 rounded-lg transition-colors ${
                                                value 
                                                    ? isValid 
                                                        ? 'border-green-500 dark:border-green-400' 
                                                        : 'border-red-500 dark:border-red-400'
                                                    : 'border-gray-200 dark:border-gray-700'
                                            }`}>
                                                <span className="pl-4 pr-2 py-3 text-gray-500 dark:text-gray-400 border-r-2 border-gray-200 dark:border-gray-700">
                                                    {platform.prefix}
                                                </span>
                                                <input
                                                    type="text"
                                                    placeholder={`Your ${platform.name} username`}
                                                    value={value}
                                                    onChange={(e) => handleSocialLinkChange(platformId, e.target.value)}
                                                    className="flex-1 px-3 py-3 bg-transparent border-none focus:ring-0 dark:text-white"
                                                />
                                                {value && (
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
                                            {value && !isValid && (
                                                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                                                    Invalid {platform.name} username format
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8 flex justify-between items-center">
                            <button
                                onClick={() => setStep(2)}
                                disabled={isSubmitting}
                                className={`
                                    ${circleButtonStyles.base}
                                    ${isSubmitting
                                        ? circleButtonStyles.disabled
                                        : circleButtonStyles.enabled.neutral}
                                    group
                                `}
                            >
                                <svg 
                                    className={`
                                        ${circleButtonStyles.icon.base}
                                        ${isSubmitting
                                            ? circleButtonStyles.icon.disabled
                                            : circleButtonStyles.icon.enabled.neutral}
                                        group-hover:-translate-x-1
                                    `}
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M11 17l-5-5m0 0l5-5m-5 5h12"
                                    />
                                </svg>
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !areAllLinksValid()}
                                className={`
                                    ${circleButtonStyles.base}
                                    ${isSubmitting || !areAllLinksValid()
                                        ? circleButtonStyles.disabled
                                        : circleButtonStyles.enabled.green}
                                    group
                                `}
                            >
                                {isSubmitting ? (
                                    <svg className="animate-spin w-5 h-5 text-gray-400" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                ) : (
                                    <FaCheck 
                                        className={`
                                            ${circleButtonStyles.icon.base}
                                            ${!areAllLinksValid()
                                                ? circleButtonStyles.icon.disabled
                                                : circleButtonStyles.icon.enabled.green}
                                            group-hover:scale-110
                                        `}
                                    />
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 