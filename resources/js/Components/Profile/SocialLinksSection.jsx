import { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaYoutube, FaTiktok, FaGlobe } from 'react-icons/fa';
import axios from 'axios';

export default function SocialLinksSection({ socialLinks = [], onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingLink, setEditingLink] = useState(null);
    const [newUrl, setNewUrl] = useState('');
    const [newPlatform, setNewPlatform] = useState('');

    const socialIcons = {
        facebook: <FaFacebook className="w-6 h-6 text-blue-600" />,
        twitter: <FaTwitter className="w-6 h-6 text-blue-400" />,
        instagram: <FaInstagram className="w-6 h-6 text-pink-600" />,
        linkedin: <FaLinkedin className="w-6 h-6 text-blue-700" />,
        github: <FaGithub className="w-6 h-6 text-gray-900 dark:text-white" />,
        youtube: <FaYoutube className="w-6 h-6 text-red-600" />,
        tiktok: <FaTiktok className="w-6 h-6 text-gray-900 dark:text-white" />,
        website: <FaGlobe className="w-6 h-6 text-gray-600" />
    };

    const handleAdd = async () => {
        try {
            const response = await axios.post('/social-links', {
                platform: newPlatform,
                url: newUrl
            });
            onUpdate([...socialLinks, response.data]);
            setIsEditing(false);
            setNewPlatform('');
            setNewUrl('');
        } catch (error) {
            console.error('Error adding social link:', error);
        }
    };

    const handleEdit = async (linkId) => {
        try {
            const response = await axios.patch(`/social-links/${linkId}`, {
                url: newUrl
            });
            onUpdate(socialLinks.map(link => 
                link.id === linkId ? response.data : link
            ));
            setEditingLink(null);
            setNewUrl('');
        } catch (error) {
            console.error('Error updating social link:', error);
        }
    };

    const handleDelete = async (linkId) => {
        try {
            await axios.delete(`/social-links/${linkId}`);
            onUpdate(socialLinks.filter(link => link.id !== linkId));
        } catch (error) {
            console.error('Error deleting social link:', error);
        }
    };

    return (
        <div className="mt-6 bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Social Links
                    </h2>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                        <FaPlus className="w-4 h-4" />
                        <span>Add New</span>
                    </button>
                </div>

                {isEditing && (
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select
                                value={newPlatform}
                                onChange={(e) => setNewPlatform(e.target.value)}
                                className="rounded-lg dark:bg-gray-600 dark:text-white"
                            >
                                <option value="">Select Platform</option>
                                {Object.keys(socialIcons).map(platform => (
                                    <option key={platform} value={platform}>
                                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                placeholder="Enter URL"
                                className="rounded-lg dark:bg-gray-600 dark:text-white"
                            />
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Add Link
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {socialLinks.map((link) => (
                        <div
                            key={link.id}
                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    {socialIcons[link.platform]}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                            {link.platform}
                                        </h3>
                                        {editingLink === link.id ? (
                                            <div className="flex items-center mt-1">
                                                <input
                                                    type="text"
                                                    value={newUrl}
                                                    onChange={(e) => setNewUrl(e.target.value)}
                                                    className="text-sm text-gray-600 dark:text-gray-400 w-full rounded-lg dark:bg-gray-600"
                                                    placeholder="Enter new URL"
                                                />
                                                <button
                                                    onClick={() => handleEdit(link.id)}
                                                    className="ml-2 text-blue-600 hover:text-blue-700"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        ) : (
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                {link.url}
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => {
                                            setEditingLink(link.id);
                                            setNewUrl(link.url);
                                        }}
                                        className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        <FaEdit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(link.id)}
                                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                    >
                                        <FaTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 