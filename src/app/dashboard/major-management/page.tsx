import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import axios from 'axios';
import { authOptions } from '@/app/api/auth/[...nextauth]/option';
import MajorManagementClient from './page-component';

interface Major {
    id: number;
    name: string; // Backend returns 'name' field
    created_at?: string;
    updated_at?: string;
}

async function fetchMajors(): Promise<Major[]> {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}view_all_majors`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Server fetch response:', response.data);

        // Handle direct array response from your production API
        if (Array.isArray(response.data)) {
            return response.data;
        } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
            // Fallback for wrapped response format
            return response.data.data;
        } else {
            console.error('Unexpected response format:', response.data);
            return [];
        }
    } catch (error) {
        console.error('Error fetching majors on server:', error);
        return [];
    }
}

export const metadata = {
    title: 'Major Management | TalentHub Admin',
    description: 'Manage academic majors and fields of study',
};

export default async function MajorManagementPage() {
    const session = await getServerSession(authOptions);

    // Redirect if not authenticated
    if (!session?.user?.accessToken) {
        redirect('/login');
    }

    // Check if user is super admin
    if (session?.user?.isSuperAdmin !== 1) {
        redirect('/dashboard'); // Redirect to main dashboard if not super admin
    }

    // Fetch data on the server (no token needed for view_all_majors)
    const majors = await fetchMajors();

    return (
        <MajorManagementClient 
            initialMajors={majors}
            session={session}
        />
    );
}