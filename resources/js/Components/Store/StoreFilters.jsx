export default function StoreFilters({ categories }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="font-bold mb-4">Filters</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold mb-2">Categories</h3>
                    {categories.map(category => (
                        <label key={category.id} className="flex items-center space-x-2">
                            <input type="checkbox" />
                            <span>{category.name}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
} 