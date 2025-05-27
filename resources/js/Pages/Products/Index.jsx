import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InventoryDashboard from '@/Components/Products/Dashboard';
import ProductForm from '@/Components/Products/Form';

export default function ProductIndex({ products }) {
    return (
        <AuthenticatedLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Form */}
                    <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <ProductForm />
                    </div>
                    
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <InventoryDashboard products={products} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 