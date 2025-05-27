import { FaPlus } from 'react-icons/fa';

export default function AddProduct({ data, setData, errors, categories, onSubmit, processing }) {
    return (
        <div className="mt-4 space-y-4">
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">Product Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <input
                            type="number"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Quantity</label>
                        <input
                            type="number"
                            value={data.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center justify-center px-4 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <FaPlus className="mr-2" />
                        {processing ? 'Adding...' : 'Add Product'}
                    </button>
                </div>
            </form>
        </div>
    );
} 