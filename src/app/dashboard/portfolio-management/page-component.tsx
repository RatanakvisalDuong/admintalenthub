'use client';

import { convertPhoneNumberSpacing } from '@/app/utils';
import { getMajorName } from '@/dummydata/major';
import '@fortawesome/fontawesome-free/css/all.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import SearchBar from '@/component/searchBar/searchBar';

export default function PortfolioManagementComponent({ portfolio, project }: { portfolio: any, project: any }) {
    const { data: session } = useSession();
    const [selected, setSelected] = useState('Portfolio');
    const [userTypeSelected, setUserTypeSelected] = useState('');
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [portfolioPage, setPortfolioPage] = useState(1);
    const [projectPage, setProjectPage] = useState(1);
    const [hasMorePortfolios, setHasMorePortfolios] = useState(true);
    const [hasMoreProjects, setHasMoreProjects] = useState(true);
    const [portfolioData, setPortfolioData] = useState(portfolio || []);
    const [projectData, setProjectData] = useState(project || []);
    const [portfolioSearchResults, setPortfolioSearchResults] = useState<any | null>(null);
    const [projectSearchResults, setProjectSearchResults] = useState<any | null>(null);
    const [lastSearchedPortfolioTerm, setLastSearchedPortfolioTerm] = useState<string>('');
    const [lastSearchedProjectTerm, setLastSearchedProjectTerm] = useState<string>('');
    const [isPortfolioSearchActive, setIsPortfolioSearchActive] = useState(false);
    const [isProjectSearchActive, setIsProjectSearchActive] = useState(false);

    const isFilterApplied = userTypeSelected;

    const filteredPortfolios = useMemo(() => {
        let result = Array.isArray(portfolioData) ? portfolioData : [];

        if (userTypeSelected === 'Student') {
            result = result.filter(item => item.role === 1);
        } else if (userTypeSelected === 'Endorser') {
            result = result.filter(item => item.role === 2);
        }

        return result;
    }, [portfolioData, userTypeSelected]);

    const filteredPortfolioSearchResults = useMemo(() => {
        if (!portfolioSearchResults || !Array.isArray(portfolioSearchResults)) return [];

        let results = portfolioSearchResults;

        if (userTypeSelected === 'Student') {
            results = results.filter((item: any) => item.role === 1);
        } else if (userTypeSelected === 'Endorser') {
            results = results.filter((item: any) => item.role === 2);
        }

        return results;
    }, [portfolioSearchResults, userTypeSelected]);

    const filteredProjectSearchResults = useMemo(() => {
        if (!projectSearchResults || !Array.isArray(projectSearchResults)) return [];
        let results = projectSearchResults;

        if (userTypeSelected) {
            results = results.filter((item: any) => {
                const owner = getProjectOwner(item.portfolio_id);
                if (owner) {
                    if (userTypeSelected === 'Student' && owner.role !== 1) return false;
                    if (userTypeSelected === 'Endorser' && owner.role !== 2) return false;
                }
                return true;
            });
        }

        return results;
    }, [projectSearchResults, userTypeSelected, portfolio]);

    useEffect(() => {
        if (Array.isArray(project)) {
            const projectsWithImageIndex = project.map(item => ({
                ...item,
                currentImageIndex: item.currentImageIndex || 0
            }));
            setProjectData(projectsWithImageIndex);

            // Remove the filtered projects logic from here since we're handling it in the useMemo above
            const filtered: any = projectsWithImageIndex.filter(item => {
                if (userTypeSelected && item.portfolio_id) {
                    const owner = getProjectOwner(item.portfolio_id);
                    if (owner) {
                        if (userTypeSelected === 'Student' && owner.role !== 1) return false;
                        if (userTypeSelected === 'Endorser' && owner.role !== 2) return false;
                    }
                }
                return true;
            });
            setFilteredProjects(filtered);
        }
    }, [project, userTypeSelected, portfolio]);

    const getProjectOwner = (portfolioId: any) => {
        if (!Array.isArray(portfolio)) return null;
        return portfolio.find(item => item.id === portfolioId);
    };

    const getVisibilityLabel = (status: any) => {
        return status === 1 ? 'Public' : 'Private';
    };

    const loadMorePortfolios = async () => {
        if (!hasMorePortfolios || isLoading) return;
        try {
            setIsLoading(true);
            const nextPage = portfolioPage + 1;

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}admin_view_all_portfolio`,
                {
                    params: {
                        page: nextPage,
                    },
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const newPortfolios = response.data || [];
            if (newPortfolios.length === 0) {
                setHasMorePortfolios(false);
            } else {
                setPortfolioData((prevData: any) => [...prevData, ...newPortfolios]);
                setPortfolioPage(nextPage);
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

            const response = await axios.get(
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

            const newProjects = response.data || [];

            if (newProjects.length === 0) {
                setHasMoreProjects(false);
            } else {
                const projectsWithImageIndex = newProjects.map((item: any) => ({
                    ...item,
                    currentImageIndex: 0
                }));

                setProjectData((prevData: any) => [...prevData, ...projectsWithImageIndex]);
                setProjectPage(nextPage);
            }
        } catch (error) {
            console.error("Error loading more projects:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const searchPortfolios = async (name: string) => {
        if (!name.trim()) {
            setPortfolioSearchResults(null);
            setIsPortfolioSearchActive(false);
            setLastSearchedPortfolioTerm('');
            return;
        }
        if (name === lastSearchedPortfolioTerm) {
            return;
        }
        try {
            setIsLoading(true);
            setLastSearchedPortfolioTerm(name);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}admin_search_portfolio?name=${name}`, {
                headers: {
                    Authorization: `Bearer ${session?.user.accessToken}`,
                },
            });
            if (response.data && Array.isArray(response.data)) {
                setPortfolioSearchResults(response.data);
            } else if (response.data && response.data.data) {
                setPortfolioSearchResults(response.data.data);
            }

            setIsPortfolioSearchActive(true);
        } catch (error) {
            console.error("Error searching portfolios:", error);
            setPortfolioSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const searchProjects = async (name: string) => {
        if (!name.trim()) {
            setProjectSearchResults(null);
            setIsProjectSearchActive(false);
            setLastSearchedProjectTerm('');
            return;
        }
        if (name === lastSearchedProjectTerm) {
            return;
        }
        try {
            setIsLoading(true);
            setLastSearchedProjectTerm(name);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}admin_search_project?name=${name}`, {
                headers: {
                    Authorization: `Bearer ${session?.user.accessToken}`,
                },
            });

            let searchResults = [];
            if (response.data && Array.isArray(response.data)) {
                searchResults = response.data;
            } else if (response.data && response.data.data) {
                searchResults = response.data.data;
            }

            const searchResultsWithImageIndex = searchResults.map((item: any) => ({
                ...item,
                currentImageIndex: 0
            }));

            setProjectSearchResults(searchResultsWithImageIndex);
            setIsProjectSearchActive(true);
        } catch (error) {
            console.error("Error searching projects:", error);
            setProjectSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserTypeSelection = (type: string) => {
        if (userTypeSelected === type) {
            setUserTypeSelected('');
        } else {
            setUserTypeSelected(type);
        }
    };

    const handleSearchPortfolio = (term: string) => {
        searchPortfolios(term);
    };

    const handleSearchProject = (term: string) => {
        searchProjects(term);
    };

    const clearPortfolioSearch = () => {
        setPortfolioSearchResults(null);
        setIsPortfolioSearchActive(false);
        setLastSearchedPortfolioTerm('');
    };

    const clearProjectSearch = () => {
        setProjectSearchResults(null);
        setIsProjectSearchActive(false);
        setLastSearchedProjectTerm('');
    };

    const filteredProjectsData = useMemo(() => {
        let result = Array.isArray(projectData) ? projectData : [];

        if (userTypeSelected) {
            result = result.filter(item => {
                const owner = getProjectOwner(item.portfolio_id);
                if (owner) {
                    if (userTypeSelected === 'Student' && owner.role !== 1) return false;
                    if (userTypeSelected === 'Endorser' && owner.role !== 2) return false;
                }
                return true;
            });
        }

        return result;
    }, [projectData, userTypeSelected, portfolio]);

    return (
        <div className="flex flex-col h-full p-4 md:p-8 pb-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Management</h1>
            <p className="text-lg text-gray-600">Manage and oversee all portfolios</p>
            <div className='flex flex-col lg:flex-row mt-4 gap-4'>
                <div className='w-full'>
                    <div className='w-full lg:w-full h-max bg-white shadow-md rounded-lg px-4 py-3 flex mb-4'>
                        <div
                            className={`w-full h-10 p-2 cursor-pointer rounded-sm ${selected === 'Portfolio' ? 'bg-blue-600 text-white' : 'text-black hover:bg-gray-100'} items-center flex justify-center`}
                            onClick={() => {
                                setSelected('Portfolio');
                                clearProjectSearch();
                            }}
                        >
                            Portfolio
                        </div>
                        <div
                            className={`w-full h-10 p-2 cursor-pointer rounded-sm ${selected === 'Project' ? 'bg-blue-600 text-white' : 'text-black hover:bg-gray-100'} items-center flex justify-center`}
                            onClick={() => {
                                setSelected('Project');
                                clearPortfolioSearch();
                            }}
                        >
                            Project
                        </div>
                    </div>
                    {selected === 'Portfolio' && (
                        <>
                            <div className="mb-4">
                                <SearchBar onSearch={handleSearchPortfolio} />
                            </div>
                            <div className='min-h-12 bg-white shadow-md rounded-lg mb-4 p-4'>
                                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                                    <h1 className='font-bold text-lg'>
                                        Filter by:
                                    </h1>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                        <div
                                            className={`hover:cursor-pointer p-2 rounded-sm ${userTypeSelected === 'Student' ? 'bg-blue-600 text-white' : 'text-black hover:bg-gray-100'}`}
                                            onClick={() => handleUserTypeSelection('Student')}
                                        >
                                            Student
                                        </div>
                                        <div className='hidden sm:block w-[1px] h-8 bg-gray-700'></div>
                                        <div
                                            className={`hover:cursor-pointer p-2 rounded-sm ${userTypeSelected === 'Endorser' ? 'bg-blue-600 text-white' : 'text-black hover:bg-gray-100'}`}
                                            onClick={() => handleUserTypeSelection('Endorser')}
                                        >
                                            Endorser
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-8 mb-8">
                                {isLoading && portfolioData.length === 0 ? (
                                    <div className="col-span-full text-center py-8">
                                        <p className="text-gray-500">Loading portfolios...</p>
                                    </div>
                                ) : isPortfolioSearchActive ? (
                                    filteredPortfolioSearchResults.length > 0 ? (
                                        filteredPortfolioSearchResults.map((item: any) => (
                                            <Link
                                                key={item.user_id || item.id}
                                                className="w-full rounded-lg shadow-md bg-white p-4 text-black transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                                                href={`/portfolio/${item.user_id}`}
                                            >
                                                <div className="flex flex-col h-full">
                                                    <div className="flex justify-end mb-2">
                                                        {item.role === 2 ? (
                                                            <div className="h-6 flex justify-center items-center text-white text-xs rounded-xl bg-blue-600 px-2">
                                                                <i className="fas fa-check-circle mr-2"></i>
                                                                <span>Endorser</span>
                                                            </div>
                                                        ) : (
                                                            <div className={`h-6 flex justify-center items-center text-white text-xs rounded-xl ${item.working_status === 2 ? 'bg-[#00BD62] w-24' : 'bg-[#0277B6] w-16'}`}>
                                                                {item.working_status === 2 ? 'Open for Work' : 'Working'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex flex-col items-center mt-3 space-y-3">
                                                            <Image
                                                                src={item.photo || ""}
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
                                            {userTypeSelected ?
                                                `No ${userTypeSelected.toLowerCase()} portfolios match your search for "${lastSearchedPortfolioTerm}".` :
                                                `No portfolios match your search for "${lastSearchedPortfolioTerm}".`
                                            }
                                        </div>
                                    )
                                ) : (
                                    filteredPortfolios.length > 0 ? (
                                        filteredPortfolios.map((item) => (
                                            <Link
                                                key={item.user_id || item.id}
                                                className="w-full rounded-lg shadow-md bg-white p-4 text-black transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                                                href={`/portfolio/${item.user_id}`}
                                            >
                                                <div className="flex flex-col h-full">
                                                    <div className="flex justify-end mb-2">
                                                        {item.role === 2 ? (
                                                            <div className="h-6 flex justify-center items-center text-white text-xs rounded-xl bg-blue-600 px-2">
                                                                <i className="fas fa-check-circle mr-2"></i>
                                                                <span>Endorser</span>
                                                            </div>
                                                        ) : (
                                                            <div className={`h-6 flex justify-center items-center text-white text-xs rounded-xl ${item.working_status === 2 ? 'bg-[#00BD62] w-24' : 'bg-[#0277B6] w-16'}`}>
                                                                {item.working_status === 2 ? 'Open for Work' : 'Working'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex flex-col items-center mt-3 space-y-3">
                                                            {item.photo == null || item.photo === '' ? (
                                                                <div className="w-[100px] h-[100px] rounded-lg aspect-square bg-white border border-gray-300 flex items-center justify-center">
                                                                    <i className="fas fa-user text-gray-300 text-3xl"></i>
                                                                </div>
                                                            ) : (
                                                                <Image
                                                                    src={item.photo}
                                                                    alt="Profile Picture"
                                                                    width={100}
                                                                    height={100}
                                                                    className="rounded-lg aspect-square object-cover border border-gray-300"
                                                                />
                                                            )}
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
                                            {userTypeSelected ?
                                                `No ${userTypeSelected.toLowerCase()} portfolios found.` :
                                                'No portfolios found.'
                                            }
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="flex justify-center items-center mt-2 mb-8">
                                {!isPortfolioSearchActive && !isFilterApplied && hasMorePortfolios && (
                                    <button
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:text-white hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
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
                            <div className="mb-4">
                                <SearchBar onSearch={handleSearchProject} placeHolder='Search Projects...' />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 mb-8">
                                {isLoading && projectData.length === 0 ? (
                                    <div className="col-span-full text-center py-8">
                                        <p className="text-gray-500">Loading projects...</p>
                                    </div>
                                ) : isProjectSearchActive ? (
                                    filteredProjectSearchResults.length > 0 ? (
                                        filteredProjectSearchResults.map((item: any) => (
                                            <Link
                                                key={item.project_id}
                                                className="w-full rounded-lg shadow-md bg-white p-4 text-black transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                                                href={`/project/${item.project_id}`}
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
                                                            <div className="relative w-full">
                                                                <div className="relative w-full h-[140px] overflow-hidden rounded-lg border border-gray-300">
                                                                    {item.images && item.images.length > 0 ? (
                                                                        <div className="relative w-full h-full">
                                                                            {item.images.map((image: any, index: number) => (
                                                                                <Image
                                                                                    key={index}
                                                                                    src={image.image_url || ""}
                                                                                    alt={`${item.title} - image ${index + 1}`}
                                                                                    width={400}
                                                                                    height={320}
                                                                                    className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-300`}
                                                                                    style={{
                                                                                        opacity: index === (item.currentImageIndex || 0) ? 1 : 0,
                                                                                        zIndex: index === (item.currentImageIndex || 0) ? 1 : 0
                                                                                    }}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                                            <Image
                                                                                src="/api/placeholder/400/320"
                                                                                alt={item.title || "Project image"}
                                                                                width={400}
                                                                                height={320}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    {item.images && item.images.length > 1 && (
                                                                        <>
                                                                            <button
                                                                                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-r-md hover:bg-opacity-70 transition-opacity z-10"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    e.stopPropagation();
                                                                                    const currentIndex = item.currentImageIndex || 0;
                                                                                    const newIndex = currentIndex === 0 ? item.images.length - 1 : currentIndex - 1;

                                                                                    const updatedSearchResults = projectSearchResults.map((project: any) => {
                                                                                        if (project.project_id === item.project_id) {
                                                                                            return { ...project, currentImageIndex: newIndex };
                                                                                        }
                                                                                        return project;
                                                                                    });
                                                                                    setProjectSearchResults(updatedSearchResults);
                                                                                }}
                                                                            >
                                                                                <i className="fas fa-chevron-left text-xs"></i>
                                                                            </button>
                                                                            <button
                                                                                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-l-md hover:bg-opacity-70 transition-opacity z-10"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    e.stopPropagation();
                                                                                    const currentIndex = item.currentImageIndex || 0;
                                                                                    const newIndex = (currentIndex + 1) % item.images.length;

                                                                                    const updatedSearchResults = projectSearchResults.map((project: any) => {
                                                                                        if (project.project_id === item.project_id) {
                                                                                            return { ...project, currentImageIndex: newIndex };
                                                                                        }
                                                                                        return project;
                                                                                    });
                                                                                    setProjectSearchResults(updatedSearchResults);
                                                                                }}
                                                                            >
                                                                                <i className="fas fa-chevron-right text-xs"></i>
                                                                            </button>
                                                                            <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                                                                                <div className="bg-black bg-opacity-50 rounded-full px-2 py-0.5 text-xs text-white">
                                                                                    {(item.currentImageIndex || 0) + 1}/{item.images.length}
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>

                                                                <div className="w-full space-y-2 text-center mt-3">
                                                                    <p className="text-base font-semibold">{item.title}</p>

                                                                    <div className="text-sm text-gray-600">
                                                                        {item.created_at && (
                                                                            <p><span className="font-bold">Created:</span> {new Date(item.created_at).toLocaleDateString()}</p>
                                                                        )}
                                                                        {item.portfolio_id && (
                                                                            <p>
                                                                                <span className="font-bold">Owner:</span>{' '}
                                                                                {getProjectOwner(item.portfolio_id)?.name || item.user_name || 'Unknown'}
                                                                                {getProjectOwner(item.portfolio_id)?.role === 2 && (
                                                                                    <i className="fas fa-check-circle ml-1 text-blue-600"></i>
                                                                                )}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-8 text-gray-500">
                                            {userTypeSelected ?
                                                `No projects by ${userTypeSelected.toLowerCase()} owners match your search for "${lastSearchedProjectTerm}".` :
                                                `No projects match your search for "${lastSearchedProjectTerm}".`
                                            }
                                        </div>
                                    )
                                ) : (
                                    filteredProjectsData.length > 0 ? (
                                        filteredProjectsData.map((item: any) => (
                                            <Link
                                                key={item.project_id}
                                                className="w-full rounded-lg shadow-md bg-white p-4 text-black transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                                                href={`/project/${item.project_id}`}
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
                                                            <div className="relative w-full">
                                                                {/* Image carousel */}
                                                                <div className="relative w-full h-[140px] overflow-hidden rounded-lg border border-gray-300">
                                                                    {item.images && item.images.length > 0 ? (
                                                                        <div className="relative w-full h-full">
                                                                            {item.images.map((image: any, index: number) => (
                                                                                <Image
                                                                                    key={index}
                                                                                    src={image.image_url || ""}
                                                                                    alt={`${item.title} - image ${index + 1}`}
                                                                                    width={400}
                                                                                    height={320}
                                                                                    className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-300`}
                                                                                    style={{
                                                                                        opacity: index === (item.currentImageIndex || 0) ? 1 : 0,
                                                                                        zIndex: index === (item.currentImageIndex || 0) ? 1 : 0
                                                                                    }}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                                            <Image
                                                                                src="/api/placeholder/400/320"
                                                                                alt={item.title || "Project image"}
                                                                                width={400}
                                                                                height={320}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    {item.images && item.images.length > 1 && (
                                                                        <>
                                                                            <button
                                                                                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-r-md hover:bg-opacity-70 transition-opacity z-10"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    e.stopPropagation();
                                                                                    const currentIndex = item.currentImageIndex || 0;
                                                                                    const newIndex = currentIndex === 0 ? item.images.length - 1 : currentIndex - 1;

                                                                                    // Create a new object with the updated property
                                                                                    const updatedProjectData = projectData.map((project: any) => {
                                                                                        if (project.project_id === item.project_id) {
                                                                                            return { ...project, currentImageIndex: newIndex };
                                                                                        }
                                                                                        return project;
                                                                                    });
                                                                                    setProjectData(updatedProjectData);
                                                                                }}
                                                                            >
                                                                                <i className="fas fa-chevron-left text-xs"></i>
                                                                            </button>
                                                                            <button
                                                                                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-l-md hover:bg-opacity-70 transition-opacity z-10"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    e.stopPropagation();
                                                                                    const currentIndex = item.currentImageIndex || 0;
                                                                                    const newIndex = (currentIndex + 1) % item.images.length;

                                                                                    // Create a new object with the updated property
                                                                                    const updatedProjectData = projectData.map((project: any) => {
                                                                                        if (project.project_id === item.project_id) {
                                                                                            return { ...project, currentImageIndex: newIndex };
                                                                                        }
                                                                                        return project;
                                                                                    });

                                                                                    // Update state with the new array
                                                                                    setProjectData(updatedProjectData);
                                                                                }}
                                                                            >
                                                                                <i className="fas fa-chevron-right text-xs"></i>
                                                                            </button>
                                                                            <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                                                                                <div className="bg-black bg-opacity-50 rounded-full px-2 py-0.5 text-xs text-white">
                                                                                    {(item.currentImageIndex || 0) + 1}/{item.images.length}
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>

                                                                <div className="w-full space-y-2 text-center mt-3">
                                                                    <p className="text-base font-semibold">{item.title}</p>

                                                                    <div className="text-sm text-gray-600">
                                                                        {item.created_at && (
                                                                            <p><span className="font-bold">Created:</span> {new Date(item.created_at).toLocaleDateString()}</p>
                                                                        )}
                                                                        {item.portfolio_id && (
                                                                            <p>
                                                                                <span className="font-bold">Owner:</span>{' '}
                                                                                {getProjectOwner(item.portfolio_id)?.name || item.user_name || 'Unknown'}
                                                                                {getProjectOwner(item.portfolio_id)?.role === 2 && (
                                                                                    <i className="fas fa-check-circle ml-1 text-blue-600"></i>
                                                                                )}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-8 text-gray-500">
                                            {userTypeSelected ?
                                                `No projects by ${userTypeSelected.toLowerCase()} owners found.` :
                                                'No projects found.'
                                            }
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="flex justify-center items-center mt-2 mb-8">
                                {!isProjectSearchActive && !isFilterApplied && hasMoreProjects && (
                                    <button
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:text-white hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
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