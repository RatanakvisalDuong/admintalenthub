'use client';

import React from 'react';
import ExperienceCard from '../experienceCard/experienceCard';
import { Experience } from '@/app/type/experience';

interface Props {
    owner: boolean;
    experienceData: Experience[];
    expandedExperience: boolean;
    toggleExpandedExperience: () => void;
    toggleAddExperienceDialog: () => void;
    toggleEditExperienceDialog: (experience: Experience) => void;
    dropdownOpen: { [key: string]: boolean };
    toggleDropdown: (id: number) => void;
}

const ExperienceSection: React.FC<Props> = ({
    owner,
    experienceData,
    expandedExperience,
    toggleExpandedExperience,
    toggleAddExperienceDialog,
    toggleEditExperienceDialog,
    dropdownOpen,
    toggleDropdown
}) => {
    return (
        <div className="w-full bg-white rounded-xl p-6 mt-4 mr-3 border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <i className="fas fa-briefcase text-blue-500 mr-2"></i>
                    <p className="text-black font-bold text-lg">Experience</p>
                </div>
                {owner && (
                    <button
                        onClick={toggleAddExperienceDialog}
                        className="flex items-center bg-blue-500 font-semibold py-2 px-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white hover:scale-105 transition-all duration-300 group cursor-pointer"
                    >
                        <i className="fas fa-plus group-hover:text-white transition-colors duration-300"></i>
                    </button>
                )}
            </div>
            <div className="h-[2px] bg-gray-300 w-40 mt-2 mb-4"></div>
            {experienceData.length === 0 ? (
                <p className="text-center text-gray-400">No experience available</p>
            ) : (
                experienceData
                    .slice(0, expandedExperience ? experienceData.length : 2)
                    .map((experience, index) => (
                        <ExperienceCard
                            key={experience.id}
                            experience={experience}
                            index={index}
                            dropdownOpen={dropdownOpen}
                            toggleDropdown={toggleDropdown}
                            owner={owner}
                            openEditExperienceDialog={toggleEditExperienceDialog}
                        />
                    ))
            )}
            {experienceData.length > 2 && (
                <div className="mt-4 text-center">
                    <button
                        onClick={toggleExpandedExperience}
                        className="text-blue-500 hover:underline font-medium"
                    >
                        {expandedExperience ? 'See Less' : 'See More'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExperienceSection;
