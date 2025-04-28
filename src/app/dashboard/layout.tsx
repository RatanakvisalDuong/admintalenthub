'use client'

import { useState } from "react";
import AppBar from "@/component/appbar/appbar";
import SideBar from "@/component/sidebar/sidebar";
// import PortfolioManagementPage from "@/component/portfolio-management/page";
// import EmploymentManagementPage from "@/component/employment-management/page";
// import UserManagementPage from "@/component/user-management/page";

export default function Layout({children}: {children: React.ReactNode}) {
    const [activeTab, setActiveTab] = useState(0);

    // const renderContent = () => {
    //     switch (activeTab) {
    //         case 0:
    //             return <PortfolioManagementPage />;
    //         case 1:
    //             return <EmploymentManagementPage />;
    //         case 2:
    //             return <UserManagementPage />;
    //         default:
    //             return <PortfolioManagementPage />;
    //     }
    // };

    return (
        <div className="flex flex-col h-screen text-black">
            <AppBar />
            <div className="flex flex-1 pt-16">
                <SideBar onSelectTab={setActiveTab} />
                <main className="flex-1 overflow-auto bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
}