import {
  FiHome,
  FiFileText,
  FiUsers,
  FiPlusCircle,
  FiPenTool,
  FiUser,
} from "react-icons/fi";



import AssetForms from "./manage-assets/TypeAndAssetForm";
import ManageAssets from "./manage-assets/ManageAssets";
import CheckLogs from "./LogsTable";
import ManageManager from "./manage-manager/ManageManager";
import Analytics from "./Analytics";
import EmployeeTransfer from "../../components/EmployeeTransfer";

import { DashboardAnalyticsData } from "@/lib/types/analytics";
import fetchData from "@/hooks/getFetch";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import Sidebar from "@/components/layout/Sidebar";

interface AssetType {
  typeId: string;
  name: string;
  description?: string;
}

interface Props {
  assetTypes: AssetType[];
  searchParams: { tab?: string; action?: string, managerId?: string; employeeId?: string; };
}

const sections = [
  { id: "dashboard", label: "Dashboard", icon: <FiHome size={20} /> },
  { id: "add", label: "Add", icon: <FiPlusCircle size={20} /> },
  { id: "manage", label: "Manage", icon: <FiPenTool size={20} /> },
  { id: "checklog", label: "Logs", icon: <FiFileText size={20} /> },
  { id: "manager", label: "Managers", icon: <FiUsers size={20} /> },
  { id: "transfer", label: "Transfer", icon: <FiUser size={20} /> },
];

export default async function DashboardServerTabs({
  assetTypes,
  searchParams,
}: Props) {
  const active = searchParams.tab || "dashboard";

  const session: Session | null = await getServerSession(authOptions);
  const { data: analytics } =
    await fetchData<DashboardAnalyticsData>("/api/admin/analytics");

  const renderContent = () => {
    switch (active) {
      case "dashboard":
        return <Analytics analytics={analytics} />;
      case "add":
        return <AssetForms assetTypes={assetTypes} />;
      case "manage":
        return <ManageAssets assetTypes={assetTypes} />;
      case "checklog":
        return <CheckLogs  searchParams={searchParams}/>;
      case "manager":
        return (
          <ManageManager session={session} searchParams={searchParams} />
        );
      case "transfer":
        return <EmployeeTransfer session={session} />;
      default:
        return <p>Select a section</p>;
    }
  };

  return (
    <div className="flex">
      <Sidebar
        title="Admin Menu"
        items={sections}
        active={active}
      />
      <main className="flex-1 md:p-6 mx-3 mt-12 lg:mt-0 pb-20 lg:pb-6 lg:ml-64">
        {renderContent()}
      </main>
    </div>
  );
}
