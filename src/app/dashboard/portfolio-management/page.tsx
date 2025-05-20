import axios from 'axios';
import PortfolioManagementComponent from './page-component';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { redirect } from 'next/navigation';
import { Portfolio } from '@/app/type/portfolio';


export default async function PortfolioManagementPage() {

    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/');
    }

    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}admin_view_all_portfolio_and_project`,
        {
            params: {
                page: 1,
            },
            headers: {
                Authorization: `Bearer ${session?.user.accessToken}`,
            },
        }
    );
    const portfolio = response.data.portfolio || [];
    const project = response.data.project || [];

    console.log(portfolio);
    console.log(project);

    return (
        <PortfolioManagementComponent portfolio={portfolio} project={project} />
    );
}