'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useState } from 'react';


export default function PortfolioManagementComponent() {
    const [selected, setSelected] = useState('Portfolio');
    const [userTypeSelected, setUserTypeSelected] = useState('Student');

    const handleChange = (_event: React.ChangeEvent<HTMLInputElement>) => {
        // onSearch(event.target.value);
    };

    return (
        <div className="flex flex-col h-full p-8">
            <h1 className="text-2xl font-bold mb-4">Portfolio Management</h1>
            <div className="flex justify-center">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search Portfolio..."
                        className="w-full h-10 rounded-lg pl-4 pr-4 text-gray-500 bg-white shadow-sm"
                        onChange={handleChange}
                    />
                    <MagnifyingGlassIcon className="w-6 h-6 text-gray-500 absolute top-1/2 right-3 transform -translate-y-1/2" />
                </div>
            </div>
            <div className='flex mt-4  justify-between'>
                <div className='w-78 h-max bg-white shadow-md rounded-lg p-4'>
                    <div
                        className={`w-full h-10 p-2 cursor-pointer rounded-sm ${selected === 'Portfolio' ? 'bg-[#5086ed] text-white' : 'text-black hover:bg-gray-100'}`}
                        onClick={() => setSelected('Portfolio')}
                    >
                        Portfolio
                    </div>
                    <div
                        className={`w-full h-10 p-2 cursor-pointer rounded-sm ${selected === 'Project' ? 'bg-[#5086ed] text-white' : 'text-black hover:bg-gray-100'}`}
                        onClick={() => setSelected('Project')}
                    >
                        Project
                    </div>
                </div>
                <div className='w-full'>
                    <div className='h-12 bg-white shadow-md rounded-lg ml-13'>
                        <div className='flex justify-start items-center h-full'>
                            <h1 className='font-bold text-lg ml-4'>
                                Filter by:
                            </h1>
                            <div className={`hover:cursor-pointer p-2 ml-4 rounded-sm ${userTypeSelected === 'Student' ? 'bg-[#5086ed] text-white' : 'text-black hover:bg-gray-100'}`} onClick={() => setUserTypeSelected('Student')}>
                                Student
                            </div>
                            <div className='w-[1px] h-8 bg-gray-700 mx-4'></div>
                            <div className={`hover:cursor-pointer  p-2 rounded-sm ${userTypeSelected === 'Endorser' ? 'bg-[#5086ed] text-white' : 'text-black hover:bg-gray-100'}`} onClick={() => setUserTypeSelected('Endorser')}>
                                Endorser
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-8 justify-items-end mt-4">

                        {Array.from({ length: 5 }, (_, index) => (
                            <Link
                                key={index}
                                className="w-54 h-64 rounded-lg shadow-md bg-white p-4 text-black transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                                href={`/portfolio/${index}`}
                            >
                                <div className="flex justify-between items-center">
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}