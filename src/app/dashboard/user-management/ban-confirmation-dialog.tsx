import { User } from '@/app/type/user';
import axios from 'axios';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

interface BanConfirmationDialogProps {
    open: boolean;
    user: User | null;
    onClose: () => void;
    ban: string;
    setSuccessMessage: (message: string) => void;
    onStatusUpdate?: (user: User, newStatus: number) => void; // Add this prop
}

export default function BanConfirmationDialog({ 
    open, 
    user, 
    onClose, 
    ban, 
    setSuccessMessage,
    onStatusUpdate 
}: BanConfirmationDialogProps) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    
    const handleBanUser = async () => {
        if (!user) return;
        
        setLoading(true);
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}ban_user/${user.google_id}`, 
                { status: ban },
                {
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`,
                    },
                }
            );
            
            if (response.status === 200) {
                // Update local state first
                if (onStatusUpdate) {
                    onStatusUpdate(user, parseInt(ban));
                }
                
                setSuccessMessage(ban === '1' ? "User unbanned successfully!" : "User banned successfully!");
                onClose();
            } else {
                console.error("Failed to ban user:", response.data);
                setSuccessMessage("Failed to update user status");
            }
        } catch (error) {
            console.error("Error banning user:", error);
            setSuccessMessage("Error updating user status");
        } finally {
            setLoading(false);
        }
    };

    if (!open || !user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-gray-800/30 backdrop-blur-sm"
                onClick={!loading ? onClose : undefined}
            ></div>

            <div className="relative bg-white rounded-lg shadow-xl w-[400px] z-10 p-6">
                <div className="text-center">
                    <p className="text-lg font-semibold mb-4 text-red-600">
                        Confirm {ban === '1' ? 'Unban' : "Ban"}
                    </p>
                    <p className="text-gray-700 mb-6">
                        Are you sure you want to {ban === '1' ? 'unban' : 'ban'} <span className="font-medium">{user.name}</span>?
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center"
                            onClick={handleBanUser}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                ban === '1' ? "Yes, Unban" : "Yes, Ban"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}