import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import axios from 'axios';
import { authOptions } from '@/app/api/auth/[...nextauth]/option'; // Adjust path as needed
import PendingEndorserApplicationClient from './page-component';

interface EndorserApplication {
    id: number;
    name: string;
    email: string;
    contact: string;
    created_at: string;
}

interface EndorserRequestResponse {
    success: boolean;
    count: number;
    data: EndorserApplication[];
}

async function fetchEndorserApplications(accessToken: string): Promise<EndorserApplication[]> {
    try {
        const response = await axios.get<EndorserRequestResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}admin_view_all_endorser_request`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (response.data.success) {
            return response.data.data;
        } else {
            console.error('Failed to fetch applications:', response.data);
            return [];
        }
    } catch (error) {
        console.error('Error fetching endorser applications:', error);
        return [];
    }
}

export default async function PendingEndorserApplicationPage() {
    const session = await getServerSession(authOptions);

    // Redirect if not authenticated
    if (!session?.user?.accessToken) {
        redirect('/login'); // Adjust redirect path as needed
    }

    // Fetch data on the server
    const applications = await fetchEndorserApplications(session.user.accessToken);

    return (
        <PendingEndorserApplicationClient 
            initialApplications={applications}
            session={session}
        />
    );
}