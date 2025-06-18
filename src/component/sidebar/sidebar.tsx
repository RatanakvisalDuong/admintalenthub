'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface EndorserRequestResponse {
    success: boolean;
    count: number;
    data: Array<{
        id: number;
        name: string;
        email: string;
        contact: string;
        created_at: string;
    }>;
}

export default function SideBar({ onSelectTabAction }: { onSelectTabAction: (id: number) => void }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [pendingEndorserCount, setPendingEndorserCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Fetch pending endorser count
    useEffect(() => {
        const fetchPendingCount = async () => {
            if (!session?.user?.accessToken) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get<EndorserRequestResponse>(
                    `${process.env.NEXT_PUBLIC_API_URL}admin_view_all_endorser_request`,
                    {
                        headers: {
                            Authorization: `Bearer ${session.user.accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.data.success) {
                    setPendingEndorserCount(response.data.count);
                }
            } catch (error) {
                console.error('Error fetching pending endorser count:', error);
                setPendingEndorserCount(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPendingCount();

        // Optional: Set up polling to refresh count every 30 seconds
        const interval = setInterval(fetchPendingCount, 30000);

        return () => clearInterval(interval);
    }, [session?.user?.accessToken]);

    const menuItems = [
        {
            id: 0,
            name: "Portfolio Management",
            path: "/dashboard/portfolio-management",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="9" />
                    <rect x="14" y="3" width="7" height="5" />
                    <rect x="14" y="12" width="7" height="9" />
                    <rect x="3" y="16" width="7" height="5" />
                </svg>
            ),
        },
        {
            id: 1,
            name: "Employment Management",
            path: "/dashboard/employment-management",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
            ),
        },
        {
            id: 2,
            name: "User Management",
            path: "/dashboard/user-management",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6" />
                    <path d="M23 11h-6" />
                </svg>
            ),
        },
        {
            id: 3,
            name: "Pending Endorser Application",
            path: "/dashboard/pending-endorser-application",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                </svg>
            ),
            showBadge: true,
        },
    ];

    return (
        <div className="w-64 h-full bg-white shadow-lg fixed">
            <div className="px-2 mt-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;

                    return (
                        <Link
                            key={item.id}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 my-1 rounded-md cursor-pointer transition-all duration-300 relative ${isActive ? "bg-blue-600 text-white" : "text-black hover:bg-gray-100"
                                }`}
                            onClick={() => onSelectTabAction(item.id)}
                        >
                            <span className={`${isActive ? "text-white" : "text-gray-600"}`}>
                                {item.icon}
                            </span>
                            <span className="font-medium flex-1">{item.name}</span>
                            {item.showBadge && (
                                <>
                                    {isLoading ? (
                                        <span className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                            isActive 
                                                ? "bg-white text-[#5086ed]" 
                                                : "bg-gray-300"
                                        }`}>
                                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                        </span>
                                    ) : pendingEndorserCount > 0 ? (
                                        <span className={`min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center ${
                                            isActive 
                                                ? "bg-white text-[#5086ed]" 
                                                : "bg-red-500 text-white"
                                        }`}>
                                            {pendingEndorserCount > 99 ? '99+' : pendingEndorserCount}
                                        </span>
                                    ) : null}
                                </>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}