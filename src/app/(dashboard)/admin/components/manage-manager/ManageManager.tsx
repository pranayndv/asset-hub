import Link from "next/link";
import ManagerList from "./ManagerList";
import AdminCreateManager from "./CreateManagerForm";
import fetchData from "@/hooks/getFetch";
import { Session } from "next-auth";
import PageHeader from "@/components/common/PageHeader";

type TabKey = "manage" | "create";

const TAB_CONFIG: { key: TabKey; label: string }[] = [
  { key: "manage", label: "Manage Managers" },
  { key: "create", label: "Create Manager" },
];


interface Manager {
  userId: string;
  name: string;
  email: string;
  profileImage?:string | null
}

export default async function ManageManager({
  session,
  searchParams,
}: {
  session:Session | null,
  searchParams: { action?: string };
}) {
  const activeTab = (searchParams.action as TabKey) || "manage";


  const {data:managerList} = await fetchData<Manager[]>('/api/admin/manager')

  return (
    <div className="">
      <div className="flex gap-1 rounded-lg bg-gray-200 p-1 mx-auto w-fit">
        {TAB_CONFIG.map(({ key, label }) => {
          const isActive = activeTab === key;

          return (
            <Link
              key={key}
              href={`?tab=manager&action=${key}`}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition
                ${
                  isActive
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-blue-500"
                    : "text-gray-600 hover:bg-gray-300"
                }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <PageHeader text={` ${activeTab} Records`}/>


      {activeTab === "manage" ? <ManagerList managerList={managerList} /> : <AdminCreateManager session={session} />}
    </div>
  );
}
