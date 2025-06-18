'use client';

import { useState } from 'react';
import { XMarkIcon } from "@heroicons/react/16/solid";
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface AddAdminDialogProps {
  isOpen: boolean;
  onClose: () => void;
  setSuccessMessage: (message: string) => void;
}

const AddAdminDialog = ({ isOpen, onClose, setSuccessMessage }: AddAdminDialogProps) => {
    const { data: session } = useSession();
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError(null);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        
        if (formData.name === '' || formData.email === '' || formData.password === '' || formData.confirmPassword === '') {
            setError("All fields are required");
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setError("Password and Confirm Password do not match");
            return;
        }
        
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }
        
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            setError("Email is not valid");
            return;
        }
        try{
const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}admin/create_admin_account`,
            {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirmPassword,
            },
            {
                headers: {
                    Authorization: `Bearer ${session?.user.accessToken}`,
                },
            }
        );
        if (response.data.success) {
            setSuccessMessage("Admin added successfully!");
        } else {
            setError(response.data.message || "Failed to add admin");
        }
        // Close the dialog
        onClose();
        
        // Reset form
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        });
        }
        catch (err: any) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "An error occurred");
            } else {
                setError("An unexpected error occurred");
            }
        }

        
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Blur backdrop */}
            <div 
                className="absolute inset-0 bg-gray-800/30 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            
            {/* Dialog content */}
            <div className="relative bg-white rounded-lg shadow-xl w-[400px] z-10">
                <div className="flex justify-between items-center border-b p-4">
                    <h2 className="text-lg font-semibold text-gray-800">Add Admin</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        type="button"
                    >
                        <XMarkIcon className="w-5 h-5 cursor-pointer hover:text-red-600" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        
                        {error && (
                            <div className="text-red-500 text-sm mt-2">
                                {error}
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Add Admin
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAdminDialog;