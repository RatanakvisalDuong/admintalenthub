import { Endorser } from "./endorser";

export interface Experience {
    id: number;
    portfolio_id: number;
    company_name: string;
    work_title: string;
    employment_type: string;
    description: string;
    start_month: string;
    start_year: string;
    end_month: string | null;
    end_year: string | null;
    endorsers: Endorser[];
}