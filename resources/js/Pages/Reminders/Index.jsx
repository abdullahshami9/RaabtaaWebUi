import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function RemindersIndex({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Reminders" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold">Reminders</h1>
                <p className="mt-4">Manage your reminders here.</p>
            </div>
        </AuthenticatedLayout>
    );
} 