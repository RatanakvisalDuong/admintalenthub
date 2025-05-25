'use client';

import { useState } from 'react';
import { XMarkIcon } from "@heroicons/react/16/solid";
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";

interface AddEndorserDialogProps {
    isOpen: boolean;
    onClose: () => void;
    setSuccessMessage: (message: string) => void;
}

const AddEndorserDialog = ({ isOpen, onClose, setSuccessMessage }: AddEndorserDialogProps) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const onSubmit = async () => {
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        setEmailError('');
        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}admin/create_endorser_account`,
                { email: email },
                {
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`,
                    },
                }
            );
            if (response.status === 200) {
                setSuccessMessage("Endorser added successfully!");
                router.refresh();
                onClose();
            } else {
                console.error("Failed to add endorser:", response.data);
            }
        } catch (error) {
            console.error("Error adding endorser:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (emailError) setEmailError('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-gray-800/30 backdrop-blur-sm"
                onClick={onClose}
            ></div>
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
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="p-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={handleEmailChange}
                                className={`w-full px-3 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 ${emailError ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                                required
                            />
                            {emailError && (
                                <p className="mt-1 text-sm text-red-600">{emailError}</p>
                            )}
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#5086ed] text-white rounded-md hover:bg-blue-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Endorser'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEndorserDialog;