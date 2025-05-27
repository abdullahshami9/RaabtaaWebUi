import React from 'react';

export default function InventoryDashboard({ products = [] }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Inventory Overview</h2>
                <div className="flex gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-sm text-blue-600 dark:text-blue-400">Total Products</p>
                        <p className="text-2xl font-bold">0</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <p className="text-sm text-green-600 dark:text-green-400">In Stock</p>
                        <p className="text-2xl font-bold">0</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <p className="text-sm text-purple-600 dark:text-purple-400">Categories</p>
                        <p className="text-2xl font-bold">0</p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Product</th>
                            <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Price</th>
                            <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Stock</th>
                            <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b border-gray-100 dark:border-gray-800">
                                <td className="py-3 px-4">{product.name}</td>
                                <td className="py-3 px-4">${product.price}</td>
                                <td className="py-3 px-4">{product.stock}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded-full text-sm ${
                                        product.stock > 0 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                    }`}>
                                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 