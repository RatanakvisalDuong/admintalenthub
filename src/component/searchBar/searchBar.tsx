import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

export default function SearchBar({ onSearch }: { onSearch: (term: string) => void }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (searchTerm === '') {
            onSearch('');
        }
        
        const timer = setTimeout(() => {
            if (searchTerm) {
                setIsSearching(true);
                try {
                    onSearch(searchTerm);
                } catch (error) {
                    console.error('Error searching portfolios:', error);
                } finally {
                    setIsSearching(false);
                }
            }
        }, 300);
        
        return () => clearTimeout(timer);
    }, [searchTerm, onSearch]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (searchTerm) {
            setIsSearching(true);
            try {
                onSearch(searchTerm);
            } catch (error) {
                console.error('Error searching portfolios:', error);
            } finally {
                setIsSearching(false);
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex justify-center shadow-sm border border-gray-200 rounded-xl">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search Portfolio..."
                        className="w-full h-10 rounded-lg pl-4 pr-10 text-gray-500 bg-white shadow-sm"
                        value={searchTerm}
                        onChange={handleChange}
                    />
                    <button 
                        type="submit"
                        className="absolute top-1/2 right-3 transform -translate-y-1/2"
                    >
                        <MagnifyingGlassIcon className={`w-6 h-6 text-gray-500 ${isSearching ? 'animate-pulse' : ''}`} />
                    </button>
                </div>
            </form>
        </div>
    );
}
