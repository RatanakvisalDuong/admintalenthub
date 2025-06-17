import React from 'react';
import Image from 'next/image';
import { Experience } from '@/app/type/experience';
import { PencilSquareIcon } from '@heroicons/react/20/solid';

type Props = {
	experience: Experience;
	index: number;
	dropdownOpen: { [key: string]: boolean };
	toggleDropdown: (id: number) => void;
	owner: boolean;
	openEditExperienceDialog: (experience: Experience) => void;
};

const ExperienceCard: React.FC<Props> = ({ experience, index, dropdownOpen, toggleDropdown, owner, openEditExperienceDialog }) => {
	return (
		<div
			className={`mt-4 text-black ml-4 flex items-start transition-all duration-300 ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'
				} p-4 rounded-xl shadow-md hover:shadow-lg hover:transform hover:scale-105 cursor-pointer`}
		>
			<div className="bg-[#5086ed] w-5 h-5 rounded-full mr-6 mt-1 animate-pulse"></div>

			<div className='w-full'>
				<div className="flex justify-between items-start font-semibold text-lg text-gray-800">
					<div className="flex w-[70%] items-center gap-4 flex-wrap">
						<p className="text-md">
							<span>{experience.work_title}</span>
							<span className="mx-[2px]">-</span>
							<span>{experience.company_name}</span>
						</p>
						{experience.endorsers && experience.endorsers.filter(endorser => endorser.status_id === 2).length > 0 && (
							<div className="relative">
								<div
									className="py-2 px-4 bg-[#C0DDEC] rounded-full flex items-center cursor-pointer"
									onClick={() => toggleDropdown(experience.id)}
								>
									<Image src="/verified.png" alt="Verified" width={20} height={20} className="mr-2" />
									<span className="text-sm text-black">Endorsed By</span>
								</div>

								{dropdownOpen[experience.id] && (
									<div className="absolute left-0 mt-2 p-2 w-64 bg-white border rounded-xl shadow-lg z-10">
										<ul>
											{experience.endorsers
												.filter((endorser) => endorser.status_id === 2) // Only show endorsers with status_id === 2
												.map((endorser, idx) => (
													<li
														key={endorser.email}
														className="py-1 px-2 text-sm text-gray-800 hover:bg-gray-100 rounded cursor-pointer"
														onClick={() => {
															window.location.href = `/portfolio/${endorser.id}`;
														}}
													>
														<div className='flex items-center'>
															<Image src={endorser.photo ||  "https://hips.hearstapps.com/hmg-prod/images/british-actor-henry-cavill-poses-on-the-red-carpet-as-he-news-photo-1581433962.jpg"} alt="Endorser" width={20} height={20} className="mr-2 rounded-full w-8 h-8" />
															<p>{endorser.name}</p>
														</div>
													</li>
												))}
										</ul>
									</div>
								)}
							</div>
						)}
					</div>
					{owner && (
						<button
							className="text-sm flex text-white hover:underline hover:brightness-110 cursor-pointer py-2 px-4 bg-[#ffc107] rounded-xl items-center justify-center transition-all duration-200"
							onClick={() => openEditExperienceDialog(experience)}
						>
							<PencilSquareIcon className="w-5 h-5 mr-2" />
							Update
						</button>
					)}
				</div>
				<p className="text-sm text-gray-600 mt-1">
					{experience.employment_type}
				</p>
				<p className="text-sm text-gray-600 mt-1">
					{experience.start_month} {experience.start_year} - {experience.end_year ? `${experience.end_month} ${experience.end_year}` : 'Present'}
				</p>
				<p className="text-sm text-gray-600 mt-1">{experience.description}</p>
				<div className="h-[2px] bg-gray-300 w-full mt-4"></div>
			</div>
		</div>
	);
};

export default ExperienceCard;
