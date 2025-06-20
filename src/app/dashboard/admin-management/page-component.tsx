'use client';

import { User } from "@/app/type/user";
import { PlusIcon, UserIcon, EnvelopeIcon, ExclamationTriangleIcon } from "@heroicons/react/16/solid";
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import axios from 'axios';
import AddAdminDialog from "./add-admin-dialog";

export default function AdminManagementComponent({ admin: initialAdmin }: { admin: any[] }) {
    const { data: session } = useSession();
    const [addAdminDialogOpen, setAddAdminDialogOpen] = useState<boolean>(false);
    const [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false);
    const [adminToRemove, setAdminToRemove] = useState<any>(null);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [adminList, setAdminList] = useState<any[]>(initialAdmin || []);
    const [isRemoving, setIsRemoving] = useState<boolean>(false);

    // Update local state when prop changes
    useEffect(() => {
        setAdminList(initialAdmin || []);
    }, [initialAdmin]);

    const displaySuccessMessage = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(""), 4000);
    };

    const handleAdminAdded = (newAdmin: any) => {
        // Add the new admin to the local state
        setAdminList(prev => [...prev, newAdmin]);
        displaySuccessMessage("Admin added successfully!");
    };

    const handleRemoveClick = (admin: any) => {
        setAdminToRemove(admin);
        setRemoveDialogOpen(true);
    };

    const handleRemoveConfirm = async () => {
        if (!adminToRemove) return;

        setIsRemoving(true);
        try {
            const response = await axios.delete(
                `https://talenthub.newlinkmarketing.com/api/remove_admin/${adminToRemove.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                // Remove the admin from local state
                setAdminList(prev => prev.filter(admin => admin.id !== adminToRemove.id));
                displaySuccessMessage("Admin removed successfully!");
                setRemoveDialogOpen(false);
                setAdminToRemove(null);
            }
        } catch (error: any) {
            console.error('Error removing admin:', error);
            displaySuccessMessage("Failed to remove admin. Please try again.");
        } finally {
            setIsRemoving(false);
        }
    };

    const handleRemoveCancel = () => {
        setRemoveDialogOpen(false);
        setAdminToRemove(null);
    };

    return (
        <div className="flex flex-col min-h-screen p-8 bg-gray-50">
            {successMessage && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 mt-18 border-l-4 border-green-700">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {successMessage}
                    </div>
                </div>
            )}

            <div className="mb-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Management</h1>
                    <p className="text-lg text-gray-600">Manage and oversee all system admin</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex flex-wrap gap-3">
                        <button
                            className="h-11 py-2 px-4 cursor-pointer rounded-lg text-base text-gray-700 hover:bg-blue-600 hover:text-white bg-white shadow-sm border border-gray-200 hover:border-blue-600 flex items-center transition-all duration-200 font-medium"
                            onClick={() => setAddAdminDialogOpen(true)}
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Admin
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-max mx-auto justify-center items-center">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <div className="grid grid-cols-3 gap-4 px-6 py-4">
                        <div className="flex items-center text-base font-semibold text-gray-700">
                            <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                            User Information
                        </div>
                        <div className="flex items-center text-base font-semibold text-gray-700">
                            <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-500" />
                            Email Address
                        </div>
                        <div className="text-base font-semibold text-gray-700 mx-auto">Actions</div>
                    </div>
                </div>

                <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                    {adminList && adminList.length > 0 ? (
                        adminList.map((userItem, index) => (
                            <div key={userItem.id || index} className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-sm">
                                        <span className="text-white font-semibold text-base">
                                            {userItem.name ? userItem.name.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-base text-gray-900">
                                            {userItem.name || 'N/A'}
                                        </div>
                                        {userItem.is_super_admin === 1 && (
                                            <div className="text-xs text-blue-600 font-medium">
                                                Super Admin
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="text-base text-gray-700 truncate">
                                        {userItem.email || 'N/A'}
                                    </div>
                                </div>

                                <div className="flex items-center justify-center">
                                    {userItem.is_super_admin !== 1 && (
                                        <button
                                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleRemoveClick(userItem)}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <UserIcon className="w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-gray-500 text-lg">No admins found</p>
                            <p className="text-gray-400 text-sm">Add an admin to get started</p>
                        </div>
                    )}
                </div>
            </div>

            <AddAdminDialog
                isOpen={addAdminDialogOpen}
                onClose={() => setAddAdminDialogOpen(false)}
                onAdminAdded={handleAdminAdded}
            />

            {/* Remove Confirmation Dialog */}
            {removeDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-gray-800/30 backdrop-blur-sm"
                        onClick={handleRemoveCancel}
                    ></div>

                    {/* Dialog content */}
                    <div className="relative bg-white rounded-lg shadow-xl w-[400px] z-10">
                        <div className="flex items-center justify-center pt-6 pb-2">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                            </div>
                        </div>

                        <div className="px-6 pb-6">
                            <h2 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                Remove Admin
                            </h2>
                            <p className="text-sm text-gray-600 text-center mb-6">
                                Are you sure you want to remove <span className="font-medium text-gray-900">{adminToRemove?.name}</span> from admin access? This action cannot be undone.
                            </p>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleRemoveCancel}
                                    disabled={isRemoving}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRemoveConfirm}
                                    disabled={isRemoving}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
                                >
                                    {isRemoving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Removing...
                                        </>
                                    ) : (
                                        'Remove Admin'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}