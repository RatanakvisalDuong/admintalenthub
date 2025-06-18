import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function ChangePasswordDialog({ isOpen, onClose }: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
        if (success) setSuccess(false);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validation
        if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
            setError('All fields are required');
            setIsLoading(false);
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            setIsLoading(false);
            return;
        }

        if (formData.newPassword.length < 8) {
            setError('New password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}admin_change_password`,
                {
                    old_password: formData.oldPassword,
                    new_password: formData.newPassword,
                    new_password_confirmation: formData.confirmPassword
                },
                {
                    headers: {
                        'Authorization': `Bearer ${session?.user.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                setSuccess(true);
                setFormData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                
               onClose();
            }
        } catch (err: any) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.status === 400) {
                setError('Invalid old password or password requirements not met');
            } else if (err.response?.status === 401) {
                setError('Unauthorized. Please login again.');
            } else {
                setError('Failed to change password. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setError('');
            setSuccess(false);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
                className="absolute inset-0 bg-gray-800/30 backdrop-blur-sm"
                onClick={handleClose}
            ></div>
            
            <div className="relative bg-white rounded-lg shadow-xl w-[400px] z-10">
                <div className="flex justify-between items-center border-b p-4">
                    <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>
                    <button 
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700"
                        type="button"
                        disabled={isLoading}
                    >
                        <XMarkIcon className="w-5 h-5 cursor-pointer hover:text-red-600" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input
                                type="password"
                                name="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                                placeholder="Enter your current password"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                                placeholder="Enter new password (min 8 characters)"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                                placeholder="Confirm your new password"
                            />
                        </div>
                        
                        {error && (
                            <div className="text-red-500 text-sm mt-2">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="text-green-500 text-sm mt-2">
                                Password changed successfully!
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}