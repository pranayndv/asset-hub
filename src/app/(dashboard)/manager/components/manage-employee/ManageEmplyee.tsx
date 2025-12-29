import Link from "next/link";
import EmployeeList from "./EmployeeList";
import ManagerCreateEmployeeForm from "./CreateEmployeeForm";
import fetchData from "@/hooks/getFetch";
import { Session } from "next-auth";
import PageHeader from "@/components/common/PageHeader";

type TabKey = "manage" | "create";

const TAB_CONFIG: { key: TabKey; label: string }[] = [
  { key: "manage", label: "Manage Employee" },
  { key: "create", label: "Create Employee" },
];

interface Employee {
  userId: string;
  name: string;
  email: string;
  profileImage?:string | null
}

export default async function ManageEmployee({ session , searchParams }: {session:Session | null, searchParams: {action?: string } }) {
  const activeTab = (searchParams.action as TabKey) || "manage";


  const {data:employees} = await fetchData<Employee[]>("/api/user/get-employee");

  return (
    <div className="">
    
      <div className="flex gap-1 rounded-lg bg-gray-200 p-1 w-fit mx-auto">
        {TAB_CONFIG.map(({ key, label }) => {
          const isActive = activeTab === key;

          return (
            <Link
              key={key}
              href={`?tab=employees&action=${key}`}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition
                ${isActive
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-blue-500"
                  : "text-gray-600 hover:bg-gray-300"
                }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      <PageHeader text={` ${activeTab} Records`}/>


      {activeTab === "manage" ? <EmployeeList employees={employees} /> : <ManagerCreateEmployeeForm session={session} />}
    </div>
  );
}
