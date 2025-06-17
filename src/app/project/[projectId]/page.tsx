import ProjectPage from "./projectpage-component";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const session = await getServerSession(authOptions);
  
  // Await the params
  const { projectId } = await params;
  
  let projectData;
  
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}admin_view_project_detail/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`
        }
      }
    );
    projectData = response.data;
  } catch (error) {
    console.error("Failed to fetch project data:", error);
    projectData = null;
  }
  
  return <ProjectPage projectData={projectData} />;
}