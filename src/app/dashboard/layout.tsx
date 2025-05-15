'use client'

import { useState } from "react";
import AppBar from "@/component/appbar/appbar";
import SideBar from "@/component/sidebar/sidebar";

export default function Layout({children}: {children: React.ReactNode}) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="flex flex-col h-screen text-black overflow-hidden">
            <AppBar />
            <div className="flex flex-1 pt-16 overflow-hidden">
                <SideBar onSelectTabAction={setActiveTab} />
                <main className="flex-1 bg-gray-50 ml-64 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}