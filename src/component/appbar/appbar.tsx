'use client';

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import ChangePasswordDialog from "../changePasswordDialog/page"; 
import Image from "next/image";

export default function AppBar() {
	const { data: session } = useSession();
	const [isOpen, setIsOpen] = useState(false);
	const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleChangePasswordClick = () => {
		setShowChangePasswordDialog(true);
		setIsOpen(false);
	};

	const handleLogout = async () => {
		axios.post(
			`${process.env.NEXT_PUBLIC_API_URL}admin/logout`,
			{
				headers: {
					Authorization: `Bearer ${session?.user.accessToken}`,
				},
			}
		);
		signOut({ redirect: false });
		window.location.href = "/";
	}

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	return (
		<>
			<nav className="bg-white shadow-md w-full fixed top-0 left-0 right-0 z-50 h-16">
				<div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<Link className="flex" href="/dashboard/portfolio-management">
							<Image
								src="/logo.png"
								alt="Paragon International University Logo"
								width={200}
								height={100}
								className="cursor-pointer ml-4"
							/>
						</Link>

						<div className="relative" ref={dropdownRef}>
							<button
								onClick={toggleDropdown}
								className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 font-medium focus:outline-none cursor-pointer px-4 py-2 rounded-md transition-colors"
							>
								<span>{session?.user.name}</span>
								<svg 
									className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
									fill="none" 
									stroke="currentColor" 
									viewBox="0 0 24 24" 
									xmlns="http://www.w3.org/2000/svg"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							</button>

							{isOpen && (
								<div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-xl py-1 z-50 transition-all duration-200 ease-in-out">
									<div className="px-4 py-3 border-b border-gray-100">
										<p className="text-sm font-medium text-gray-900 truncate">{session?.user.name}</p>
										<p className="text-sm text-gray-500 truncate">{session?.user.email}</p>
									</div>
									<button
										onClick={handleChangePasswordClick}
										className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-500"
									>
										<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
										</svg>
										Change Password
									</button>
									<button
										onClick={handleLogout}
										className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-700 cursor-pointer"
									>
										<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
										</svg>
										Logout
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</nav>

			<ChangePasswordDialog 
				isOpen={showChangePasswordDialog}
				onClose={() => setShowChangePasswordDialog(false)}
			/>
		</>
	);
}