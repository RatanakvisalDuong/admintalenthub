'use client';

import { User } from "@/app/type/user";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/16/solid";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import AddAdminDialog from "./add-admin-dialog";
import AddEndorserDialog from "./add-endorser-dialog";

const roleMapping: Record<number, string> = {
    1: "Student",
    2: "Endorser"
};

export default function UserManagementComponent({ user, amount }: { user: User[]; amount: number }) {
    const { data: session } = useSession();
    const [userTypeSelected, setUserTypeSelected] = useState<string | null>(null);
    const [userList, setUserList] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [addAdminDialogOpen, setAddAdminDialogOpen] = useState<boolean>(false);
    const [addEndorserDialogOpen, setAddEndorserDialogOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    
    const [lastUserTypeSelected, setLastUserTypeSelected] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            if (Array.isArray(user)) {
                setUserList(user);
            } else if (user && Array.isArray(user)) {
                setUserList(user);
            } else {
                setUserList([]);
            }
        } else {
            console.error("No user data provided");
            setUserList([]);
        }
        
        // Reset pagination when initial data loads
        setCurrentPage(1);
        setHasMore(true);
    }, [user]);
    
    useEffect(() => {
        if (lastUserTypeSelected !== userTypeSelected) {
            setLastUserTypeSelected(userTypeSelected);
            setCurrentPage(1);
            setHasMore(true);
        }
    }, [userTypeSelected]);

    const handleChange = (_event: React.ChangeEvent<HTMLInputElement>) => {
    };

    const getRoleName = (roleId: number): string => {
        return roleMapping[roleId] || "Unknown";
    };

    const filteredUsers = userTypeSelected
        ? userList.filter(u => getRoleName(u.role_id) === userTypeSelected)
        : userList;

    const handleShowMore = async () => {
        if (loading || !hasMore) return;

        try {
            setLoading(true);
            const nextPage = currentPage + 1;

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}users`,
                {
                    params: { page: nextPage },
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`,
                        Accept: 'application/json',
                    },
                }
            );

            const newUsers = response.data;
            if (Array.isArray(newUsers)) {
                const existingIds = new Set(userList.map(user => user.id));
                const uniqueNewUsers = newUsers.filter(user => !existingIds.has(user.id));

                if (uniqueNewUsers.length < 10) {
                    setHasMore(false);
                }

                if (uniqueNewUsers.length > 0) {
                    setUserList(prev => [...prev, ...uniqueNewUsers]);
                    setCurrentPage(nextPage); 
                } else {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching more users:", error);
            if (axios.isAxiosError(error)) {
                // Handle specific error if needed
            }
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAdmin = (formData: any) => {
        // Implement the API call to add an admin
        console.log("Adding admin:", formData);
        // Example API call:
        // axios.post(`${process.env.NEXT_PUBLIC_API_URL}users/admin`, formData, {
        //     headers: {
        //         Authorization: `Bearer ${session?.user.accessToken}`,
        //         Accept: 'application/json',
        //     },
        // })
        // .then(response => {
        //     // Handle success, maybe add the new user to the list
        //     const newAdmin = response.data.user;
        //     setUserList(prev => [...prev, newAdmin]);
        // })
        // .catch(error => {
        //     console.error("Error adding admin:", error);
        // });

        setAddAdminDialogOpen(false);
    };

    const handleAddEndorser = (formData: any) => {
        // Implement the API call to add an endorser
        console.log("Adding endorser:", formData);
        // Example API call:
        // axios.post(`${process.env.NEXT_PUBLIC_API_URL}users/endorser`, formData, {
        //     headers: {
        //         Authorization: `Bearer ${session?.user.accessToken}`,
        //         Accept: 'application/json',
        //     },
        // })
        // .then(response => {
        //     // Handle success, maybe add the new user to the list
        //     const newEndorser = response.data.user;
        //     setUserList(prev => [...prev, newEndorser]);
        // })
        // .catch(error => {
        //     console.error("Error adding endorser:", error);
        // });

        setAddEndorserDialogOpen(false);
    };

    return (
        <div className="flex flex-col h-full p-8">
            {/* Fixed header content */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold mb-4">User Management</h1>

                <div className="flex justify-center">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search User..."
                            className="w-full h-10 rounded-lg pl-4 pr-4 text-gray-500 bg-white shadow-sm"
                            onChange={handleChange}
                        />
                        <MagnifyingGlassIcon className="w-6 h-6 text-gray-500 absolute top-1/2 right-3 transform -translate-y-1/2" />
                    </div>
                </div>

                <div className="flex mt-4 justify-between">
                    <div className="flex">
                        <button className="h-10 py-2 px-4 cursor-pointer rounded-sm text-black hover:bg-[#5086ed] hover:text-white bg-white shadow-md flex items-center"
                            onClick={() => {
                                setAddEndorserDialogOpen(true);
                            }}
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Endorser
                        </button>
                        <button className="ml-4 h-10 py-2 px-4 cursor-pointer rounded-sm text-black hover:bg-[#5086ed] hover:text-white bg-white shadow-md flex items-center"
                            onClick={() => {
                                setAddAdminDialogOpen(true);
                            }}
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Admin
                        </button>
                    </div>
                    <div className="bg-white shadow-md rounded-lg px-4 py-2 text-black">
                        <div className="flex justify-start items-center h-full">
                            <h1 className="text-md">
                                Filter by:
                            </h1>
                            <div
                                className={`hover:cursor-pointer p-2 ml-4 rounded-sm ${userTypeSelected === 'Student' ? 'bg-[#5086ed] text-white' : 'text-black hover:bg-gray-100'}`}
                                onClick={() => {
                                    // If selecting a different filter, reset pagination
                                    if (userTypeSelected !== 'Student') {
                                        setCurrentPage(1);
                                        setHasMore(true);
                                        setLastUserTypeSelected('Student');
                                    }
                                    setUserTypeSelected(userTypeSelected === 'Student' ? null : 'Student');
                                }}
                            >
                                Student
                            </div>
                            <div className='w-[1px] h-8 bg-gray-700 mx-4'></div>
                            <div
                                className={`hover:cursor-pointer p-2 rounded-sm ${userTypeSelected === 'Endorser' ? 'bg-[#5086ed] text-white' : 'text-black hover:bg-gray-100'}`}
                                onClick={() => {
                                    // If selecting a different filter, reset pagination
                                    if (userTypeSelected !== 'Endorser') {
                                        setCurrentPage(1);
                                        setHasMore(true);
                                        setLastUserTypeSelected('Endorser');
                                    }
                                    setUserTypeSelected(userTypeSelected === 'Endorser' ? null : 'Endorser');
                                }}
                            >
                                Endorser
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 p-2 bg-gray-100 text-xs">
                    <p>Total users: {userList.length}</p>
                    <p>Filtered users: {filteredUsers.length}</p>
                    <p>Current filter: {userTypeSelected || 'None'}</p>
                </div>
            </div>

            <div className="flex-1 relative">
                <div className="absolute inset-0 bg-white rounded-lg shadow-md">
                    <div className="sticky top-0 z-10 bg-gray-200 rounded-t-lg">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 text-left text-gray-600 font-semibold w-[20%]">Name</th>
                                    <th className="py-2 px-4 text-left text-gray-600 font-semibold w-[30%]">Email</th>
                                    <th className="py-2 px-4 text-left text-gray-600 font-semibold w-[20%]">Contact</th>
                                    <th className="py-2 px-4 text-left text-gray-600 font-semibold w-[10%]">Role</th>
                                    <th className="py-2 px-4 text-left text-gray-600 font-semibold w-[20%]">Actions</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="overflow-y-auto max-h-[calc(100%-40px)]">
                        <table className="min-w-full">
                            <tbody>
                                {filteredUsers && filteredUsers.length > 0 ? (
                                    filteredUsers.map((userItem, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-100">
                                            <td className="py-2 px-4 text-gray-700 w-[20%]">{userItem.name || 'N/A'}</td>
                                            <td className="py-2 px-4 text-gray-700 w-[30%]">{userItem.email || 'N/A'}</td>
                                            <td className="py-2 px-4 text-gray-700 w-[20%]">{userItem.phone_number || 'N/A'}</td>
                                            <td className="py-2 px-4 text-gray-700 w-[10%]">{getRoleName(userItem.role_id)}</td>
                                            <td className="py-2 px-4 text-gray-700 w-[20%] flex space-x-2">
                                                <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">Edit</button>
                                                <button className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600">Ban</button>
                                            </td>
                                        </tr>
                                    ),)
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-4 text-center text-gray-500">
                                            {userList.length === 0 ? 'No users found in data source' : 'No users match the current filter'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {filteredUsers.length > 0 && hasMore && (
                            <div className="p-4 border-t">
                                <button
                                    onClick={handleShowMore}
                                    disabled={loading || !hasMore}
                                    className={`w-full py-2 ${hasMore ? 'bg-[#5086ed]' : 'bg-gray-400'} text-white font-medium rounded-md hover:bg-gradient-to-r ${hasMore ? 'hover:from-blue-500 hover:to-indigo-500' : ''} hover:text-white hover:scale-101 transition-all duration-300 ease-in-out ${hasMore ? 'cursor-pointer' : 'cursor-not-allowed'} group`}
                                >
                                    {loading ? "Loading..." : "Show More"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AddAdminDialog 
                isOpen={addAdminDialogOpen} 
                onClose={() => setAddAdminDialogOpen(false)} 
                onSubmit={handleAddAdmin}
            />

            <AddEndorserDialog
                isOpen={addEndorserDialogOpen} 
                onClose={() => setAddEndorserDialogOpen(false)} 
                onSubmit={handleAddEndorser}
            />
        </div>
    );
}