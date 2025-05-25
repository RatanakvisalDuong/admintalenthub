import { User } from '@/app/type/user';
import axios from 'axios';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";

interface BanConfirmationDialogProps {
    open: boolean;
    user: User | null;
    onClose: () => void;
    ban: string;
    setSuccessMessage: (message: string) => void;
}

export default function BanConfirmationDialog({ open, user, onClose, ban, setSuccessMessage }: BanConfirmationDialogProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const handleBanUser = async () => {
        setLoading(true);
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}ban_user/${user?.google_id}`, 
                { status: ban },
                {
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`,
                    },
                }
            );
            if (response.status === 200){
                router.refresh();
                setSuccessMessage(ban === '1' ? "User unbanned successfully!" : "User banned successfully!");
            }
            else {
                console.error("Failed to ban user:", response.data);
            }
            onClose();
        } catch (error) {
            console.error("Error banning user:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!open || !user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-gray-800/30 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="relative bg-white rounded-lg shadow-xl w-[400px] z-10 p-6">
                <div className="text-center">
                    <p className="text-lg font-semibold mb-4 text-red-600">Confirm Ban</p>
                    <p className="text-gray-700 mb-6">
                        Are you sure you want to ban <span className="font-medium">{user.name}</span>? This action cannot be undone.
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
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            onClick={handleBanUser}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : ban === '1' ? "Yes, Unban" : "Yes, Ban"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}