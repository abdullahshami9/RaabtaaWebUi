import { Modal, Box, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useState } from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2
};

export default function ProductFormModal({ open, onClose, product, categories }) {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        price: product?.price || '',
        stock: product?.stock || '',
        category_id: product?.category_id || '',
        image: product?.image || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <h2 className="text-xl font-bold mb-6 text-center">
                    {product ? 'Edit Product' : 'Add New Product'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <TextField
                        fullWidth
                        label="Product Name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        variant="outlined"
                        size="small"
                    />
                    
                    <TextField
                        fullWidth
                        label="Price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        required
                        variant="outlined"
                        size="small"
                    />
                    
                    <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        required
                        variant="outlined"
                        size="small"
                    />
                    
                    <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={formData.category_id}
                            label="Category"
                            onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                            required
                        >
                            {categories.map(category => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                    <div className="flex justify-end gap-4">
                        <Button 
                            variant="outlined" 
                            onClick={onClose}
                            className="normal-case"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained"
                            className="normal-case"
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
} 