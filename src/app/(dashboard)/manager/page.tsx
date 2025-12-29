import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { RoleName } from "@prisma/client";
import ManagerDashboard from "./components/Manager";
import { Metadata } from "next";


export default async function Page({ searchParams }: { searchParams: { tab?: string } }) {
  const session = await getServerSession(authOptions);

  const params =await searchParams


  
  if (!session?.user) {
    return (
      <div className="p-6 text-red-600">
        Unauthorized — Please Login
      </div>
    );
  }

  const role = session.user.role as RoleName;

  return (
    <div >
      {role === RoleName.MANAGER && (
        <>
          <ManagerDashboard searchParams={params} />
        </>
      )}
    </div>
  );
}

export const metadata: Metadata = {
  title: "AssetHub - Manager",
  description: "Manage your organisation assets esaily and efficiently",
};
