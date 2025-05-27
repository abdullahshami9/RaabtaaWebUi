import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FaCreditCard, FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Add this new component
const AddPayment = ({ onAdd }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [formData, setFormData] = useState({
        card_holder_name: '',
        card_number: '',
        expiry_date: '',
        cvc: ''
    });
    
    // Add validation state
    const [isFormValid, setIsFormValid] = useState(false);

    // Add these mask handling functions inside the AddPayment component
    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.match(/.{1,4}/g)?.join(' ').substring(0, 19) || '';
        setFormData({...formData, card_number: value});
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        setFormData({...formData, expiry_date: value.substring(0, 5)});
    };

    const handleCvcChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        setFormData({...formData, cvc: value.substring(0, 4)});
    };

    // Update the validation effect
    useEffect(() => {
        const validateForm = () => {
            const cleanedCardNumber = formData.card_number.replace(/\s/g, '');
            const isCardValid = cleanedCardNumber.length === 16;
            const [month, year] = formData.expiry_date.split('/');
            const currentYear = new Date().getFullYear() % 100;
            const currentMonth = new Date().getMonth() + 1;
            
            const isDateValid = (
                formData.expiry_date.length === 5 &&
                parseInt(month) >= 1 &&
                parseInt(month) <= 12 &&
                parseInt(year) >= currentYear ||
                (parseInt(year) === currentYear && parseInt(month) >= currentMonth)
            );
            
            const isCvcValid = formData.cvc.length >= 3 && formData.cvc.length <= 4;
            
            return (
                formData.card_holder_name.trim() !== '' &&
                isCardValid &&
                isDateValid &&
                isCvcValid
            );
        };
        setIsFormValid(validateForm());
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const cleanedCardNumber = formData.card_number.replace(/\s/g, '');
            const response = await axios.post('/payments', {
                ...formData,
                card_number: cleanedCardNumber
            });
            onAdd(response.data);
            setIsExpanded(false);
            setFormData({
                card_holder_name: '',
                card_number: '',
                expiry_date: '',
                cvc: ''
            });
        } catch (error) {
            console.error('Error adding payment:', error);
            alert('Error saving payment. Please check your details.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto mb-8">
            <form 
                onSubmit={handleSubmit}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all duration-200 ${
                    isExpanded ? 'p-6 ring-1 ring-green-500' : 'p-4 hover:ring-1 ring-gray-200 dark:ring-gray-700'
                }`}
            >
                <div className="relative">
                    <div 
                        onClick={() => setIsExpanded(true)}
                        className="cursor-pointer"
                    >
                        <input
                            placeholder="Add payment method..."
                            className="w-full bg-transparent border-none focus:ring-0 placeholder-gray-400 dark:placeholder-gray-500 cursor-pointer text-lg"
                            readOnly
                        />
                    </div>
                    
                    {isExpanded && (
                        <div className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Cardholder name"
                                        value={formData.card_holder_name}
                                        onChange={(e) => setFormData({...formData, card_holder_name: e.target.value})}
                                        className={`w-full px-4 py-2.5 rounded-lg border ${
                                            formData.card_holder_name && !formData.card_holder_name.trim() 
                                                ? 'border-red-500' 
                                                : 'border-gray-200 dark:border-gray-700'
                                        } focus:ring-2 focus:ring-green-500 bg-transparent`}
                                    />
                                    {formData.card_holder_name && !formData.card_holder_name.trim() && (
                                        <p className="text-red-500 text-xs mt-1">Name is required</p>
                                    )}
                                </div>
                                
                                <div>
                                    <input
                                        type="text"
                                        placeholder="4242 4242 4242 4242"
                                        value={formData.card_number}
                                        onChange={handleCardNumberChange}
                                        className={`w-full px-4 py-2.5 rounded-lg border ${
                                            formData.card_number && formData.card_number.replace(/\s/g, '').length !== 16 
                                                ? 'border-red-500' 
                                                : 'border-gray-200 dark:border-gray-700'
                                        } focus:ring-2 focus:ring-green-500 bg-transparent`}
                                    />
                                    {formData.card_number && formData.card_number.replace(/\s/g, '').length !== 16 && (
                                        <p className="text-red-500 text-xs mt-1">Invalid card number</p>
                                    )}
                                </div>
                                
                                <div>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        value={formData.expiry_date}
                                        onChange={handleExpiryChange}
                                        className={`w-full px-4 py-2.5 rounded-lg border ${
                                            formData.expiry_date && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry_date) 
                                                ? 'border-red-500' 
                                                : 'border-gray-200 dark:border-gray-700'
                                        } focus:ring-2 focus:ring-green-500 bg-transparent`}
                                    />
                                    {formData.expiry_date && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry_date) && (
                                        <p className="text-red-500 text-xs mt-1">Invalid expiry date</p>
                                    )}
                                </div>
                                
                                <div>
                                    <input
                                        type="text"
                                        placeholder="CVC"
                                        value={formData.cvc}
                                        onChange={handleCvcChange}
                                        className={`w-full px-4 py-2.5 rounded-lg border ${
                                            formData.cvc && (formData.cvc.length < 3 || formData.cvc.length > 4) 
                                                ? 'border-red-500' 
                                                : 'border-gray-200 dark:border-gray-700'
                                        } focus:ring-2 focus:ring-green-500 bg-transparent`}
                                    />
                                    {formData.cvc && (formData.cvc.length < 3 || formData.cvc.length > 4) && (
                                        <p className="text-red-500 text-xs mt-1">Invalid CVC</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsExpanded(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors group
                                        ${isFormValid 
                                            ? 'border-green-500 hover:border-green-600 cursor-pointer'
                                            : 'border-gray-300 dark:border-gray-600 cursor-not-allowed'}
                                    `}
                                    disabled={!isFormValid}
                                >
                                    <FaCheck className={`w-5 h-5 ${
                                        isFormValid 
                                            ? 'text-green-500 group-hover:text-green-600'
                                            : 'text-gray-400 dark:text-gray-500'
                                    }`} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default function Payments({ auth, payments: initialPayments }) {
    const [payments, setPayments] = useState(initialPayments || []);
    const [editingPayment, setEditingPayment] = useState(null);
    const [editFormData, setEditFormData] = useState({
        card_holder_name: '',
        card_number: '',
        expiry_date: '',
        cvc: ''
    });

    const handleEdit = (payment) => {
        setEditingPayment(payment.id);
        setEditFormData({
            card_holder_name: payment.card_holder_name,
            card_number: payment.card_number,
            expiry_date: payment.expiry_date,
            cvc: payment.cvc
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const cleanedCardNumber = editFormData.card_number.replace(/\s/g, '');
            const response = await axios.put(`/payments/${editingPayment}`, {
                ...editFormData,
                card_number: cleanedCardNumber
            });
            setPayments(payments.map(p => p.id === editingPayment ? {
                ...response.data,
                card_number: cleanedCardNumber.slice(-4) // Show last 4 digits
            } : p));
            setEditingPayment(null);
        } catch (error) {
            console.error('Error updating payment:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this payment?')) {
            await axios.delete(`/payments/${id}`);
            setPayments(payments.filter(p => p.id !== id));
        }
    };

    const handleCancelEdit = () => {
        setEditingPayment(null);
        setEditFormData({
            card_holder_name: '',
            card_number: '',
            expiry_date: '',
            cvc: ''
        });
    };

    // Update axios instance configuration
    const api = axios.create({
        baseURL: '/',
        withCredentials: true,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    // Update all axios calls to use this instance
    const handleAddPayment = async (newPayment) => {
        try {
            const cleanedCardNumber = newPayment.card_number.replace(/\s/g, '');
            const response = await api.post('/payments', {
                ...newPayment,
                card_number: cleanedCardNumber
            });
            setPayments([...payments, response.data]);
            setEditingPayment(null);
        } catch (error) {
            console.error('Error adding payment:', error);
            alert('Error saving payment. Please check your details.');
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Payments" />
            <div className="py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AddPayment onAdd={(newPayment) => setPayments([newPayment, ...payments])} />
                    
                    <div className="space-y-4">
                        {payments.map(payment => (
                            payment.is_deleted ? null : (
                                <div key={payment.id} className="group bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <FaCreditCard className="w-6 h-6 text-gray-400" />
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {payment.card_holder_name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    **** **** **** {payment.card_number}
                                                </div>
                                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                                    Expires {payment.expiry_date}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {editingPayment === payment.id ? (
                                                <form onSubmit={handleUpdate} className="flex gap-2 items-center">
                                                    <input
                                                        type="text"
                                                        value={editFormData.card_holder_name}
                                                        onChange={(e) => setEditFormData({...editFormData, card_holder_name: e.target.value})}
                                                        className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 bg-transparent"
                                                        placeholder="Cardholder name"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="submit"
                                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white"
                                                        >
                                                            <FaCheck className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={handleCancelEdit}
                                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                                                        >
                                                            <FaTimes className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(payment)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-green-500"
                                                    >
                                                        <FaEdit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(payment.id)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-500"
                                                    >
                                                        <FaTrash className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 