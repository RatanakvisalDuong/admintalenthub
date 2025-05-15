'use client';

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";

export default function AppBar() {
	const { data: session } = useSession();
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
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

	return (
		<nav className="bg-white shadow-md w-full fixed top-0 left-0 right-0 z-50 h-16">
			<div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<Link className="flex" href="/">
						<h1 className="text-2xl font-bold text-black cursor-pointer">
							Talent
						</h1>
						<h1 className="text-[#5086ed] text-2xl font-bold cursor-pointer">
							Hub
						</h1>
					</Link>

					<div className="relative">
						<button
							onClick={toggleDropdown}
							className="flex items-center space-x-2 text-black font-medium focus:outline-none cursor-pointer"
						>
							Admin
						</button>

						{isOpen && (
							<div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
								<Link
									href="/change-password"
									className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
								>
									Change Password
								</Link>
								<button
									onClick={() => {
										handleLogout();
									}
									}
									className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
								>
									Logout
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
