'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SideBar({ onSelectTab }: { onSelectTab: (id: number) => void }) {
    const pathname = usePathname();

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
    ];

    return (
        <div className="w-64 h-full bg-white shadow-lg">
            <div className="px-2 mt-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;

                    return (
                        <Link
                            key={item.id}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 my-1 rounded-md cursor-pointer transition-all duration-300 ${isActive ? "bg-[#5086ed] text-white" : "text-black hover:bg-gray-100"
                                }`}
                            onClick={() => onSelectTab(item.id)}
                        >
                            <span className={`${isActive ? "text-white" : "text-gray-600"}`}>
                                {item.icon}
                            </span>
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
