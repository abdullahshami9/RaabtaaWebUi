import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { FaBriefcase, FaUser, FaLink, FaSave } from 'react-icons/fa';
import axios from 'axios';

export default function Survey({ auth }) {
    const [step, setStep] = useState(1);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        usage_type: '',
        selected_platforms: [],
        social_links: {}
    });

    const socialPlatforms = [
        { id: 'facebook', name: 'Facebook', icon: 'facebook.svg' },
        { id: 'twitter', name: 'Twitter', icon: 'twitter.svg' },
        { id: 'instagram', name: 'Instagram', icon: 'instagram.svg' },
        { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin.svg' },
        { id: 'github', name: 'GitHub', icon: 'github.svg' },
        { id: 'youtube', name: 'YouTube', icon: 'youtube.svg' },
        { id: 'tiktok', name: 'TikTok', icon: 'tiktok.svg' },
        { id: 'website', name: 'Website', icon: 'website.svg' }
    ];

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
        setFormData({
            ...formData,
            social_links: { ...formData.social_links, [platform]: value }
        });
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            setError(null);

            // Validate social links
            const hasValidLinks = Object.values(formData.social_links).some(url => url.trim() !== '');
            if (!hasValidLinks) {
                setError('Please add at least one social media link');
                setIsSubmitting(false);
                return;
            }

            const response = await axios.post('/survey', formData);
            
            if (response.data) {
                window.location = '/dashboard';
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

            <div className="max-w-3xl mx-auto px-4 py-12">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3].map((num) => (
                            <div
                                key={num}
                                className={`flex items-center ${num < step ? 'text-blue-600' : 'text-gray-400'}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    num === step ? 'bg-blue-600 text-white' :
                                    num < step ? 'bg-blue-100 text-blue-600' :
                                    'bg-gray-100 text-gray-400'
                                }`}>
                                    {num}
                                </div>
                                {num < 3 && (
                                    <div className={`w-24 h-1 mx-2 ${
                                        num < step ? 'bg-blue-600' : 'bg-gray-200'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step 1: Usage Type */}
                {step === 1 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            How will you use Raabta?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => handleUsageTypeSelect('personal')}
                                className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                            >
                                <FaUser className="w-8 h-8 text-blue-500 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Use</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    Share your personal profile and social media links
                                </p>
                            </button>
                            <button
                                onClick={() => handleUsageTypeSelect('business')}
                                className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                            >
                                <FaBriefcase className="w-8 h-8 text-blue-500 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Business Use</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    Promote your business and professional presence
                                </p>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Platform Selection */}
                {step === 2 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Select your social platforms
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {socialPlatforms.map((platform) => (
                                <button
                                    key={platform.id}
                                    onClick={() => handlePlatformToggle(platform.id)}
                                    className={`p-4 border-2 rounded-xl transition-colors ${
                                        formData.selected_platforms.includes(platform.id)
                                            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
                                            : 'border-gray-200 dark:border-gray-700'
                                    }`}
                                >
                                    <img
                                        src={`/images/social/${platform.icon}`}
                                        alt={platform.name}
                                        className="w-8 h-8 mx-auto mb-2"
                                    />
                                    <p className="text-sm font-medium text-center text-gray-900 dark:text-white">
                                        {platform.name}
                                    </p>
                                </button>
                            ))}
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => setStep(3)}
                                disabled={formData.selected_platforms.length === 0}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Social Links */}
                {step === 3 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Add your social links
                        </h2>
                        
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            {formData.selected_platforms.map((platformId) => {
                                const platform = socialPlatforms.find(p => p.id === platformId);
                                return (
                                    <div key={platformId} className="flex items-center space-x-4">
                                        <img
                                            src={`/images/social/${platform.icon}`}
                                            alt={platform.name}
                                            className="w-6 h-6"
                                        />
                                        <input
                                            type="text"
                                            placeholder={`Your ${platform.name} URL`}
                                            value={formData.social_links[platformId] || ''}
                                            onChange={(e) => handleSocialLinkChange(platformId, e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700"
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8 flex justify-between">
                            <button
                                onClick={() => setStep(2)}
                                className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                disabled={isSubmitting}
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span>Saving...</span>
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                    </>
                                ) : (
                                    <>
                                        <span>Complete Setup</span>
                                        <FaSave className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 