import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/option";
import PortfolioPageComponent from "./portfolio-page";
import { Portfolio } from "@/app/type/portfolio";
import PageNotFound from "@/component/pagenotfound/page";
import { redirect } from 'next/navigation';

async function PortfolioContent({ userId }: { userId: string }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/');
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}admin_view_portfolio_detail/${userId}`,
      {
        headers: { Authorization: `Bearer ${session?.user.accessToken}` },
      },
    )

    const portfolioData: Portfolio = response.data;

    return <PortfolioPageComponent portfolio={portfolioData} />;
  } catch (error) {
    return <PageNotFound />;
  }
}

export default async function PortfolioPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  return (
    <PortfolioContent userId={userId} />
  );
}