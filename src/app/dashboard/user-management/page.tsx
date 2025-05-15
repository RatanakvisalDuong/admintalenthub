import axios from "axios";
import UserManagementComponent from "./page-component";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { redirect } from 'next/navigation';
import { User } from "@/app/type/user";

export default async function UserManagementPage() {

    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/');
    }
    let amountOfUser = 1;

    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}users`,
        {
            params: { page: amountOfUser },
            headers: {
                Authorization: `Bearer ${session?.user.accessToken}`,
            },
        }
    );

    const userData: User[] = response.data || [];

    return (
        <UserManagementComponent user={userData} amount={amountOfUser} />
    );
}
