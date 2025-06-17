import { User } from "@/app/type/user";
import { XMarkIcon } from "@heroicons/react/16/solid";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';

interface EditRoleDialogProps {
    user: User | null;
    open: boolean;
    onClose: () => void;
    setSuccessMessage: (message: string) => void;
    onRoleUpdate?: (user: User, newRoleId: number) => void; // Add this prop
}

export default function EditRoleDialog({ 
    user, 
    open, 
    onClose, 
    setSuccessMessage, 
    onRoleUpdate 
}: EditRoleDialogProps) {
    const { data: session } = useSession();
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setSelectedRole(user.role_id.toString());
        }
    }, [user]);

    const onUpdate = async () => {
        if (!user || !selectedRole) return;
        
        try {
            setLoading(true);
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}update_user_role/${user.google_id}`,
                { role_id: parseInt(selectedRole) },
                {
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`,
                    },
                }
            );
            
            if (response.status === 200) {
                // Update local state first
                if (onRoleUpdate) {
                    onRoleUpdate(user, parseInt(selectedRole));
                }
                
                setSuccessMessage("User role updated successfully!");
                onClose();
            } else {
                console.error("Failed to update user role:", response.data);
                setSuccessMessage("Failed to update user role");
            }
        }
        catch (error) {
            console.error("Error updating user role:", error);
            setSuccessMessage("Error updating user role");
        } finally {
            setLoading(false);
        }
    }

    if (!open || !user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-gray-800/30 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="relative bg-white rounded-lg shadow-xl w-[400px] z-10 p-6">
                <div className="flex justify-between items-center border-b mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Update Role - {user.name}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={loading}
                    >
                        <XMarkIcon className="w-5 h-5 cursor-pointer hover:text-red-600" />
                    </button>
                </div>
                
                <div className="mb-4">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Role
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value="" disabled>Select a role</option>
                        <option value="1">Student</option>
                        <option value="2">Endorser</option>
                    </select>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={onUpdate}
                        disabled={loading || !selectedRole || selectedRole === user.role_id.toString()}
                        className="px-4 py-2 bg-[#5086ed] text-white rounded-md hover:bg-blue-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </>
                        ) : (
                            "Update Role"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}