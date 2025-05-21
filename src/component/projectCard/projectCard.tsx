import { Project } from "@/app/type/project";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ProjectCard({ project }: { project: Project }) {
    return (
        <Link
            key={project.project_id}
            className="mt-4 px-4 py-3 bg-white w-full rounded-lg shadow-md text-black cursor-pointer text-sm flex items-center justify-between 
                hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white hover:scale-105 
                transition-all duration-300 ease-in-out group"
            href={`/project/${project.project_id}`}
        >
            <div className="flex items-center mr-2 w-[85%] overflow-hidden text-ellipsis whitespace-nowrap">
                <div className="bg-blue-500 w-2 h-2 rounded-full animate-pulse group-hover:bg-white"></div>
                <div className="ml-3 font-medium">
                    <p className="truncate">{project.title}</p>
                </div>
            </div>
            
            <ArrowRight size={16} className="text-blue-600 group-hover:text-white transition-colors duration-300" />
        </Link>
    );
}