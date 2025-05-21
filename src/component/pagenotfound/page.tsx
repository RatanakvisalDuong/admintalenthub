import Link from "next/link";
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function PageNotFound() {
    return (
        <div className="w-full h-full">
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="bg-blue-600 p-4 flex items-center justify-center">
                        <ExclamationCircleIcon className="h-12 w-12 text-white" />
                    </div>
                    <div className="p-6 text-center">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h1>
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                            <p className="text-gray-700">
                                The page you are looking for doesn't exist or has been moved.
                                Please check the URL or navigate back to the homepage.
                            </p>
                        </div>

                        <div className="mt-4">
                            <Link
                                href="/"
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Return to Homepage
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}