import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const ProfileInfoDisplay = ({ user }) => {
    const qrData = JSON.stringify({
        name: user.name,
        email: user.email,
        phone: user.phone || 'Not provided',
        address: user.address || 'Not provided',
    });

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-4">
            <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-4xl font-semibold text-white shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Phone: {user.phone || 'Not provided'}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Address: {user.address || 'Not provided'}</p>
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">QR Code</h3>
                <QRCodeSVG value={qrData} size={128} level="H" includeMargin={true} />
            </div>
        </div>
    );
};

export default ProfileInfoDisplay; 