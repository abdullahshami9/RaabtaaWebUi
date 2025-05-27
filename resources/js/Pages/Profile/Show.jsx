import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import BusinessCard from '@/Components/Profile/BusinessCard';

export default function ProfileShow({ user }) {
    return (
        <AuthenticatedLayout user={user}>
            <Head title="Profile" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <BusinessCard user={user} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 