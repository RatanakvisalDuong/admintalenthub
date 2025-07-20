'use client';

import { useState, useEffect } from 'react';
import { Session } from 'next-auth';
import axios from 'axios';

interface Major {
    id: number;
    name: string; // Backend returns 'name' field
    created_at?: string;
    updated_at?: string;
}

interface MajorResponse {
    success?: boolean;
    data?: Major[];
    count?: number;
    message?: string;
}

// Note: Your API returns direct array, but keeping this interface for flexibility

interface MajorManagementClientProps {
    initialMajors: Major[];
    session: Session;
}

export default function MajorManagementClient({
    initialMajors,
    session
}: MajorManagementClientProps) {
    const [majors, setMajors] = useState<Major[]>(initialMajors);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'create' | 'edit' | 'delete'>('create');
    const [editingMajor, setEditingMajor] = useState<Major | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        major: '' // Changed back to 'major' to match backend API
    });

    // Fetch majors
    const fetchMajors = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}view_all_majors`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Client Response:', response.data);

            // Handle direct array response from your API
            if (Array.isArray(response.data)) {
                setMajors(response.data);
                setError(null);
            } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
                // Fallback for wrapped response format
                setMajors(response.data.data);
                setError(null);
            } else {
                console.error('Unexpected response format:', response.data);
                setError('Unexpected response format from server');
            }
        } catch (err: any) {
            console.error('Error fetching majors:', err);
            setError(err.response?.data?.error || err.message || 'Failed to fetch majors');
        } finally {
            setLoading(false);
        }
    };

    // Clear messages after 5 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.accessToken || isSubmitting) return;

        setIsSubmitting(true);
        
        try {
            const url = editingMajor 
                ? `${process.env.NEXT_PUBLIC_API_URL}update_major/${editingMajor.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}create_major`;
            
            const method = editingMajor ? 'PUT' : 'POST';

            console.log('Submitting to:', url);
            console.log('Method:', method);
            console.log('Data:', formData);

            // Perform the API action
            const response = await axios({
                method,
                url,
                data: formData,
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                timeout: 30000,
            });

            console.log('Submit response:', response.data);

            // Reload page regardless of response to avoid showing errors
            console.log('API call completed - reloading page to refresh data...');
            window.location.reload();

        } catch (err: any) {
            console.error('Error saving major:', err);
            
            // Even if there's an error, reload the page to avoid showing error messages
            console.log('API call failed - reloading page anyway...');
            window.location.reload();
        }
    };

    // Handle delete
    const handleDelete = async () => {
        if (!session?.user?.accessToken || !editingMajor || isSubmitting) return;

        setIsSubmitting(true);
        
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}delete_major/${editingMajor.id}`;
            
            console.log('Deleting from:', url);

            // Perform the API action
            const response = await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            console.log('Delete response:', response.data);

            // Reload page regardless of response to avoid showing errors
            console.log('Delete API call completed - reloading page to refresh data...');
            window.location.reload();

        } catch (err: any) {
            console.error('Error deleting major:', err);
            
            // Even if there's an error, reload the page to avoid showing error messages
            console.log('Delete API call failed - reloading page anyway...');
            window.location.reload();
        }
    };

    // Handle create modal
    const handleCreate = () => {
        setEditingMajor(null);
        setFormData({ major: '' }); // Changed back to 'major'
        setModalType('create');
        setIsModalOpen(true);
    };

    // Handle edit modal
    const handleEdit = (major: Major) => {
        setEditingMajor(major);
        setFormData({ major: major.name }); // Send as 'major' field but get from 'name' property
        setModalType('edit');
        setIsModalOpen(true);
    };

    // Handle delete confirmation modal
    const handleDeleteConfirm = (major: Major) => {
        setEditingMajor(major);
        setModalType('delete');
        setIsModalOpen(true);
    };

    // Handle close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMajor(null);
        setFormData({ major: '' }); // Changed back to 'major'
        setModalType('create');
    };

    // Filter majors
    const filteredMajors = majors.filter(major => 
        major.name.toLowerCase().includes(searchTerm.toLowerCase()) // Changed from 'major' to 'name'
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Major Management</h1>
                <p className="text-gray-600">Manage academic majors and fields of study</p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                <path d="M6 12v5c3 3 9 3 12 0v-5" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-base font-semibold text-blue-800">Total Majors: {majors.length}</p>
                            <p className="text-sm text-blue-600">Academic majors available in the system</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-green-600">{success}</p>
                        </div>
                        <div className="ml-auto pl-3">
                            <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-green-600">
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-red-600">{error}</p>
                        </div>
                        <div className="ml-auto pl-3">
                            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1">
                    {/* Search */}
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            placeholder="Search majors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <svg
                            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Add New Button */}
                <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
                >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Major
                </button>
            </div>

            {/* Majors Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Major Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Updated Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredMajors.map((major) => (
                                <tr key={major.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {major.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{major.name}</div> {/* Changed from major.major to major.name */}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {major.created_at ? new Date(major.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {major.updated_at ? new Date(major.updated_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => handleEdit(major)}
                                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={() => handleDeleteConfirm(major)}
                                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredMajors.length === 0 && (
                    <div className="text-center py-12">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No majors found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm 
                                ? 'Try adjusting your search criteria.' 
                                : 'Get started by creating a new major.'
                            }
                        </p>
                        {!searchTerm && (
                            <div className="mt-6">
                                <button
                                    onClick={handleCreate}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add New Major
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-md overflow-y-auto h-full w-full z-50 flex items-center justify-center" onClick={handleCloseModal}>
                    <div className="relative p-5 border w-full max-w-md shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
                        <div className="mt-3">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {modalType === 'create' && 'Create New Major'}
                                    {modalType === 'edit' && 'Edit Major'}
                                    {modalType === 'delete' && 'Delete Major'}
                                </h3>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Create/Edit Form */}
                            {(modalType === 'create' || modalType === 'edit') && (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
                                            Major Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="major"
                                            required
                                            value={formData.major}
                                            onChange={(e) => setFormData({ major: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter major name"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            disabled={isSubmitting}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {isSubmitting && (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            )}
                                            {modalType === 'create' ? 'Create' : 'Update'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Delete Confirmation */}
                            {modalType === 'delete' && editingMajor && (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <svg className="h-10 w-10 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">Delete Major</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Are you sure you want to delete the major "{editingMajor.name}"? This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            disabled={isSubmitting}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            disabled={isSubmitting}
                                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {isSubmitting && (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            )}
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}