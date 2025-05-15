import { Endorser } from "./endorser";

export interface Achievement {
    id: number,
    portfolio_id: number,
    title: string,
    issued_by: string,
    issue_month: string,
    issue_year: string,
    description: string,
    image: string,
    endorsers: Endorser[]
}