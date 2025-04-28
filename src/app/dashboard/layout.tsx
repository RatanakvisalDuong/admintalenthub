'use client'

import { useState } from "react";
import AppBar from "@/component/appbar/appbar";
import SideBar from "@/component/sidebar/sidebar";

export default function Layout({children}: {children: React.ReactNode}) {
    const [activeTab, setActiveTab] = useState(0);

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