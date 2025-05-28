import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

import { 
    FaTimes, FaDownload, FaQrcode, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
    FaBuilding, FaIndustry, FaCalendarAlt, FaShareAlt, FaCopy, FaImages, 
    FaPlus, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube,
    FaGithub, FaTiktok, FaSnapchat, FaWhatsapp, FaGlobe, FaEye, FaStar,
    FaAward, FaBriefcase, FaUsers, FaHeart, FaBookmark, FaExternalLinkAlt
} from 'react-icons/fa';
import jsQR from 'jsqr';

const DigitalCard = ({ auth, socialLinks = [] }) => {
    // Access industry data from auth.user
    const industryData = auth.user.industry; // or auth.user.user_industry depending on your DB structure
    
    const [showScanner, setShowScanner] = useState(false);
    const [scanResult, setScanResult] = useState('');
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [viewCount] = useState(247); // Mock view count
    const [likeCount, setLikeCount] = useState(89);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [galleryImages, setGalleryImages] = useState([
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop'
    ]);
    const [selectedImage, setSelectedImage] = useState(null);
    
    // Generate username from email or name
    const username = auth.user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

    // const [username, setUsername] = useState('');

    const socialPlatforms = async () => {
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
console.log('All props:', { auth, industryData, socialLinks });
    console.log(45);
    // Enhanced user data for QR code
    const userData = {
        name: auth.user.name,
        username: username,
        email: auth.user.email,
        phone: auth.user.phone || 'Not provided',
        address: auth.user.address || 'Not provided',
        businessName: industryData?.business_name || 'Professional',
        parentIndustry: industryData?.parent_industry || 'Technology',
        childIndustry: industryData?.child_industry || 'Software Development',
        memberSince: auth.user.created_at,
        profileUrl: `${window.location.origin}/${username}`,
        socials: socialLinks,
        bio: "Passionate professional dedicated to excellence and innovation in everything I do.",
        achievements: ["Industry Expert", "Top Performer", "Certified Professional"],
        skills: ["Leadership", "Strategy", "Innovation", "Team Building"]
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${userData.name} - Digital Business Card`,
                    text: `Check out ${userData.name}'s professional profile`,
                    url: userData.profileUrl,
                });
            } catch (err) {
                console.log('Error sharing:', err);
                copyToClipboard(userData.profileUrl);
            }
        } else {
            copyToClipboard(userData.profileUrl);
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
${userData.name}
${userData.businessName}
📧 ${userData.email}
📱 ${userData.phone}
🏢 ${userData.parentIndustry} - ${userData.childIndustry}
🌐 ${userData.profileUrl}
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
            a.download = `${username}-digital-card.svg`;
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900">
            <Head title={`${userData.name} - Digital Card`} />
            
            {/* Hero Section with Cover */}
            <div className="relative h-80 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-10"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
                    <div className="flex items-end gap-6 w-full">
                        {/* Profile Image */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-5xl font-bold text-white shadow-2xl">
                                {auth.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        </div>
                        
                        {/* Profile Info */}
                        <div className="flex-1 text-white">
                            <h1 className="text-4xl font-bold mb-2">dummy</h1>
                            <h1 className="text-4xl font-bold mb-2">{auth.user.name}</h1>
                            <p className="text-xl text-white/90 mb-2">{userData.businessName}</p>
                            <p className="text-white/80 mb-4">{userData.bio}</p>
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
                                    <span>Member since {new Date(auth.user.created_at).getFullYear()}</span>
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
                                /{username}
                            </code>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        {[
                            { key: 'overview', label: 'Overview', icon: FaUser },
                            { key: 'contact', label: 'Contact & QR', icon: FaQrcode },
                            { key: 'gallery', label: 'Gallery', icon: FaImages },
                            { key: 'achievements', label: 'Achievements', icon: FaAward }
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center gap-2 ${
                                    activeTab === key
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Professional Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Professional Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <InfoCard 
                                        icon={<FaBuilding className="w-5 h-5 text-blue-500" />}
                                        title="Business Name" 
                                        value={userData.businessName}
                                        highlight={true}
                                    />
                                    <InfoCard 
                                        icon={<FaIndustry className="w-5 h-5 text-purple-500" />}
                                        title="Industry" 
                                        value={userData.parentIndustry}
                                    />
                                    <InfoCard 
                                        icon={<FaBriefcase className="w-5 h-5 text-green-500" />}
                                        title="Specialization" 
                                        value={userData.childIndustry}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Skills & Achievements Preview */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Core Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {userData.skills.map((skill, index) => (
                                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Achievements</h3>
                                <div className="space-y-2">
                                    {userData.achievements.map((achievement, index) => (
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

                {/* Contact & QR Tab */}
                {activeTab === 'contact' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Contact Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h2>
                            <div className="space-y-4">
                                <InfoCard 
                                    icon={<FaEnvelope className="w-5 h-5 text-blue-500" />}
                                    title="Email" 
                                    value={auth.user.email}
                                    copyable={true}
                                />
                                <InfoCard 
                                    icon={<FaPhone className="w-5 h-5 text-green-500" />}
                                    title="Phone" 
                                    value={auth.user.phone || 'Not provided'}
                                    copyable={!!auth.user.phone}
                                />
                                <InfoCard 
                                    icon={<FaMapMarkerAlt className="w-5 h-5 text-red-500" />}
                                    title="Address" 
                                    value={auth.user.address || 'Not provided'}
                                />
                                <InfoCard 
                                    icon={<FaGlobe className="w-5 h-5 text-indigo-500" />}
                                    title="Profile URL" 
                                    value={userData.profileUrl}
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
                                        value={JSON.stringify(userData)}
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
                )}

                {/* Gallery Tab */}
                {activeTab === 'gallery' && (
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
                )}

                {/* Achievements Tab */}
                {activeTab === 'achievements' && (
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Professional Achievements</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {userData.achievements.map((achievement, index) => (
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
                                {userData.skills.map((skill, index) => (
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

    return (
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