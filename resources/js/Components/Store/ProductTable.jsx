import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ProductTable({ products, onEdit }) {
    return (
        <TableContainer component={Paper} className="rounded-2xl">
            <Table>
                <TableHead>
                    <TableRow className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
                        <TableCell className="font-semibold text-gray-700 dark:text-gray-200">Image</TableCell>
                        <TableCell className="font-semibold text-gray-700 dark:text-gray-200">Name</TableCell>
                        <TableCell className="font-semibold text-gray-700 dark:text-gray-200">Price</TableCell>
                        <TableCell className="font-semibold text-gray-700 dark:text-gray-200">Quantity</TableCell>
                        <TableCell className="font-semibold text-gray-700 dark:text-gray-200">Category</TableCell>
                        <TableCell className="font-semibold text-gray-700 dark:text-gray-200">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((product) => (
                        <TableRow 
                            key={product.id} 
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <TableCell>
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                />
                            </TableCell>
                            <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                                {product.name}
                            </TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300">
                                ${product.price}
                            </TableCell>
                            <TableCell className={product.stock < 10 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}>
                                {product.stock}
                            </TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300">
                                {product.category?.name}
                            </TableCell>
                            <TableCell>
                                <IconButton 
                                    onClick={() => onEdit(product)}
                                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                    <EditIcon className="text-blue-500" />
                                </IconButton>
                                <IconButton className="hover:bg-red-50 dark:hover:bg-red-900/20">
                                    <DeleteIcon className="text-red-500" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
} 