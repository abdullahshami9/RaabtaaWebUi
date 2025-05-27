import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ProductList from '@/Components/Store/ProductList';
import AddProduct from '@/Components/Store/AddProduct';
import InventoryOverview from '@/Components/Store/InventoryOverview';
import { useForm } from '@inertiajs/react';

export default function StoreIndex({ auth, products = [], categories = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        price: '',
        stock: '',
        category_id: '',
        image: null
    });

    const [isAddProductOpen, setIsAddProductOpen] = useState(false);

    const handleAddProduct = (e) => {
        e.preventDefault();
        post('/products', {
            onSuccess: () => {
                reset();
                setIsAddProductOpen(false);
            },
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Store" />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Inventory Overview */}
                <div className="text-center">
                    <InventoryOverview products={products} />
                </div>

                {/* Add Product Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                    <button
                        onClick={() => setIsAddProductOpen(!isAddProductOpen)}
                        className="w-full flex items-center justify-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <div className="w-6 h-6 flex items-center justify-center border-2 border-green-500 rounded-full">
                            <svg 
                                className={`w-4 h-4 text-green-500 transition-transform ${isAddProductOpen ? 'rotate-45' : ''}`}
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            >
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </div>
                        <span className="text-lg font-medium">Add New Product</span>
                    </button>
                    
                    {isAddProductOpen && (
                        <AddProduct 
                            data={data}
                            setData={setData}
                            errors={errors}
                            categories={categories}
                            onSubmit={handleAddProduct}
                            processing={processing}
                        />
                    )}
                </div>

                {/* Product List Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <ProductList 
                        products={products} 
                        categories={categories}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 