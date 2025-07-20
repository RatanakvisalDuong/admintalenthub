"use client"

import { Achievement } from "@/app/type/achievement";
import { Portfolio } from "@/app/type/portfolio";
import EducationCard from "@/component/educationCard/educationCard";
import SkillCard from "@/component/skillCard/skillCard";
import { getMajorName } from "@/dummydata/major";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useState } from 'react';
import CertificateDialog from "@/component/achievementDialog/achievementDialog";
import { convertPhoneNumberSpacing } from "@/app/utils/index";
import ExperienceSection from "@/component/experienceSection/experienceSection";
import ProfileSummarySection from "@/component/profileSection/profileSection";
import ProjectsSection from "@/component/projectSection/projectSection";
import AchievementsSection from "@/component/achievementSection/achievementSection";
import AppBar from "@/component/appbar/appbar";




export default function PortfolioPageComponent({ portfolio }: { portfolio: Portfolio }) {
    const [expandedExperience, setExpandedExperience] = useState(false);
    const [expandedSkill, setExpandedSkill] = useState(false);
    const [expandedEducation, setExpandedEducation] = useState(false);
    const [dropdownExperienceOpen, setDropdownExperienceOpen] = useState<{ [key: number]: boolean }>({});
    const [dropdownSkillOpen, setDropdownSkillOpen] = useState<{ [key: number]: boolean }>({});
    const [openAchivementDialog, setOpenAchivementDialog] = useState(false);
    const [singleAchievementData, setSingleAchievementData] = useState<Achievement | null>(null);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const toggleExperienceDropdown = (experienceId: number) => {
        setDropdownExperienceOpen(prev => ({
            ...prev,
            [experienceId]: !prev[experienceId]
        }));
    };

    const toggleDropdownSkill = (skillId: number) => {
        setDropdownSkillOpen(prev => ({
            ...prev,
            [skillId]: !prev[skillId]
        }));
    };

    const toggleExpandedExperience = () => {
        setExpandedExperience(!expandedExperience);
    };

    const toggleExpandedSkill = () => {
        setExpandedSkill(!expandedSkill);
    }

    const toggleExpandedEducation = () => {
        setExpandedEducation(!expandedEducation);
    }

    const toggleSharePortfolio = () => {
            displaySuccessMessage("Portfolio link copied to clipboard!");
            console.log('ID:', portfolio.portfolio.google_id);
            if (typeof navigator !== "undefined" && navigator.clipboard) {
                navigator.clipboard.writeText(`https://talenthub.paragoniu.app/portfolio/${portfolio.portfolio.google_id}`);
            } else {
                displaySuccessMessage("Clipboard API not available.");
            }
        }

    const displaySuccessMessage = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(""), 4000);
    };

    const handleOpenAchivementDialog = (achievement: Achievement) => {
        setSingleAchievementData(achievement);
        setOpenAchivementDialog(!openAchivementDialog);
    };

    return (
        <div className="bg-[#E8E8E8] w-screen h-screen fixed">
            <AppBar />
            <div className={`max-w-8xl mx-auto sm:px-6 lg:px-8 py-20 flex justify-between ${openAchivementDialog ? 'blur-sm' : ''} `}>
                {successMessage && (
                    <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-xl shadow-md z-50 mt-18">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {successMessage}
                        </div>
                    </div>
                )}
                <div className="flex justify-between w-full">
                    <div className="max-h-[87vh] w-[30%] flex flex-col justify-between overflow-y-auto">
                        <ProjectsSection portfolio={portfolio} owner={false} addProject={() => { }} />
                        <AchievementsSection
                            portfolio={portfolio}
                            owner={false}
                            handleOpenAchievementDialog={handleOpenAchivementDialog}
                            addAchievementDialog={() => { }}
                        />
                    </div>
                    <div className="h-[87vh] w-[69%] overflow-y-auto pr-6 overflow-x-hidden">
                        <ProfileSummarySection
                            owner={false}
                            portfolio={portfolio}
                            getMajorName={getMajorName(portfolio.portfolio.major)}
                            convertPhoneNumberSpacing={convertPhoneNumberSpacing}
                            toggleSharePortfolio={toggleSharePortfolio}
                            toggleEditPortfolioDialog={() => { }}
                        />

                        <ExperienceSection
                            owner={false}
                            experienceData={portfolio.experiences}
                            expandedExperience={expandedExperience}
                            toggleExpandedExperience={toggleExpandedExperience}
                            toggleAddExperienceDialog={() => { }}
                            toggleEditExperienceDialog={() => { }}
                            dropdownOpen={dropdownExperienceOpen}
                            toggleDropdown={toggleExperienceDropdown}
                        />

                        <div className={`w-full ${expandedSkill ? 'h-auto' : 'h-max'} bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-4 mr-3`}>
                            <div className="flex items-center">
                                <i className="fas fa-cogs text-blue-500 mr-2"></i>
                                <p className="text-black font-bold text-lg">Skill</p>
                            </div>
                            <div className="h-[2px] bg-gray-300 w-40 mt-2 mb-2"></div>

                            {portfolio.skills.length === 0 ? (
                                <p className="justify-center items-center flex text-gray-400">No skill available</p>
                            ) : (
                                portfolio.skills.slice(0, expandedSkill ? portfolio.skills.length : 2).map((skill, index) => (
                                    <SkillCard
                                        key={`skill-${skill.id || index}`}
                                        skill={skill}
                                        index={index}
                                        dropdownOpen={dropdownSkillOpen}
                                        toggleDropdown={toggleDropdownSkill}
                                        owner={false}
                                        openEditSkillDialog={() => { }}
                                    />
                                ))
                            )}
                            <div className={`h-40px ${portfolio.skills.length > 2 ? 'block' : 'hidden'}`}>
                                <button
                                    onClick={toggleExpandedSkill}
                                    className="mt-4 text-blue-400 hover:underline w-full mx-auto font-semibold cursor-pointer"
                                >
                                    {expandedSkill ? 'See Less' : 'See More'}
                                </button>
                            </div>
                        </div>
                        <div className={`w-full ${expandedEducation ? 'h-auto' : 'h-max'} bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-4 mr-3`}>
                            <div className="flex items-center">
                                <i className="fas fa-graduation-cap text-blue-500 mr-2"></i>
                                <p className="text-black font-bold text-lg">Education</p>
                            </div>
                            <div className="h-[2px] bg-gray-300 w-40 mt-2 mb-2"></div>

                            {portfolio.education.length === 0 ? (
                                <p className="justify-center items-center flex text-gray-400">No education available</p>
                            ) : (
                                portfolio.education.slice(0, expandedEducation ? portfolio.education.length : 2).map((education, index) => (
                                    <EducationCard
                                        key={education.id}
                                        education={education}
                                        index={index}
                                        owner={false}
                                        openEditSkillDialog={() => { }}
                                    />
                                ))
                            )}
                            <div className={`h-40px ${portfolio.education.length > 2 ? 'block' : 'hidden'}`}>
                                <button
                                    onClick={toggleExpandedEducation}
                                    className="mt-4 text-blue-400 hover:underline w-full mx-auto font-semibold cursor-pointer"
                                >
                                    {expandedEducation ? 'See Less' : 'See More'}
                                </button>
                            </div>
                        </div>
                        <div className="h-[20px]">

                        </div>
                    </div>
                </div>
            </div>

            {openAchivementDialog && (
                <CertificateDialog
                    owner={true}
                    achievement={singleAchievementData}
                    onClose={() => handleOpenAchivementDialog(singleAchievementData!)}
                    onEdit={() => { }}
                    ableToUpdate={false}
                />
            )}
        </div>
    );
}
