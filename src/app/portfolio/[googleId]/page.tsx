// import axios from "axios";
// import PortfolioPageComponent from "./portfolio-page";
// import { Portfolio } from "../../../type/portfolio";
// import PageNotFound from "@/component/pagenotfound/page";
// import { Suspense } from "react";

import axios from "axios";
import PortfolioPageComponent from "./portfolio-page";
import { Portfolio } from "@/app/type/portfolio";
import PageNotFound from "@/component/pagenotfound/page";


// async function PortfolioContent({ googleId }: { googleId: string }) {
//   try {
//     const response = await axios.get(
//       `${process.env.API_URL}view_portfolio_details/${googleId}`
//     );

//     const portfolioData: Portfolio = response.data;
//     if (response.data.status === 0) {
//       return <PageNotFound />;
//     }

//     return <PortfolioPageComponent portfolio={portfolioData} />;
//   } catch (error) {
//     return <PageNotFound />;
//   }
// }

// export default async function PortfolioPage({ params }: { params: Promise<{ googleId: string }> }) {
//   const { googleId } = await params;

//   return (
//     // <Suspense fallback={<LoadingScreen message="Loading portfolio..." />}>
//     //   <PortfolioContent googleId={googleId} />
//     // </Suspense>
//   );
// }


export default async function PortfolioPage({ params }: { params: { googleId: string } }) {
  const { googleId } = params;

  try {
    const response = await axios.get(
      `${process.env.API_URL}view_portfolio_details/${googleId}`
    );

    const portfolioData: Portfolio = response.data;
    if (response.data.status === 0) {
      return <PageNotFound />;
    }

    return <PortfolioPageComponent portfolio={portfolioData} />;
  } catch (error) {
    return <PageNotFound />;
  }
}