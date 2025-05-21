import { Portfolio } from "@/app/type/portfolio";
import { useState } from "react";
import ProjectCard from "../projectCard/projectCard";

export default function ProjectsSection({ portfolio, owner, addProject }: { portfolio: Portfolio; owner: boolean, addProject: () => void }) {
    const [expandedProject, setExpandedProject] = useState(false);
    const [addProjectDialog, setAddProjectDialog] = useState(false);

    const toggleDropdownProject = () => {
        setExpandedProject(!expandedProject);
    };

    return (
        <div className={`${expandedProject ? 'h-auto' : 'h-[225px]'} bg-white rounded-xl shadow-sm p-4 relative border border-gray-200 shadow-sm mb-4`}>
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <i className="fas fa-folder text-blue-500 mr-2"></i>
                    <p className="font-bold text-lg text-black">Projects</p>
                </div>
                {owner && (
                    <button
                        className="flex items-center bg-blue-500 font-semibold py-2 px-4 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out group"
                        onClick={() => addProject()}
                    >
                        <i className="fas fa-plus group-hover:text-white transition-colors duration-300"></i>
                    </button>
                )}
            </div>

            <div className="w-25 bg-[#dfdfdf] h-[2px] mt-1"></div>

            {portfolio.projects.length > 0 ? (
                <>
                    {portfolio.projects
                        .slice(0, expandedProject ? portfolio.projects.length : 2)
                        .map((project) => (
                            <ProjectCard
                                key={project.project_id}
                                project={project}
                            />
                        ))}

                    {portfolio.projects.length > 2 && (
                        <div className={`h-10 ${portfolio.projects.length > 2 ? 'block' : 'hidden'}`}>
                            <button
                                onClick={toggleDropdownProject}
                                className="mt-4 text-blue-400 hover:underline w-full mx-auto font-semibold cursor-pointer"
                            >
                                {expandedProject ? 'See Less' : 'See More'}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p className="justify-center items-center flex text-gray-400">No projects available</p>
            )}
        </div>
    );
}