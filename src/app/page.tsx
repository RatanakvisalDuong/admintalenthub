'use client';

import Image from "next/image";
import { signIn } from 'next-auth/react';
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email || !password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        try {
            const response = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });
            if (response?.error) {
                setError(response.error);
            } else {
                router.push('dashboard/user-management');
            }
        } catch (error: any) {
            if (error.response) {
                setError(error.response.data.error || error.response.data.message || 'Login failed');
            } else if (error.request) {
                setError('No response from server. Please try again.');
            } else {
                setError('An error occurred during login');
            }
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen text-black fixed w-full">
            <div className="w-full md:w-2/5 flex flex-col justify-center p-8 md:p-16 bg-white shadow-lg">
                <div className="max-w-md mx-auto w-full">
                    <h1 className="text-4xl font-bold mb-1 text-black w-max mx-auto">
                        Talent<span className="text-[#5086ed]">Hub</span>
                    </h1>
                    <p className="text-lg font-medium mb-8 text-gray-800 w-max mx-auto">
                        Login into your admin account
                    </p>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full p-3 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#5086ed]"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="mb-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full p-3 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#5086ed]"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="text-right mb-6">
                            <a href="#" className="text-sm text-[#5086ed] hover:underline">
                                Forgot Password?
                            </a>
                        </div>

                        {/* Error message display */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-[#5086ed] hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'} transition-all duration-300 ease-in-out text-white py-3 rounded font-medium shadow-md cursor-pointer`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </span>
                            ) : 'Login Now'}
                        </button>
                    </form>
                </div>
            </div>
            <div className="hidden md:flex md:w-3/5 bg-gray-50 items-center justify-center relative">
                <div className="w-full max-w-lg flex flex-col items-center">
                    <h1 className="font-bold text-xl mb-6 text-center">Welcome to TalentHub Admin Panel</h1>
                    <div className="relative w-full h-80">
                        <Image
                            src="/piu.png"
                            alt="Login illustration"
                            width={150}
                            height={300}
                            priority
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                </div>
                <div className="absolute bottom-0 right-0">
                    <div className="flex space-x-1">
                    </div>
                </div>
            </div>
        </div>
    );
}