import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { redirect } from 'next/navigation';
import EmploymentManagementComponent from "./page-component";
import { EmploymentData } from "@/app/type/employmentData";


export default async function EmploymentManagementPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/');
    }

    const getEmploymentData= await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}admin_view_employment_rate`,
        {
            headers: {
                Authorization: `Bearer ${session?.user.accessToken}`,
            },
        }
    )

    const getTopTenJobTitles = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}admin_view_top_10_job_title`,
        {
            headers: {
                Authorization: `Bearer ${session?.user.accessToken}`,
            },
        }
    )

    const getTopTenCompanies = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}admin_view_top_10_companies`,
        {
            headers: {
                Authorization: `Bearer ${session?.user.accessToken}`,
            },
        }
    )

    const employmentData : EmploymentData[] = getEmploymentData.data;
    const jobTitles = getTopTenJobTitles.data;
    const companies = getTopTenCompanies.data;
    return (
        <EmploymentManagementComponent employmentData={employmentData} jobTitles={jobTitles} companies={companies}/>  
    );
}