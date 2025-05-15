'use client';

import { useState } from 'react';
import { XMarkIcon } from "@heroicons/react/16/solid";

interface AddEndorserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const AddEndorserDialog = ({ isOpen, onClose, onSubmit }: AddEndorserDialogProps) => {
    const [formData, setFormData] = useState({
        email: '',
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSubmit(formData);
        // Reset form
        setFormData({
            email: '',
        });
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
                    <h2 className="text-lg font-semibold text-gray-800">Add Endorser</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <XMarkIcon className="w-5 h-5 cursor-pointer hover:text-red-600" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-4">
                    <div className="space-y-4">
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>
                        
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#5086ed] text-white rounded-md hover:bg-blue-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Add Endorser
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEndorserDialog;