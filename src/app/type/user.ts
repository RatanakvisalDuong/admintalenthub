export interface User {
    id: string;
    email: string;
    name: string | null;
    role_id: number;
    photo: string | null;
    google_id: string | null;
    phone_number: string | null;
}