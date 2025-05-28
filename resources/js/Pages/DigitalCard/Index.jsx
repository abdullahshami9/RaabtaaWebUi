import { useEffect, useState, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import { 
    FaTimes, FaDownload, FaQrcode, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
    FaBuilding, FaIndustry, FaCalendarAlt, FaShareAlt, FaCopy, FaImages, 
    FaPlus, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube,
    FaGithub, FaTiktok, FaSnapchat, FaWhatsapp, FaGlobe, FaEye, FaStar,
    FaAward, FaBriefcase, FaUsers, FaHeart, FaBookmark, FaExternalLinkAlt,
    FaCheck, FaArrowRight
} from 'react-icons/fa';
import axios from 'axios';
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; 

const StepIndicator = ({ currentStep, totalSteps, onStepClick }) => {
    const steps = [
        { number: 1, title: 'Overview', description: "" },
        { number: 2, title: 'Contact & QR', description: '' },
        { number: 3, title: 'Gallery', description: '' },
        { number: 4, title: 'Achievements', description: '' },
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
                    <div 
                        key={step.number} 
                        className="relative flex flex-col items-center cursor-pointer"
                        onClick={() => onStepClick(step.number)}
                    >
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

const DigitalCard = () => {
    const { auth, userData, socialLinks } = usePage().props;
    const [currentStep, setCurrentStep] = useState(1);
    
    // State management
    const [showScanner, setShowScanner] = useState(false);
    const [scanResult, setScanResult] = useState('');
    const [copied, setCopied] = useState(false);
    const [viewCount, setViewCount] = useState(userData.view_count || 0);
    const [likeCount, setLikeCount] = useState(userData.like_count || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [galleryImages, setGalleryImages] = useState(userData.gallery_images || [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop'
    ]);
    const [selectedImage, setSelectedImage] = useState(null);
    
    // Generate profile URL
    const profileUrl = `${window.location.origin}/${userData.business_name_slug}`;

    // Enhanced user data for QR code
    const qrData = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone || 'Not provided',
        address: userData.address || 'Not provided',
        businessName: userData.business_name_slug || 'Professional',
        parentIndustry: userData.parent_industry?.name || 'Not specified',
        childIndustry: userData.child_industry?.name || 'Not specified',
        memberSince: userData.created_at,
        profileUrl: profileUrl,
        socials: socialLinks,
        bio: userData.bio || "Professional dedicated to excellence and innovation.",
        achievements: userData.achievements || ["Industry Expert", "Top Performer", "Certified Professional"],
        skills: userData.skills || ["Leadership", "Strategy", "Innovation", "Team Building"]
    };
// console.log();
    // Handle like action
    const handleLike = async () => {
        try {
            const response = await axios.post(`/like-profile/${userData.id}`);
            setIsLiked(!isLiked);
            setLikeCount(response.data.like_count);
        } catch (error) {
            console.error('Error liking profile:', error);
        }
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${qrData.name} - Digital Business Card`,
                    text: `Check out ${qrData.name}'s professional profile`,
                    url: qrData.profileUrl,
                });
            } catch (err) {
                console.log('Error sharing:', err);
                copyToClipboard(qrData.profileUrl);
            }
        } else {
            copyToClipboard(qrData.profileUrl);
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const handleCopyData = async () => {
        const dataText = `
${qrData.name}
${qrData.businessName}
📧 ${qrData.email}
📱 ${qrData.phone}
🏢 ${qrData.parentIndustry} - ${qrData.childIndustry}
🌐 ${qrData.profileUrl}
        `.trim();
        
        await copyToClipboard(dataText);
    };

    const downloadQR = () => {
        const svg = document.querySelector('.qr-code-container svg');
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const blob = new Blob([svgData], {type: "image/svg+xml"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${userData.business_name}-digital-card.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    const getSocialIcon = (platform) => {
        const iconProps = { className: "w-5 h-5" };
        switch (platform.toLowerCase()) {
            case 'facebook': return <FaFacebook {...iconProps} />;
            case 'twitter': return <FaTwitter {...iconProps} />;
            case 'linkedin': return <FaLinkedin {...iconProps} />;
            case 'instagram': return <FaInstagram {...iconProps} />;
            case 'youtube': return <FaYoutube {...iconProps} />;
            case 'github': return <FaGithub {...iconProps} />;
            case 'tiktok': return <FaTiktok {...iconProps} />;
            case 'snapchat': return <FaSnapchat {...iconProps} />;
            case 'whatsapp': return <FaWhatsapp {...iconProps} />;
            default: return <FaShareAlt {...iconProps} />;
        }
    };

    const getSocialColor = (platform) => {
        switch (platform.toLowerCase()) {
            case 'facebook': return 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800';
            case 'twitter': return 'from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700';
            case 'linkedin': return 'from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900';
            case 'instagram': return 'from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600';
            case 'youtube': return 'from-red-600 to-red-700 hover:from-red-700 hover:to-red-800';
            case 'github': return 'from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black';
            case 'tiktok': return 'from-black to-gray-800 hover:from-gray-900 hover:to-gray-700';
            case 'snapchat': return 'from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600';
            case 'whatsapp': return 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700';
            default: return 'from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800';
        }
    };

    // Track view count on component mount
    useEffect(() => {
        const trackView = async () => {
            try {
                const response = await axios.post(`/track-view/${userData.id}`);
                setViewCount(response.data.view_count);
            } catch (error) {
                console.error('Error tracking view:', error);
            }
        };
        
        trackView();
    }, []);

    const handleStepClick = (stepNumber) => {
        setCurrentStep(stepNumber);
    };

    return (
        // <AuthenticatedLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900">
            <Head title={`${qrData.name} - Digital Card`} />
            
            {/* Hero Section with Cover */}
            <div className="relative h-80 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-10"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
                    <div className="flex items-end gap-6 w-full">
                        {/* Profile Image */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-5xl font-bold text-white shadow-2xl">
                                {userData.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        </div>
                        
                        {/* Profile Info */}
                        <div className="flex-1 text-white">
                            <h1 className="text-4xl font-bold mb-2">{userData.name}</h1>
                            <p className="text-xl text-white/90 mb-2">{qrData.businessName}</p>
                            <p className="text-white/80 mb-4">{qrData.bio}</p>
                            <div className="flex items-center gap-6 text-sm text-white/70">
                                <div className="flex items-center gap-1">
                                    <FaEye className="w-4 h-4" />
                                    <span>{viewCount} views</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaUsers className="w-4 h-4" />
                                    <span>Professional Network</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaCalendarAlt className="w-4 h-4" />
                                    <span>Member since {new Date(userData.created_at).getFullYear()}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={handleLike}
                                className={`p-3 rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-200 ${
                                    isLiked ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                            >
                                <FaHeart className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={handleBookmark}
                                className={`p-3 rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-200 ${
                                    isBookmarked ? 'bg-yellow-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                            >
                                <FaBookmark className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={handleShare}
                                className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                            >
                                <FaShareAlt className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{likeCount}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Likes</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{viewCount}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Views</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">4.9</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Rating</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <FaGlobe className="w-4 h-4" />
                            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">
                                /{userData.business_name_slug}
                            </code>
                        </div>
                    </div>
                </div>
            </div>

            {/* Step Navigation */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <StepIndicator currentStep={currentStep} totalSteps={4} onStepClick={handleStepClick} />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Overview Step */}
                {currentStep === 1 && (
                    <div className="space-y-8">
                        {/* Professional Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Professional Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <InfoCard 
                                        icon={<FaBuilding className="w-5 h-5 text-blue-500" />}
                                        title="Business Name" 
                                        value={qrData.businessName}
                                        highlight={true}
                                    />
                                    <InfoCard 
                                        icon={<FaIndustry className="w-5 h-5 text-purple-500" />}
                                        title="Industry" 
                                        value={qrData.parentIndustry}
                                    />
                                    <InfoCard 
                                        icon={<FaBriefcase className="w-5 h-5 text-green-500" />}
                                        title="Specialization" 
                                        value={qrData.childIndustry}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Skills & Achievements Preview */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Core Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {qrData.skills.map((skill, index) => (
                                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Achievements</h3>
                                <div className="space-y-2">
                                    {qrData.achievements.map((achievement, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <FaStar className="w-4 h-4 text-yellow-500" />
                                            <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact & QR Step */}
                {currentStep === 2 && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Contact Information */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h2>
                                <div className="space-y-4">
                                    <InfoCard 
                                        icon={<FaEnvelope className="w-5 h-5 text-blue-500" />}
                                        title="Email" 
                                        value={userData.email}
                                        copyable={true}
                                    />
                                    <InfoCard 
                                        icon={<FaPhone className="w-5 h-5 text-green-500" />}
                                        title="Phone" 
                                        value={userData.phone || 'Not provided'}
                                        copyable={!!userData.phone}
                                    />
                                    <InfoCard 
                                        icon={<FaMapMarkerAlt className="w-5 h-5 text-red-500" />}
                                        title="Address" 
                                        value={userData.address || 'Not provided'}
                                    />
                                    <InfoCard 
                                        icon={<FaGlobe className="w-5 h-5 text-indigo-500" />}
                                        title="Profile URL" 
                                        value={profileUrl}
                                        copyable={true}
                                    />
                                </div>
                                
                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <button 
                                        onClick={handleCopyData}
                                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <FaCopy className="w-4 h-4" />
                                        {copied ? 'Copied to Clipboard!' : 'Copy All Contact Info'}
                                    </button>
                                </div>
                            </div>

                            {/* QR Code Section */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">QR Code</h2>
                                
                                <div className="text-center">
                                    <div className="qr-code-container inline-block bg-white p-6 rounded-2xl shadow-inner border-2 border-dashed border-gray-200 mb-6">
                                        <QRCodeSVG 
                                            value={JSON.stringify(qrData)}
                                            size={200}
                                            level="H"
                                            includeMargin={true}
                                            className="w-full h-auto"
                                            fgColor="#1f2937"
                                            bgColor="#ffffff"
                                        />
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                        Scan this QR code to instantly share your contact information
                                    </p>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <button 
                                            onClick={downloadQR}
                                            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                                        >
                                            <FaDownload className="w-4 h-4" />
                                            Download
                                        </button>
                                        <button 
                                            onClick={() => setShowScanner(true)}
                                            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                                        >
                                            <FaQrcode className="w-4 h-4" />
                                            Scan QR
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Gallery Step */}
                {currentStep === 3 && (
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Business Gallery</h2>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {galleryImages.length} photos
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {galleryImages.map((image, index) => (
                                    <div 
                                        key={index}
                                        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300"
                                        onClick={() => setSelectedImage(image)}
                                    >
                                        <img 
                                            src={image} 
                                            alt={`Gallery ${index + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">View Image</span>
                                                    <FaExternalLinkAlt className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                {/* Add More Button */}
                                <div className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group">
                                    <div className="text-center">
                                        <FaPlus className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors duration-200" />
                                        <span className="text-sm text-gray-500 group-hover:text-blue-500 transition-colors duration-200">Add Photo</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Achievements Step */}
                {currentStep === 4 && (
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Professional Achievements</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {qrData.achievements.map((achievement, index) => (
                                    <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-700">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                                <FaAward className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">{achievement}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Professional Recognition</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Skills & Expertise</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {qrData.skills.map((skill, index) => (
                                    <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700 text-center">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <FaStar className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">{skill}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Social Links List Section */}
                {socialLinks.length > 0 && (
                    <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Social Links</h2>
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {socialLinks.map((link) => (
                                <a 
                                    key={link.id}
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`bg-gradient-to-r ${getSocialColor(link.platform)} text-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-3`}
                                >
                                    {getSocialIcon(link.platform)}
                                    <span className="font-medium">{link.platform}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-4xl max-h-full">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200"
                        >
                            <FaTimes className="w-8 h-8" />
                        </button>
                        <img
                            src={selectedImage}
                            alt="Gallery"
                            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}

            {/* QR Scanner Modal */}
            {showScanner && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">QR Code Scanner</h3>
                            <button
                                onClick={() => setShowScanner(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="text-center">
                            <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-xl mx-auto mb-4 flex items-center justify-center">
                                <FaQrcode className="w-16 h-16 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                QR Scanner would be implemented here using camera access
                            </p>
                            {scanResult && (
                                <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                    <p className="text-sm text-green-800 dark:text-green-300">{scanResult}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6 z-40">
                <button
                    onClick={handleShare}
                    className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 flex items-center justify-center"
                >
                    <FaShareAlt className="w-6 h-6" />
                </button>
            </div>

            {/* Toast Notification */}
            {copied && (
                <div className="fixed bottom-20 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
                    <FaCopy className="w-4 h-4" />
                    <span>Copied to clipboard!</span>
                </div>
            )}
        </div>
        // </AuthenticatedLayout>
    );
};  

// InfoCard Component
const InfoCard = ({ icon, title, value, copyable = false, highlight = false }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (copyable && value !== 'Not provided') {
            try {
                await navigator.clipboard.writeText(value);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    const content = (
        <div className={`p-4 rounded-xl border transition-all duration-200 ${
            highlight 
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700' 
                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
        } ${copyable ? 'cursor-pointer hover:shadow-md' : ''}`}
        onClick={copyable ? handleCopy : undefined}
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">{icon}</div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 break-all">{value}</p>
                    {copyable && value !== 'Not provided' && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                            {copied ? (
                                <>
                                    <FaCopy className="w-3 h-3" />
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <FaCopy className="w-3 h-3" />
                                    <span>Click to copy</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    
};

export default DigitalCard;