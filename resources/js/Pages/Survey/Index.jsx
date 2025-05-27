import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { FaBriefcase, FaUser, FaLink, FaSave, FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaTiktok, FaFacebook, FaYoutube, FaGlobe, FaCheck, FaTimes, FaIndustry, FaCreditCard, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';

const StepIndicator = ({ currentStep, totalSteps, isBusiness }) => {
    const steps = [
        { number: 1, title: 'Usage Type', description: "" },
        { number: 2, title: isBusiness ? 'Business Info' : 'Personal Info', description: '' },
        { number: 3, title: 'Platforms', description: '' },
        { number: 4, title: 'Profile Links', description: '' },
    ];

    if (isBusiness) {
        steps.push({ number: 5, title: 'Payment', description: '' });
    }

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

const navigationButtonStyles = {
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

const industries = [
    {
        parent: 'Technology',
        sub: ['Software Development', 'Hardware Manufacturing', 'IT Services', 'Telecommunications']
    },
    {
        parent: 'Healthcare',
        sub: ['Hospitals', 'Pharmaceuticals', 'Medical Devices', 'Health Insurance']
    },
    {
        parent: 'Finance',
        sub: ['Banking', 'Insurance', 'Investment', 'Fintech']
    },
    {
        parent: 'Retail',
        sub: ['E-commerce', 'Brick & Mortar', 'Wholesale', 'Luxury Goods']
    },
    {
        parent: 'Education',
        sub: ['Schools', 'Universities', 'Online Learning', 'Educational Technology']
    },
    {
        parent: 'Manufacturing',
        sub: ['Automotive', 'Electronics', 'Textiles', 'Heavy Machinery']
    },
    {
        parent: 'Hospitality',
        sub: ['Hotels', 'Restaurants', 'Travel', 'Tourism']
    },
    {
        parent: 'Real Estate',
        sub: ['Residential', 'Commercial', 'Property Management', 'Construction']
    },
    {
        parent: 'Entertainment',
        sub: ['Film & TV', 'Music', 'Gaming', 'Live Events']
    },
    {
        parent: 'Other',
        sub: []
    }
];

export default function Survey({ auth }) {
    const [step, setStep] = useState(1);
    const [isBusiness, setIsBusiness] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        usage_type: '',
        personal_info: {
            username: '',
            is_username_valid: false
        },
        business_info: {
            brand_name: '',
            parent_industry: '',
            sub_industry: '',
            is_brand_name_valid: false
        },
        selected_platforms: [],
        social_links: {}
    });
    const [validations, setValidations] = useState({});
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        cardHolderName: ''
    });
    const [paymentErrors, setPaymentErrors] = useState({});

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
        setFormData({
            ...formData,
            usage_type: type
        });
        setIsBusiness(type === 'business');
        setStep(2);
    };

    const handlePlatformToggle = (platformId) => {
        const platforms = formData.selected_platforms.includes(platformId)
            ? formData.selected_platforms.filter(id => id !== platformId)
            : [...formData.selected_platforms, platformId];
        
        setFormData({ ...formData, selected_platforms: platforms });
    };

    const handleSocialLinkChange = (platformId, value) => {
        const trimmedValue = value.trim();
        setFormData({
            ...formData,
            social_links: {
                ...formData.social_links,
                [platformId]: trimmedValue
            }
        });
        setValidations({
            ...validations,
            [platformId]: validateUsername(platformId, trimmedValue)
        });
    };

    const areAllLinksValid = () => {
        if (formData.selected_platforms.length === 0) return false;

        return formData.selected_platforms.every(platform => {
            const value = formData.social_links[platform]?.trim() || '';
            return value !== '' && validations[platform];
        });
    };

    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.match(/.{1,4}/g)?.join(' ').substring(0, 19) || '';
        setPaymentData(prev => ({...prev, cardNumber: value}));
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        setPaymentData(prev => ({...prev, expiryDate: value.substring(0, 5)}));
    };

    const handleCvcChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        setPaymentData(prev => ({...prev, cvc: value.substring(0, 4)}));
    };

    const validatePaymentData = () => {
        const errors = {};
        const cleanedCardNumber = paymentData.cardNumber.replace(/\s/g, '');
        
        if (!/^\d{16}$/.test(cleanedCardNumber)) {
            errors.cardNumber = 'Invalid card number';
        }
        
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentData.expiryDate)) {
            errors.expiryDate = 'Invalid expiry date';
        }
        
        if (!/^\d{3,4}$/.test(paymentData.cvc)) {
            errors.cvc = 'Invalid CVC';
        }
        
        if (!paymentData.cardHolderName.trim()) {
            errors.cardHolderName = 'Card holder name is required';
        }
        
        return errors;
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            
            // Format social links with platform prefixes
            const formattedLinks = formData.selected_platforms.reduce((acc, platform) => {
                const prefix = socialPlatforms[platform].prefix;
                const username = formData.social_links[platform]?.trim() || '';
                return {
                    ...acc,
                    [platform]: username ? `${prefix}${username}` : ''
                };
            }, {});

            const response = await axios.post(route('survey.store'), {
                usage_type: 'personal',
                selected_platforms: formData.selected_platforms,
                social_links: formattedLinks
            });

            if (response.data.redirect) {
                window.location.href = route('dashboard');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setError(error.response?.data?.message || 'Submission failed. Please check your inputs.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextStep = () => {
        if (step === 4) {
            if (isBusiness) {
                setStep(5);
            } else {
                handleSubmit();
            }
        } else {
            setStep(step + 1);
        }
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const handlePaymentSubmit = async () => {
        try {
            setIsSubmitting(true);
            const paymentErrors = validatePaymentData();
            
            if (Object.keys(paymentErrors).length > 0) {
                setPaymentErrors(paymentErrors);
                return;
            }

            // Format social links and payment data
            const formattedLinks = formData.selected_platforms.reduce((acc, platform) => {
                const prefix = socialPlatforms[platform].prefix;
                const username = formData.social_links[platform]?.trim() || '';
                return {
                    ...acc,
                    [platform]: username ? `${prefix}${username}` : ''
                };
            }, {});

            const response = await axios.post(route('survey.store'), {
                usage_type: 'business',
                selected_platforms: formData.selected_platforms,
                social_links: formattedLinks,
                payment: {
                    card_holder_name: paymentData.cardHolderName,
                    card_number: paymentData.cardNumber.replace(/\s/g, ''),
                    expiry_date: paymentData.expiryDate,
                    cvc: paymentData.cvc
                }
            });

            if (response.data.redirect) {
                window.location.href = route('dashboard');
            }
        } catch (error) {
            console.error('Payment submission error:', error);
            setError(error.response?.data?.message || 'Payment processing failed. Please check your card details.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Head title="Complete Your Profile" />

            <div className="max-w-4xl mx-auto px-4 py-16">
                <StepIndicator currentStep={step} totalSteps={isBusiness ? 5 : 4} isBusiness={isBusiness} />

                {/* Step 1: Usage Type */}
                {step === 1 && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm transition-all duration-500 hover:shadow-md">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                How will you use Raabta?
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                Select the option that best describes how you'll use Raabta
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleUsageTypeSelect('personal')}
                                    className={`
                                        p-6 rounded-xl text-left transition-all duration-200
                                        ${formData.usage_type === 'personal'
                                            ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 scale-[1.02]'
                                            : 'bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md'
                                        }
                                    `}
                                >
                                    <div className="flex items-center space-x-3">
                                        <FaUser className={`w-6 h-6 ${
                                            formData.usage_type === 'personal' 
                                                ? 'text-blue-500 dark:text-blue-400' 
                                                : 'text-gray-500 dark:text-gray-400'
                                        }`} />
                                        <span className={`font-medium ${
                                            formData.usage_type === 'personal'
                                                ? 'text-blue-500 dark:text-blue-400'
                                                : 'text-gray-900 dark:text-white'
                                        }`}>
                                            Personal Use
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        For individual use and personal projects
                                    </p>
                                    <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                                        Free Forever
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        <div className="flex items-center">
                                            <span className="mr-2">•</span>
                                            <span>Add Social Media Profiles</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-2">•</span>
                                            <span>Chat & Messaging</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-2">•</span>
                                            <span>Notes & Reminders</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-2">•</span>
                                            <span>Digital Business Card</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-2">•</span>
                                            <span>Profile Analytics</span>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleUsageTypeSelect('business')}
                                    className={`
                                        p-6 rounded-xl text-left transition-all duration-200
                                        ${formData.usage_type === 'business'
                                            ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 scale-[1.02]'
                                            : 'bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md'
                                        }
                                    `}
                                >
                                    <div className="flex items-center space-x-3">
                                        <FaBriefcase className={`w-6 h-6 ${
                                            formData.usage_type === 'business' 
                                                ? 'text-blue-500 dark:text-blue-400' 
                                                : 'text-gray-500 dark:text-gray-400'
                                        }`} />
                                        <span className={`font-medium ${
                                            formData.usage_type === 'business'
                                                ? 'text-blue-500 dark:text-blue-400'
                                                : 'text-gray-900 dark:text-white'
                                        }`}>
                                            Business Use
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        For business and professional use
                                    </p>
                                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        $0.99/month
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        <div className="flex items-center">
                                            <span className="mr-2">•</span>
                                            <span>All Personal Features Included</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-2">•</span>
                                            <span>Stores & Inventory Management</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-2">•</span>
                                            <span>E-commerce Integration</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-2">•</span>
                                            <span>Payment Processing</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-2">•</span>
                                            <span>Team Account Management</span>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Platform Selection */}
                {step === 2 && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm transition-all duration-500 hover:shadow-md">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {formData.usage_type === 'personal' ? 'Personal Information' : 'Business Information'}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                {formData.usage_type === 'personal' 
                                    ? 'Tell us more about yourself' 
                                    : 'Tell us more about your business'}
                            </p>
                            {formData.usage_type === 'personal' ? (
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Choose a username
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="username"
                                                value={formData.personal_info.username}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setFormData({
                                                        ...formData,
                                                        personal_info: {
                                                            ...formData.personal_info,
                                                            username: value,
                                                            is_username_valid: value.trim().length >= 3
                                                        }
                                                    });
                                                }}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 pr-10"
                                                placeholder="Enter your username"
                                            />
                                            {formData.personal_info.username && (
                                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                                    {formData.personal_info.is_username_valid ? (
                                                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                            <FaCheck className="w-3 h-3 text-green-500 dark:text-green-400" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                                            <FaTimes className="w-3 h-3 text-red-500 dark:text-red-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {formData.personal_info.username && !formData.personal_info.is_username_valid && (
                                            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                                                Username must be at least 3 characters
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="brand_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Business Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="brand_name"
                                                value={formData.business_info.brand_name}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setFormData({
                                                        ...formData,
                                                        business_info: {
                                                            ...formData.business_info,
                                                            brand_name: value,
                                                            is_brand_name_valid: value.length >= 3
                                                        }
                                                    });
                                                }}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 pr-10"
                                                placeholder="Enter your business name"
                                            />
                                            {formData.business_info.brand_name && (
                                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                                    {formData.business_info.is_brand_name_valid ? (
                                                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                            <FaCheck className="w-3 h-3 text-green-500 dark:text-green-400" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                                            <FaTimes className="w-3 h-3 text-red-500 dark:text-red-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {formData.business_info.brand_name && !formData.business_info.is_brand_name_valid && (
                                            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                                                Business name must be at least 3 characters
                                            </p>
                                        )}
                                    </div>

                                    {/* Industry Selection */}
                                    <div>
                                        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Industry
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Parent Industry Dropdown */}
                                            <div className="relative">
                                                <select
                                                    value={formData.business_info.parent_industry || ''}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        business_info: {
                                                            ...formData.business_info,
                                                            parent_industry: e.target.value,
                                                            sub_industry: '' // Reset sub-industry when parent changes
                                                        }
                                                    })}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 appearance-none"
                                                >
                                                    <option value="">Select Parent Industry</option>
                                                    {industries.map((industry) => (
                                                        <option key={industry.parent} value={industry.parent}>
                                                            {industry.parent}
                                                        </option>
                                                    ))}
                                                </select>
                                                <FaIndustry className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>

                                            {/* Sub-Industry Dropdown */}
                                            <div className="relative">
                                                <select
                                                    value={formData.business_info.sub_industry || ''}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        business_info: {
                                                            ...formData.business_info,
                                                            sub_industry: e.target.value
                                                        }
                                                    })}
                                                    disabled={!formData.business_info.parent_industry}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 appearance-none disabled:opacity-50"
                                                >
                                                    <option value="">Select Sub-Industry</option>
                                                    {formData.business_info.parent_industry && 
                                                        industries
                                                            .find(i => i.parent === formData.business_info.parent_industry)
                                                            ?.sub.map((subIndustry) => (
                                                                <option key={subIndustry} value={subIndustry}>
                                                                    {subIndustry}
                                                                </option>
                                                            ))
                                                    }
                                                </select>
                                                <FaIndustry className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 flex justify-between">
                                <button
                                    onClick={() => setStep(1)}
                                    className={`
                                        ${navigationButtonStyles.base}
                                        ${navigationButtonStyles.enabled.neutral}
                                        group
                                    `}
                                >
                                    <svg 
                                        className={`
                                            ${navigationButtonStyles.icon.base}
                                            ${navigationButtonStyles.icon.enabled.neutral}
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
                                    onClick={() => setStep(3)}
                                    disabled={
                                        formData.usage_type === 'personal' 
                                            ? !formData.personal_info.is_username_valid
                                            : !formData.business_info.is_brand_name_valid || 
                                              !formData.business_info.parent_industry
                                    }
                                    className={`
                                        ${navigationButtonStyles.base}
                                        ${(formData.usage_type === 'personal' 
                                            ? !formData.personal_info.is_username_valid
                                            : !formData.business_info.is_brand_name_valid || !formData.business_info.parent_industry)
                                            ? navigationButtonStyles.disabled
                                            : navigationButtonStyles.enabled.green}
                                        group
                                    `}
                                >
                                    <svg 
                                        className={`
                                            ${navigationButtonStyles.icon.base}
                                            ${(formData.usage_type === 'personal' 
                                                ? !formData.personal_info.is_username_valid
                                                : !formData.business_info.is_brand_name_valid || !formData.business_info.parent_industry)
                                                ? navigationButtonStyles.icon.disabled
                                                : navigationButtonStyles.icon.enabled.green}
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
                    </div>
                )}

                {/* Step 3: Platform Selection */}
                {step === 3 && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm transition-all duration-500 hover:shadow-md">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Choose your platforms
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                Select the platforms you want to connect
                            </p>
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
                            <div className="mt-8 flex justify-between">
                                <button
                                    onClick={() => setStep(2)}
                                    className={`
                                        ${navigationButtonStyles.base}
                                        ${navigationButtonStyles.enabled.neutral}
                                        group
                                    `}
                                >
                                    <svg 
                                        className={`
                                            ${navigationButtonStyles.icon.base}
                                            ${navigationButtonStyles.icon.enabled.neutral}
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
                                    onClick={() => setStep(4)}
                                    disabled={formData.selected_platforms.length === 0}
                                    className={`
                                        ${navigationButtonStyles.base}
                                        ${formData.selected_platforms.length === 0
                                            ? navigationButtonStyles.disabled
                                            : navigationButtonStyles.enabled.green}
                                        group
                                    `}
                                >
                                    <svg 
                                        className={`
                                            ${navigationButtonStyles.icon.base}
                                            ${formData.selected_platforms.length === 0
                                                ? navigationButtonStyles.icon.disabled
                                                : navigationButtonStyles.icon.enabled.green}
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
                    </div>
                )}

                {/* Step 4: Social Links */}
                {step === 4 && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm transition-all duration-500 hover:shadow-md">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Add your social links
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                Enter your profile links for the selected platforms
                            </p>
                            
                            {error && (
                                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
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

                            <div className="mt-8 flex justify-between">
                                <button
                                    onClick={handlePreviousStep}
                                    className={`
                                        ${navigationButtonStyles.base}
                                        ${navigationButtonStyles.enabled.neutral}
                                        group
                                    `}
                                >
                                    <svg 
                                        className={`
                                            ${navigationButtonStyles.icon.base}
                                            ${navigationButtonStyles.icon.enabled.neutral}
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
                                
                                {isBusiness ? (
                                    <button
                                        onClick={handleNextStep}
                                        disabled={isSubmitting || !areAllLinksValid()}
                                        className={`
                                            ${navigationButtonStyles.base}
                                            ${isSubmitting || !areAllLinksValid()
                                                ? navigationButtonStyles.disabled
                                                : navigationButtonStyles.enabled.green}
                                            group
                                        `}
                                    >
                                        {isSubmitting ? (
                                            <svg className="animate-spin w-5 h-5 text-gray-400" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                        ) : (
                                            <FaArrowRight 
                                                className={`
                                                    ${navigationButtonStyles.icon.base}
                                                    ${!areAllLinksValid()
                                                        ? navigationButtonStyles.icon.disabled
                                                        : navigationButtonStyles.icon.enabled.green}
                                                    group-hover:scale-110
                                                `}
                                            />
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || !areAllLinksValid()}
                                        className={`
                                            ${navigationButtonStyles.base}
                                            ${isSubmitting || !areAllLinksValid()
                                                ? navigationButtonStyles.disabled
                                                : navigationButtonStyles.enabled.green}
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
                                                    ${navigationButtonStyles.icon.base}
                                                    ${!areAllLinksValid()
                                                        ? navigationButtonStyles.icon.disabled
                                                        : navigationButtonStyles.icon.enabled.green}
                                                    group-hover:scale-110
                                                `}
                                            />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 5: Payment Information */}
                {step === 5 && isBusiness && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm transition-all duration-500 hover:shadow-md">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Payment Information
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                Complete your payment to activate your business account
                            </p>

                            <div className="space-y-4">
                                {/* Card Holder Name */}
                                <div>
                                    <label htmlFor="card_holder_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Card Holder Name
                                    </label>
                                    <input
                                        type="text"
                                        id="card_holder_name"
                                        value={paymentData.cardHolderName}
                                        onChange={(e) => setPaymentData({...paymentData, cardHolderName: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                        placeholder="John Doe"
                                    />
                                    {paymentErrors.cardHolderName && (
                                        <p className="text-sm text-red-500 mt-1">{paymentErrors.cardHolderName}</p>
                                    )}
                                </div>

                                {/* Card Number */}
                                <div>
                                    <label htmlFor="card_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Card Number
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="card_number"
                                            value={paymentData.cardNumber}
                                            onChange={handleCardNumberChange}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                            placeholder="0000 0000 0000 0000"
                                            maxLength="19"
                                        />
                                        <FaCreditCard className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                    {paymentErrors.cardNumber && (
                                        <p className="text-sm text-red-500 mt-1">{paymentErrors.cardNumber}</p>
                                    )}
                                </div>

                                {/* Expiry Date and CVC */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Expiry Date
                                        </label>
                                        <input
                                            type="text"
                                            id="expiry"
                                            value={paymentData.expiryDate}
                                            onChange={handleExpiryChange}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                            placeholder="MM/YY"
                                            maxLength="5"
                                        />
                                        {paymentErrors.expiryDate && (
                                            <p className="text-sm text-red-500 mt-1">{paymentErrors.expiryDate}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            CVC
                                        </label>
                                        <input
                                            type="text"
                                            id="cvc"
                                            value={paymentData.cvc}
                                            onChange={handleCvcChange}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                            placeholder="123"
                                            maxLength="4"
                                        />
                                        {paymentErrors.cvc && (
                                            <p className="text-sm text-red-500 mt-1">{paymentErrors.cvc}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-between">
                                <button
                                    onClick={handlePreviousStep}
                                    className={`
                                        ${navigationButtonStyles.base}
                                        ${navigationButtonStyles.enabled.neutral}
                                        group
                                    `}
                                >
                                    <svg 
                                        className={`
                                            ${navigationButtonStyles.icon.base}
                                            ${navigationButtonStyles.icon.enabled.neutral}
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
                                    onClick={handlePaymentSubmit}
                                    className={`
                                        ${navigationButtonStyles.base}
                                        ${navigationButtonStyles.enabled.green}
                                        group
                                    `}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <svg className="animate-spin w-5 h-5 text-gray-400" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                    ) : (
                                        <FaCheck 
                                            className={`
                                                ${navigationButtonStyles.icon.base}
                                                ${navigationButtonStyles.icon.enabled.green}
                                                group-hover:scale-110
                                            `}
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 