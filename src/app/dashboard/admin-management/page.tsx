import axios from "axios";
import AdminManagementComponent from "./page-component";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { redirect } from 'next/navigation';

export default async function AdminManagementPage() {

    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/');
    }
    if(session?.user.isSuperAdmin !== 1) {
        redirect('/dashboard/user-management');
    }

    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}view_all_admin`,
        {
            headers: {
                Authorization: `Bearer ${session?.user.accessToken}`,
            },
        }
    );

    const userData = response.data || [];

    return (
        <AdminManagementComponent admin={userData}/>
    );
}
