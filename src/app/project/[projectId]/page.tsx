import ProjectPage from "./projectpage-component";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import PageNotFound from "@/components/pagenotfound/page";
import { Suspense } from "react";
import LoadingScreen from "@/components/loadingScreen/loadingScreen";

// Separate component to handle the async data fetching
async function ProjectContent({ projectId }: { projectId: string }) {
  const session = await getServerSession(authOptions);
  let projectData;
  
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}view_project_detail/${projectId}`
    );
    projectData = response.data;
    console.log("Project Data:", projectData);
    
    if (response.data.user_status === 0) {
      return <PageNotFound />;
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      try {
        const retryResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}view_project_detail/${projectId}`,
          {
            'token': session?.accessToken,
          }
        );
        projectData = retryResponse.data;
      } catch (retryError) {
        return <PageNotFound />;
      }
    } else {
      return <PageNotFound />;
    }
  }
  
  return <ProjectPage projectData={projectData} />;
}

export default async function ProjectPageContainer({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  
  return (
    <Suspense fallback={<LoadingScreen message="Loading project details..." />}>
      <ProjectContent projectId={projectId} />
    </Suspense>
  );
}