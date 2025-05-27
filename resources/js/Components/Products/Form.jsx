export default function ProductForm() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Add New Product</h2>
            
            <md-outlined-text-field 
                label="Product Name" 
                className="w-full"
            ></md-outlined-text-field>
            
            <md-outlined-text-field 
                label="Price" 
                type="number" 
                step="0.01"
                className="w-full"
            ></md-outlined-text-field>
            
            <md-filled-button>
                <span slot="label">Add Product</span>
            </md-filled-button>
        </div>
    )
} 