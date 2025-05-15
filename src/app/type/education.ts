export interface Education {
    id: number,
    portfolio_id: number,
    education_center: string,
    field_of_study: string,
    description: string,
    start_year: string,
    end_year: string | null,
    start_month: string,
    end_month: string | null,
}