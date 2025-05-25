import { User } from "@/app/type/user";
import { XMarkIcon } from "@heroicons/react/16/solid";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";

interface EditRoleDialogProps {
    user: User | null;
    open: boolean;
    onClose: () => void;
    setSuccessMessage: (message: string) => void;
}

export default function EditRoleDialog({ user, open, onClose, setSuccessMessage }: EditRoleDialogProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<string>("");

    useEffect(() => {
        if (user) {
            setSelectedRole(user.role_id.toString());
        }
    }, [user]);

    const onUpdate = async () => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}update_user_role/${user?.google_id}`,
                { role_id: parseInt(selectedRole) },
                {
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`,
                    },
                }
            );
            if (response.status === 200) {
                onClose();
                router.refresh();
                setSuccessMessage("User role updated successfully!");
            } else {
                console.error("Failed to update user role:", response.data);
            }
        }
        catch (error) {
            console.error("Error updating user role:", error);
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-[#5086ed] text-white rounded-md hover:bg-blue-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={onUpdate}
                    >
                        Update Role
                    </button>
                </div>
            </div>
        </div>
    );
}