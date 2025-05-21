'use client';

import { convertPhoneNumberSpacing } from '@/app/utils';
import { getMajorName } from '@/dummydata/major';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import '@fortawesome/fontawesome-free/css/all.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function PortfolioManagementComponent({ portfolio, project }: { portfolio: any, project: any }) {
    const { data: session } = useSession();
    const [selected, setSelected] = useState('Portfolio');
    const [userTypeSelected, setUserTypeSelected] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [portfolioPage, setPortfolioPage] = useState(1);
    const [projectPage, setProjectPage] = useState(1);
    const [hasMorePortfolios, setHasMorePortfolios] = useState(true);
    const [hasMoreProjects, setHasMoreProjects] = useState(true);
    const [portfolioData, setPortfolioData] = useState(portfolio || []);
    const [projectData, setProjectData] = useState(project || []);

    const isFilterApplied = searchTerm || userTypeSelected;

    const filteredPortfolios = useMemo(() => {
        let result = Array.isArray(portfolioData) ? portfolioData : [];

        if (searchTerm) {
            result = result.filter(item =>
                item.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (userTypeSelected === 'Student') {
            result = result.filter(item => item.role === 1);
        } else if (userTypeSelected === 'Endorser') {
            result = result.filter(item => item.role === 2);
        }

        return result;
    }, [portfolioData, searchTerm, userTypeSelected]);

    useEffect(() => {
        if (selected === 'Portfolio') {
            setHasMorePortfolios(true);
        } else {
            setHasMoreProjects(true);
        }
    }, [selected]);

    useEffect(() => {
        if (Array.isArray(project)) {
            const filtered: any = project.filter(item => {
                const matchesSearch = searchTerm ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
                if (userTypeSelected && item.portfolio_id) {
                    const owner = getProjectOwner(item.portfolio_id);
                    if (owner) {
                        if (userTypeSelected === 'Student' && owner.role !== 1) return false;
                        if (userTypeSelected === 'Endorser' && owner.role !== 2) return false;
                    }
                }

                return matchesSearch;
            });
            setFilteredProjects(filtered);
        }
    }, [project, searchTerm, userTypeSelected]);

    const getProjectOwner = (portfolioId: any) => {
        if (!Array.isArray(portfolio)) return null;
        return portfolio.find(item => item.id === portfolioId);
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const getVisibilityLabel = (status: any) => {
        return status === 1 ? 'Public' : 'Private';
    };

    const loadMorePortfolios = async () => {
        if (!hasMorePortfolios || isLoading) return;
        try {
            setIsLoading(true);
            const portfolioData = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}admin_view_all_portfolio`,
                {
                    params: {
                        page: portfolioPage + 1,
                    },
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log(portfolioData.data);
            const newPortfolios = portfolioData.data || [];
            if (newPortfolios.length === 0) {
                setHasMorePortfolios(false);
            } else {
                setPortfolioData((prevData: any) => [...prevData, ...newPortfolios]);
                setPortfolioPage(portfolioPage + 1);
            }
        } catch (error) {
            console.error("Error loading more portfolios:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMoreProjects = async () => {
        if (!hasMoreProjects || isLoading) return;

        try {
            setIsLoading(true);
            const nextPage = projectPage + 1;

            const projectData = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}admin_view_all_project`,
                {
                    params: {
                        page: nextPage,
                    },
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`,
                    },
                }
            );

            const newProjects = projectData.data || [];

            if (newProjects.length === 0) {
                setHasMoreProjects(false);
            } else {
                setProjectData([...project, ...newProjects]);
                setProjectPage(nextPage);
                if (newProjects.length < 2) {
                    setHasMoreProjects(true);
                }
            }
        } catch (error) {
            console.error("Error loading more projects:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const checkProjectIsSelected = () =>{
        setSelected('Project');
        setUserTypeSelected('');
    }

    return (
        <div className="flex flex-col h-full p-8 pb-16 ">
            <h1 className="text-2xl font-bold mb-4">Portfolio Management</h1>
            <div className="flex justify-center">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder={`Search ${selected}...`}
                        className="w-full h-10 rounded-lg pl-4 pr-10 text-gray-500 bg-white shadow-sm"
                        onChange={(e) => handleSearch(e.target.value)}
                        value={searchTerm}
                    />
                    <MagnifyingGlassIcon className="w-6 h-6 text-gray-500 absolute top-1/2 right-3 transform -translate-y-1/2" />
                </div>
            </div>
            <div className='flex mt-4 justify-between'>
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
                <div className='w-full ml-4'>
                    {selected === 'Portfolio' && (
                        <>
                            <div className='h-12 bg-white shadow-md rounded-lg'>
                                <div className='flex justify-between items-center h-full'>
                                    <div className="flex items-center">
                                        <h1 className='font-bold text-lg ml-4'>
                                            Filter by:
                                        </h1>
                                        <div className={`hover:cursor-pointer p-2 ml-4 rounded-sm ${userTypeSelected === 'Student' ? 'bg-[#5086ed] text-white' : 'text-black hover:bg-gray-100'}`} onClick={() => setUserTypeSelected(userTypeSelected === 'Student' ? '' : 'Student')}>
                                            Student
                                        </div>
                                        <div className='w-[1px] h-8 bg-gray-700 mx-4'></div>
                                        <div className={`hover:cursor-pointer p-2 rounded-sm ${userTypeSelected === 'Endorser' ? 'bg-[#5086ed] text-white' : 'text-black hover:bg-gray-100'}`} onClick={() => setUserTypeSelected(userTypeSelected === 'Endorser' ? '' : 'Endorser')}>
                                            Endorser
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-8 mt-4 mb-8">
                                {isFilterApplied ? (
                                    // Display filtered portfolios when filter is applied
                                    filteredPortfolios.length > 0 ? (
                                        filteredPortfolios.map((item: any) => (
                                            <Link
                                                key={item.user_id || item.id}
                                                className="w-full rounded-lg shadow-md bg-white p-4 text-black transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                                                href={`/portfolio/${item.user_id}`}
                                            >
                                                <div className="flex flex-col h-full">
                                                    <div className="flex justify-end mb-2">
                                                        {item.role === 2 ?
                                                            <div
                                                                className={`h-6 flex justify-center items-center text-white text-xs rounded-xl bg-[#5086ed] px-2`}
                                                            >
                                                                <i className="fas fa-check-circle mr-2"></i>
                                                                <span>Endorser</span>
                                                            </div>
                                                            : <div
                                                                className={`h-6 flex justify-center items-center text-white text-xs rounded-xl ${item.working_status === 2 ? 'bg-[#00BD62] w-24' : 'bg-[#0277B6] w-16'}`}
                                                            >
                                                                {item.working_status === 2 ? 'Open for Work' : 'Working'}
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex flex-col items-center mt-3 space-y-3">
                                                            <Image
                                                                src={item.photo}
                                                                alt="Profile Picture"
                                                                width={100}
                                                                height={100}
                                                                className="rounded-lg aspect-square object-cover border border-gray-300"
                                                            />

                                                            <div className="w-full space-y-2 text-center">
                                                                <p className="text-base font-semibold">{item.name}</p>

                                                                <div className="text-sm text-gray-600">
                                                                    <p><span className="font-bold">Contact:</span> {convertPhoneNumberSpacing(item.phone_number || '') || 'N/A'}</p>
                                                                    {item.role === 1 && (
                                                                        <p><span className="font-bold">Major:</span> {getMajorName(item.major ?? 0) || 'N/A'}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-8 text-gray-500">
                                            No portfolios match your current filters.
                                        </div>
                                    )
                                ) : (
                                    // Display all portfolios when no filter is applied
                                    portfolioData.length > 0 ? (
                                        portfolioData.map((item: any) => (
                                            <Link
                                                key={item.user_id || item.id}
                                                className="w-full rounded-lg shadow-md bg-white p-4 text-black transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                                                href={`/portfolio/${item.user_id}`}
                                            >
                                                <div className="flex flex-col h-full">
                                                    <div className="flex justify-end mb-2">
                                                        {item.role === 2 ?
                                                            <div
                                                                className={`h-6 flex justify-center items-center text-white text-xs rounded-xl bg-[#5086ed] px-2`}
                                                            >
                                                                <i className="fas fa-check-circle mr-2"></i>
                                                                <span>Endorser</span>
                                                            </div>
                                                            : <div
                                                                className={`h-6 flex justify-center items-center text-white text-xs rounded-xl ${item.working_status === 2 ? 'bg-[#00BD62] w-24' : 'bg-[#0277B6] w-16'}`}
                                                            >
                                                                {item.working_status === 2 ? 'Open for Work' : 'Working'}
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex flex-col items-center mt-3 space-y-3">
                                                            <Image
                                                                src={item.photo}
                                                                alt="Profile Picture"
                                                                width={100}
                                                                height={100}
                                                                className="rounded-lg aspect-square object-cover border border-gray-300"
                                                            />

                                                            <div className="w-full space-y-2 text-center">
                                                                <p className="text-base font-semibold">{item.name}</p>

                                                                <div className="text-sm text-gray-600">
                                                                    <p><span className="font-bold">Contact:</span> {convertPhoneNumberSpacing(item.phone_number || '') || 'N/A'}</p>
                                                                    {item.role === 1 && (
                                                                        <p><span className="font-bold">Major:</span> {getMajorName(item.major ?? 0) || 'N/A'}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-8 text-gray-500">
                                            No portfolios found.
                                        </div>
                                    )
                                )}
                            </div>
                            <div className="flex justify-center items-center mt-2 mb-8">
                                {!isFilterApplied && hasMorePortfolios && (
                                    <button
                                        className="bg-[#5086ed] text-white px-4 py-2 rounded-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer group disabled:opacity-50"
                                        onClick={loadMorePortfolios}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Loading...' : 'Load More'}
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {selected === 'Project' && (
                        <>
                            <div className="grid grid-cols-3 gap-8 mt-4 mb-8">
                                {isFilterApplied ? (
                                    // Display filtered projects when filter is applied
                                    filteredProjects.length > 0 ? (
                                        filteredProjects.map((item: any) => (
                                            <Link
                                                key={item.project_id}
                                                className="w-full rounded-lg shadow-md bg-white p-4 text-black transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                                                href={`project/${item.project_id}`}
                                            >
                                                <div className="flex flex-col h-full">
                                                    <div className="flex justify-end mb-2">
                                                        <div
                                                            className={`h-6 flex justify-center items-center text-white text-xs rounded-xl ${item.project_visibility_status === 1 ? 'bg-green-500' : 'bg-gray-500'} px-2`}
                                                        >
                                                            <i className={`fas ${item.project_visibility_status === 1 ? 'fa-eye' : 'fa-eye-slash'} mr-2`}></i>
                                                            <span>{getVisibilityLabel(item.project_visibility_status)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex flex-col items-center mt-3 space-y-3">
                                                            <Image
                                                                src="/api/placeholder/400/320"
                                                                alt={item.title}
                                                                width={100}
                                                                height={100}
                                                                className="rounded-lg aspect-square object-cover border border-gray-300"
                                                            />

                                                            <div className="w-full space-y-2 text-center">
                                                                <p className="text-base font-semibold">{item.title}</p>

                                                                <div className="text-sm text-gray-600">
                                                                    {item.created_at && (
                                                                        <p><span className="font-bold">Created:</span> {new Date(item.created_at).toLocaleDateString()}</p>
                                                                    )}
                                                                    {item.portfolio_id && (
                                                                        <p>
                                                                            <span className="font-bold">Owner:</span>{' '}
                                                                            {getProjectOwner(item.portfolio_id)?.name || 'Unknown'}
                                                                            {getProjectOwner(item.portfolio_id)?.role === 2 && (
                                                                                <i className="fas fa-check-circle ml-1 text-[#5086ed]"></i>
                                                                            )}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-8 text-gray-500">
                                            No projects match your current filters.
                                        </div>
                                    )
                                ) : (
                                    projectData.length > 0 ? (
                                        projectData.map((item: any) => (
                                            <Link
                                                key={item.project_id}
                                                className="w-full rounded-lg shadow-md bg-white p-4 text-black transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                                                href={`project/${item.project_id}`}
                                            >
                                                <div className="flex flex-col h-full">
                                                    <div className="flex justify-end mb-2">
                                                        <div
                                                            className={`h-6 flex justify-center items-center text-white text-xs rounded-xl ${item.project_visibility_status === 1 ? 'bg-green-500' : 'bg-gray-500'} px-2`}
                                                        >
                                                            <i className={`fas ${item.project_visibility_status === 1 ? 'fa-eye' : 'fa-eye-slash'} mr-2`}></i>
                                                            <span>{getVisibilityLabel(item.project_visibility_status)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex flex-col items-center mt-3 space-y-3">
                                                            <Image
                                                                src="/api/placeholder/400/320"
                                                                alt={item.title}
                                                                width={100}
                                                                height={100}
                                                                className="rounded-lg aspect-square object-cover border border-gray-300"
                                                            />

                                                            <div className="w-full space-y-2 text-center">
                                                                <p className="text-base font-semibold">{item.title}</p>

                                                                <div className="text-sm text-gray-600">
                                                                    {item.created_at && (
                                                                        <p><span className="font-bold">Created:</span> {new Date(item.created_at).toLocaleDateString()}</p>
                                                                    )}
                                                                    {item.portfolio_id && (
                                                                        <p>
                                                                            <span className="font-bold">Owner:</span>{' '}
                                                                            {getProjectOwner(item.portfolio_id)?.name || 'Unknown'}
                                                                            {getProjectOwner(item.portfolio_id)?.role === 2 && (
                                                                                <i className="fas fa-check-circle ml-1 text-[#5086ed]"></i>
                                                                            )}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-8 text-gray-500">
                                            No projects found.
                                        </div>
                                    )
                                )}
                            </div>
                            <div className="flex justify-center items-center mt-2 mb-8">
                                {!isFilterApplied && hasMoreProjects && (
                                    <button
                                        className="bg-[#5086ed] text-white px-4 py-2 rounded-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer group disabled:opacity-50"
                                        onClick={loadMoreProjects}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Loading...' : 'Load More'}
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
