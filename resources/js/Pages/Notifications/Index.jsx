import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Notifications({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Notifications" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Notifications Center
                        </h2>
                        {/* Add notifications content here */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 