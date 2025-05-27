import { Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function InventoryOverview({ products }) {
    const theme = useTheme();
    
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
    const lowStockProducts = products.filter(product => product.stock < 10).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h3 className="text-gray-500 dark:text-gray-400">Total Products</h3>
                <p className="text-3xl font-bold">{totalProducts}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h3 className="text-gray-500 dark:text-gray-400">Total Stock</h3>
                <p className="text-3xl font-bold">{totalStock}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h3 className="text-gray-500 dark:text-gray-400">Low Stock</h3>
                <p className={`text-3xl font-bold ${lowStockProducts > 0 ? 'text-red-500' : ''}`}>
                    {lowStockProducts}
                </p>
            </div>
        </div>
    );
} 