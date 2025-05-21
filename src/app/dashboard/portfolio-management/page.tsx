import axios from 'axios';
import PortfolioManagementComponent from './page-component';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { redirect } from 'next/navigation';


export default async function PortfolioManagementPage() {

    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/');
    }

    const portfolioData = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}admin_view_all_portfolio`,
        {
            params: {
                page: 1,
            },
            headers: {
                Authorization: `Bearer ${session?.user.accessToken}`,
            },
        }
    );

    const projectData = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}admin_view_all_project`,
        {
            params: {
                page: 1,
            },
            headers: {
                Authorization: `Bearer ${session?.user.accessToken}`,
            },
        }
    );
    const portfolio = portfolioData.data || [];
    const project = projectData.data || [];

    return (
        <PortfolioManagementComponent portfolio={portfolio} project={project}  />
    );
}