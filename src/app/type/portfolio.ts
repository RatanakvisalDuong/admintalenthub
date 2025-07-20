import { Achievement } from "./achievement";
import { Education } from "./education";
import { Experience } from "./experience";
import { Project } from "./project";
import { Skill } from "./skill";

export interface Portfolio {
    portfolio: {
        id: number;
        google_id: string;
        major: number | null;
        phone_number: string;
        about: string;
        working_status: number;
        status: number;
        created_at: string;
        updated_at: string;
        user_name: string;
        email: string;
        role_id: number;
        photo: string;
    },
    projects: Project[];
    education: Education[];
    achievements: Achievement[];
    skills: Skill[];
    experiences: Experience[];
}
