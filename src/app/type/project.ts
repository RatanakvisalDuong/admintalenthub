import { Image } from "./image"
import { ProgrammingLanguage } from "./programming_language"

export interface Project {
    project_id: number,
    portfolio_id: number,
    title: string,
    description: string,
    instruction: string,
    link: string,
    file: string,
    images: Image[],
    programming_languages: ProgrammingLanguage[]
    project_visibility_status: number,
    created_at: string,
    updated_at: string
}