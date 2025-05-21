'use client'

import AppBar from "@/component/appbar/appbar";

export default function SpecialLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50">
        <AppBar />
      {children}
    </div>
  );
}
