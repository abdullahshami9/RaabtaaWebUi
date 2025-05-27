import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FaTimes } from 'react-icons/fa';
import jsQR from 'jsqr';

const DigitalCard = ({ auth }) => {
    const [showScanner, setShowScanner] = useState(false);
    const [scanResult, setScanResult] = useState('');
    
    // User data for QR code
    const userData = {
        name: auth.user.name,
        email: auth.user.email,
        phone: auth.user.phone || 'Not provided',
        address: auth.user.address || 'Not provided'
    };

    const handleScan = (data) => {
        if (data) {
            setScanResult(data);
            setShowScanner(false);
            alert(`Scanned data: ${data}`);
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Smart Digital Card" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* QR Code Display */}
                            <div className="w-full md:w-1/3">
                                <div className="bg-white p-4 rounded-lg shadow-lg">
                                    <QRCodeSVG 
                                        value={JSON.stringify(userData)}
                                        size={256}
                                        level="H"
                                        includeMargin={true}
                                        className="w-full h-auto"
                                    />
                                    <div className="mt-4 flex flex-col gap-2">
                                        <button 
                                            onClick={() => setShowScanner(true)}
                                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                                        >
                                            Scan QR Code
                                        </button>
                                        <button 
                                            onClick={() => {
                                                const svg = document.getElementById('qrcode');
                                                const svgData = new XMLSerializer().serializeToString(svg);
                                                const blob = new Blob([svgData], {type: "image/svg+xml"});
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = 'digital-card.svg';
                                                document.body.appendChild(a);
                                                a.click();
                                                document.body.removeChild(a);
                                            }}
                                            className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            Download QR
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Digital Card Information */}
                            <div className="w-full md:w-2/3">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                    {auth.user.name}'s Digital Card
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl font-semibold text-white">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                {auth.user.name}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">{auth.user.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoBox title="Contact Phone" value={auth.user.phone || 'Not provided'} />
                                        <InfoBox title="Address" value={auth.user.address || 'Not provided'} />
                                        <InfoBox title="Member Since" value={new Date(auth.user.created_at).toLocaleDateString()} />
                                        <InfoBox title="Last Updated" value={new Date(auth.user.updated_at).toLocaleDateString()} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* QR Scanner Modal */}
                        {showScanner && (
                            <QRScanner 
                                onScan={(data) => {
                                    setScanResult(data);
                                    setShowScanner(false);
                                    alert(`Scanned data: ${data}`);
                                }}
                                onClose={() => setShowScanner(false)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

const InfoBox = ({ title, value }) => (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</h4>
        <p className="text-gray-900 dark:text-white">{value}</p>
    </div>
);

const QRScanner = ({ onScan, onClose }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const scanFrame = () => {
        if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            
            if (code) {
                onScan(code.data);
                stopCamera();
            } else {
                requestAnimationFrame(scanFrame);
            }
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
    };

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then((stream) => {
                streamRef.current = stream;
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                requestAnimationFrame(scanFrame);
            })
            .catch(err => {
                console.error("Error accessing camera:", err);
                alert("Camera access is required for QR scanning");
            });

        return () => stopCamera();
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-11/12 max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Scan QR Code</h3>
                    <button 
                        onClick={() => {
                            stopCamera();
                            onClose();
                        }}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    >
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>
                <video ref={videoRef} className="w-full h-64 rounded-lg" muted playsInline />
                <canvas ref={canvasRef} className="hidden" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Point your camera at a QR code to scan
                </p>
            </div>
        </div>
    );
};

export default DigitalCard; 