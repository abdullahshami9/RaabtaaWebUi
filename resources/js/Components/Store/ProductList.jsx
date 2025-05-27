import { FaEdit, FaTrash } from 'react-icons/fa';
import { useForm } from '@inertiajs/react';

export default function ProductList({ products, categories }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            destroy(`/products/${id}`, {
                preserveScroll: true
            });
        }
    };

    return (
        <div className="overflow-x-auto text-sm">
            <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-3 py-2 text-left">Image</th>
                        <th className="px-3 py-2 text-left">Name</th>
                        <th className="px-3 py-2 text-left">Price</th>
                        <th className="px-3 py-2 text-left">Quantity</th>
                        <th className="px-3 py-2 text-left">Category</th>
                        <th className="px-3 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-3 py-2">
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-12 h-12 object-cover rounded-lg"
                                />
                            </td>
                            <td className="px-3 py-2">{product.name}</td>
                            <td className="px-3 py-2">${product.price}</td>
                            <td className="px-3 py-2">{product.stock}</td>
                            <td className="px-3 py-2">{product.category?.name}</td>
                            <td className="px-3 py-2">
                                <button className="text-blue-500 hover:text-blue-600 mr-2">
                                    <FaEdit className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => handleDelete(product.id)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <FaTrash className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 