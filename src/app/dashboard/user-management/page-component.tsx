'use client';

import { User } from "@/app/type/user";
import { MagnifyingGlassIcon, PlusIcon, UserIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/16/solid";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import AddAdminDialog from "./add-admin-dialog";
import AddEndorserDialog from "./add-endorser-dialog";
import EditRoleDialog from "./edit-role-dialog";
import BanConfirmationDialog from "./ban-confirmation-dialog";
import SearchBar from "@/component/searchBar/searchBar";

const roleMapping: Record<number, string> = {
    1: "Student",
    2: "Endorser"
};

const getRoleBadgeStyles = (roleId: number) => {
    switch (roleId) {
        case 1:
            return "bg-blue-100 text-blue-800 border-blue-200";
        case 2:
            return "bg-green-100 text-green-800 border-green-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
};

const getStatusBadgeStyles = (status: number) => {
    return status === 1 
        ? "bg-green-100 text-green-800 border-green-200"
        : "bg-red-100 text-red-800 border-red-200";
};

interface UserManagementComponentProps {
    user: User[];
    amount: number;
}

export default function UserManagementComponent({ user, amount }: UserManagementComponentProps) {
    const { data: session } = useSession();
    const [userTypeSelected, setUserTypeSelected] = useState<string | null>(null);
    const [userList, setUserList] = useState<User[]>([]);
    const [searchResults, setSearchResults] = useState<User[]>([]); // New state for search results
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const [addAdminDialogOpen, setAddAdminDialogOpen] = useState<boolean>(false);
    const [addEndorserDialogOpen, setAddEndorserDialogOpen] = useState<boolean>(false);

    const [editRoleDialogOpen, setEditRoleDialogOpen] = useState<boolean>(false);
    const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);

    const [banConfirmationDialogOpen, setBanConfirmationDialogOpen] = useState<boolean>(false);
    const [banUser, setBanUser] = useState<User | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [isSearching, setIsSearching] = useState<boolean>(false); // New state for search loading

    // Initialize user list only once when component mounts or user prop changes
    useEffect(() => {
        if (user) {
            if (Array.isArray(user)) {
                setUserList(user);
                // Reset pagination on initial load
                if (user.length > 0) {
                    setCurrentPage(1);
                    setHasMore(true);
                }
            } else {
                setUserList([]);
                setCurrentPage(1);
                setHasMore(false);
            }
        } else {
            console.error("No user data provided");
            setUserList([]);
            setCurrentPage(1);
            setHasMore(false);
        }
    }, [user]);

    // New function to handle API search - memoized to prevent infinite loops
    const handleSearchAPI = useCallback(async (searchValue: string) => {
        if (!searchValue.trim()) {
            setSearchResults([]);
            setSearchTerm("");
            setIsSearching(false);
            return;
        }

        try {
            setIsSearching(true);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}admin_search_user`,
                {
                    params: { name: searchValue },
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`,
                        Accept: 'application/json',
                    },
                }
            );

            const searchData = response.data;
            if (Array.isArray(searchData)) {
                setSearchResults(searchData);
            } else {
                setSearchResults([]);
            }
            setSearchTerm(searchValue);
        } catch (error) {
            console.error("Error searching users:", error);
            setSearchResults([]);
            setSearchTerm(searchValue);
        } finally {
            setIsSearching(false);
        }
    }, [session?.user.accessToken]);

    const handleSearchChange = useCallback((searchValue: string) => {
        handleSearchAPI(searchValue);
    }, [handleSearchAPI]);

    const getRoleName = (roleId: number): string => {
        return roleMapping[roleId] || "Unknown";
    };

    const filteredUsers = (() => {
        const sourceUsers = searchTerm ? searchResults : userList;
        
        return sourceUsers.filter(u => {
            const matchesRole = userTypeSelected ? getRoleName(u.role_id) === userTypeSelected : true;
            return matchesRole;
        });
    })();

    const handleShowMore = async () => {
        if (loading || !hasMore || searchTerm) return;

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
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };
    const handleStatusUpdate = (userData: User, newStatus: number) => {
    console.log("Updating status for user:", userData, "New status:", newStatus);
    
    // Update in both userList and searchResults if applicable
    setUserList(prev => prev.map(u =>
        u.id === userData.id ? { ...u, status: newStatus } : u
    ));
    
    if (searchTerm && searchResults.length > 0) {
        setSearchResults(prev => prev.map(u =>
            u.id === userData.id ? { ...u, status: newStatus } : u
        ));
    }
    
    setBanConfirmationDialogOpen(false);
    setBanUser(null);
};

    const handleAddAdmin = (formData: any) => {
        const response = axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}admin/create_admin_account`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${session?.user.accessToken}`,
                    Accept: 'application/json',
                },
            }
        );
        setSuccessMessage("Admin added successfully!");
        setAddAdminDialogOpen(false);
    };

    const handleAddEndorser = (formData: any) => {
        setAddEndorserDialogOpen(false);
    };

    const handleEditClick = (userItem: User) => {
        setSelectedUserForEdit(userItem);
        setEditRoleDialogOpen(true);
    };

    const handleBanClick = (userItem: User) => {
        console.log("Banning user:", userItem);
        setBanUser(userItem);
        setBanConfirmationDialogOpen(true);
    };

    const handleRoleUpdate = (userData: User, newRole: number) => {

        
        // Update in both userList and searchResults if applicable
        setUserList(prev => prev.map(u =>
            u.id === userData.id ? { ...u, role_id: newRole } : u
        ));
        
        if (searchTerm && searchResults.length > 0) {
            setSearchResults(prev => prev.map(u =>
                u.id === userData.id ? { ...u, role_id: newRole } : u
            ));
        }
        
        setEditRoleDialogOpen(false);
        setSelectedUserForEdit(null);
    };

    // Filter click handler that doesn't reset the user list
    const handleFilterClick = (filterType: 'Student' | 'Endorser') => {
        setUserTypeSelected(userTypeSelected === filterType ? null : filterType);
        // Don't reset pagination or user list - just change the filter
    };

    const displaySuccessMessage = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(""), 4000);
    };

    // Check if we should show the "Show More" button
    // Only show if we're not filtering by role, not searching, and there are more to load
    const shouldShowLoadMore = !userTypeSelected && !searchTerm && hasMore && userList.length > 0;

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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
                    <p className="text-lg text-gray-600">Manage and oversee all system users</p>
                </div>

                <div className="flex justify-center mb-6 w-full">
                    <div className="relative w-full max-w-full">
                        <SearchBar 
                            onSearch={handleSearchChange} 
                            placeHolder="Search users by name..."
                        />
                        {isSearching && (
                            <div className="absolute top-1/2 right-12 transform -translate-y-1/2">
                                <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex flex-wrap gap-3">
                        <button
                            className="h-11 py-2 px-4 cursor-pointer rounded-lg text-base text-gray-700 hover:bg-blue-600 hover:text-white bg-white shadow-sm border border-gray-200 hover:border-blue-600 flex items-center transition-all duration-200 font-medium"
                            onClick={() => setAddEndorserDialogOpen(true)}
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Endorser
                        </button>
                        <button
                            className="h-11 py-2 px-4 cursor-pointer rounded-lg text-base text-gray-700 hover:bg-blue-600 hover:text-white bg-white shadow-sm border border-gray-200 hover:border-blue-600 flex items-center transition-all duration-200 font-medium"
                            onClick={() => setAddAdminDialogOpen(true)}
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Admin
                        </button>
                    </div>
                    
                    <div className="bg-white shadow-sm rounded-lg px-6 py-3 border border-gray-200">
                        <div className="flex items-center gap-4">
                            <span className="text-base font-medium text-gray-700">Filter by:</span>
                            <div className="flex items-center gap-2">
                                <button
                                    className={`px-3 py-1.5 rounded-lg text-base font-medium transition-all duration-200 ${
                                        userTypeSelected === 'Student' 
                                            ? 'bg-blue-600 text-white shadow-sm' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                    onClick={() => handleFilterClick('Student')}
                                >
                                    Student
                                </button>
                                <div className='w-px h-6 bg-gray-300'></div>
                                <button
                                    className={`px-3 py-1.5 rounded-lg text-base font-medium transition-all duration-200 ${
                                        userTypeSelected === 'Endorser' 
                                            ? 'bg-blue-600 text-white shadow-sm' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                    onClick={() => handleFilterClick('Endorser')}
                                >
                                    Endorser
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-base">
                        <div>
                            <span className="text-blue-600 font-semibold">Total loaded:</span>
                            <span className="ml-1 text-blue-800">{userList.length}</span>
                        </div>
                        <div>
                            <span className="text-blue-600 font-semibold">Displayed:</span>
                            <span className="ml-1 text-blue-800">{filteredUsers.length}</span>
                        </div>
                        <div>
                            <span className="text-blue-600 font-semibold">Filter:</span>
                            <span className="ml-1 text-blue-800">{userTypeSelected || 'None'}</span>
                        </div>
                        {searchTerm && (
                            <div>
                                <span className="text-blue-600 font-semibold">Search:</span>
                                <span className="ml-1 text-blue-800">"{searchTerm}" ({searchResults.length} results)</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4">
                        <div className="col-span-3 flex items-center text-base font-semibold text-gray-700">
                            <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                            User Information
                        </div>
                        <div className="col-span-3 flex items-center text-base font-semibold text-gray-700">
                            <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-500" />
                            Email Address
                        </div>
                        <div className="col-span-2 flex items-center text-base font-semibold text-gray-700">
                            <PhoneIcon className="w-4 h-4 mr-2 text-gray-500" />
                            Contact
                        </div>
                        <div className="col-span-2 text-base font-semibold text-gray-700">Role & Status</div>
                        <div className="col-span-2 text-base font-semibold text-gray-700">Actions</div>
                    </div>
                </div>

                {/* Table Body - Removed max-height restriction and improved scrolling */}
                <div className="overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                    {filteredUsers && filteredUsers.length > 0 ? (
                        filteredUsers.map((userItem, index) => (
                            <div key={userItem.id || index} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                                {/* User Information */}
                                <div className="col-span-3">
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
                                            
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="col-span-3 flex items-center">
                                    <div className="text-base text-gray-700 truncate">
                                        {userItem.email || 'N/A'}
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="col-span-2 flex items-center">
                                    <div className="text-base text-gray-700">
                                        {userItem.phone_number || 'N/A'}
                                    </div>
                                </div>

                                {/* Role & Status */}
                                <div className="col-span-2 flex items-center">
                                    <div className="space-y-1">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium border ${getRoleBadgeStyles(userItem.role_id)}`}>
                                            {getRoleName(userItem.role_id)}
                                        </span>
                                        <div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium border ${getStatusBadgeStyles(userItem.status)}`}>
                                                {userItem.status === 1 ? 'Active' : 'Banned'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-2 flex items-center">
                                    {userItem.google_id != null ? (
                                        <div className="flex space-x-2">
                                            <button
                                                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                                                onClick={() => handleEditClick(userItem)}
                                            >
                                                Update
                                            </button>
                                            {userItem.status == 1 ? 
                                                <button 
                                                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200 shadow-sm"
                                                    onClick={() => handleBanClick(userItem)}
                                                >
                                                    Ban
                                                </button> : 
                                                <button 
                                                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200 shadow-sm"
                                                    onClick={() => handleBanClick(userItem)}
                                                >
                                                    Unban
                                                </button>
                                            }
                                        </div>
                                    ) : (
                                        <div className="px-3 py-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-md">
                                            User hasn't logged in yet
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <UserIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No users found</h3>
                            <p className="text-base text-gray-500">
                                {isSearching ? 'Searching...' :
                                 userList.length === 0 ? 'No users found in data source' : 
                                 searchTerm ? `No users match the search term "${searchTerm}"` :
                                 userTypeSelected ? `No ${userTypeSelected.toLowerCase()} users found` :
                                 'No users match the current filter'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Load More Section - Moved outside scrollable area */}
                {shouldShowLoadMore && (
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                        <button
                            onClick={handleShowMore}
                            disabled={loading || !hasMore}
                            className={`w-full py-3 px-4 rounded-lg font-medium text-base transition-all duration-200 ${
                                hasMore 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading more users...
                                </div>
                            ) : (
                                "Load More Users"
                            )}
                        </button>
                    </div>
                )}

                {/* Filter Info Section - Moved outside scrollable area */}
                {(userTypeSelected || searchTerm) && (
                    <div className="p-4 border-t bg-blue-50 border-blue-200">
                        <div className="flex items-center justify-center">
                            <div className="bg-blue-100 rounded-full p-2 mr-3">
                                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="text-base text-blue-700 font-medium">
                                {userTypeSelected && !searchTerm && 
                                    `Showing ${userTypeSelected.toLowerCase()} users only. Clear filter to load more users.`
                                }
                                {searchTerm && !userTypeSelected && 
                                    `Showing search results for "${searchTerm}". Clear search to load more users.`
                                }
                                {userTypeSelected && searchTerm && 
                                    `Showing ${userTypeSelected.toLowerCase()} users matching "${searchTerm}". Clear filters to load more users.`
                                }
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <AddAdminDialog
                isOpen={addAdminDialogOpen}
                onClose={() => setAddAdminDialogOpen(false)}
                setSuccessMessage={displaySuccessMessage}
            />

            <AddEndorserDialog
                isOpen={addEndorserDialogOpen}
                onClose={() => setAddEndorserDialogOpen(false)}
                setSuccessMessage={displaySuccessMessage}
            />

            <EditRoleDialog
                open={editRoleDialogOpen}
                onClose={() => {
                    setEditRoleDialogOpen(false);
                    setSelectedUserForEdit(null);
                }}
                user={selectedUserForEdit}
                setSuccessMessage={displaySuccessMessage}
                onRoleUpdate={handleRoleUpdate}
            />

            <BanConfirmationDialog
                open={banConfirmationDialogOpen}
                onClose={() => {
                    setBanConfirmationDialogOpen(false);
                    setBanUser(null);
                }}
                user={banUser}
                ban={banUser?.status === 1 ? '0' : '1'}
                setSuccessMessage={displaySuccessMessage}
                onStatusUpdate={handleStatusUpdate}
            />
        </div>
    );
}