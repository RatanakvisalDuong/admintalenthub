'use client';

import Image from "next/image";

export default function Login() {
  return (
    <div className="flex min-h-screen text-black">
      <div className="w-full md:w-2/5 flex flex-col justify-center p-8 md:p-16 bg-white shadow-lg">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-4xl font-bold mb-1 text-black w-max mx-auto">
            Talent<span className="text-[#5086ed]">Hub</span>
          </h1>
          <p className="text-lg font-medium mb-8 text-gray-800 w-max mx-auto">
            Login into your admin account
          </p>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
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

            <button
              type="submit"
              className="w-full bg-[#5086ed] hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out text-white py-3 rounded font-medium shadow-md cursor-pointer"
              onClick={(e) => {
              e.preventDefault(); 
              window.location.href = 'dashboard/portfolio-management';
              }}
            >
              Login Now
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