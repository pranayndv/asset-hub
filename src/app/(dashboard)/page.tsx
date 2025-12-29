import { getServerSession } from "next-auth";
import { RoleName } from "@prisma/client";
import ManagerDashboard from "./manager/components/Manager";
import { authOptions } from "@/lib/auth/auth";

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
