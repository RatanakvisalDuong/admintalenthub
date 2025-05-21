import React from 'react';
import Image from 'next/image';
import { Education } from '@/app/type/education';
import { PencilSquareIcon } from '@heroicons/react/20/solid';

type Props = {
    education: Education;
    index: number;
    owner: boolean
    openEditSkillDialog: (education: Education) => void;
};

const EducationCard: React.FC<Props> = ({ education, index, owner, openEditSkillDialog }) => {
    return (
        <div
            className={`mt-4 text-black ml-4 flex items-start transition-all duration-300 ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'
                } p-4 rounded-lg shadow-md hover:shadow-lg hover:transform hover:scale-105 cursor-pointer`}
        >
            <div className="bg-[#5086ed] w-5 h-5 rounded-full mr-6 mt-1 animate-pulse"></div>

            <div className='w-full'>
                <div className="flex justify-between items-start font-semibold text-lg text-gray-800">
                    <div className="flex w-[70%] items-center gap-4 flex-wrap">

                        <p className="text-md">
                            <span>{education.education_center}</span>
                            <span className="mx-[2px]">-</span>
                            <span>{education.field_of_study}</span>
                        </p>
                    </div>

                    {owner && (
                        <button
                            className="text-sm flex text-white hover:underline hover:brightness-110 cursor-pointer py-2 px-4 bg-[#ffc107] rounded-xl items-center justify-center transition-all duration-200"
                            onClick={() => openEditSkillDialog(education)}
                        >
                            <PencilSquareIcon className="w-5 h-5 mr-2" />
                            Update
                        </button>
                    )}
                </div>
                <p className='text-sm text-gray-500'>
                    {education.start_month} {education.start_year} - {education.end_month == null ? 'Present' : `${education.end_month} ${education.end_year}`}
                </p>

                <p className='text-black text-sm mt-2'>
                    {education.description}
                </p>
                <div className="h-[2px] bg-gray-300 w-full mt-4"></div>
            </div>
        </div>
    );
};

export default EducationCard;
