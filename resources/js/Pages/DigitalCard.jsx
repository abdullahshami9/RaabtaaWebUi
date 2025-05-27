import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function DigitalCard({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Digital Card" />
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="w-full max-w-[300px] bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="text-center">
                        <img
                            src="https://via.placeholder.com/150"
                            alt="Profile"
                            className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-blue-500"
                        />
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            John Doe
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Software Engineer
                        </p>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-center space-x-2">
                                <svg
                                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    john.doe@example.com
                                </span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                                <svg
                                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    +1 234 567 890
                                </span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">
                                Share Card
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 