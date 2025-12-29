import {
  FiHome,
  FiClock,
  FiCheckCircle,
  FiFileText,
  FiUsers,
  FiUser,
} from "react-icons/fi";


import { CheckoutStatus, AssetStatus } from "@prisma/client";
import ManageEmployee from "./manage-employee/ManageEmplyee";
import ManagerStats from "./manage-employee/Analytics";
import EmployeeTransfer from "../../components/EmployeeTransfer";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import Button from "@/components/ui/Button";
import { checkoutApprove, checkoutClose, checkoutReject, returnCancel } from "@/actions/checkoutActions";
import Sidebar from "@/components/layout/Sidebar";
import PageHeader from "@/components/common/PageHeader";

interface AssetType { name: string }
interface Asset { assetId: string; label: string; status: AssetStatus; type: AssetType }
interface CheckoutRecord {
  user: { name: string; email: string } | null
  recordId: string
  assetId: string
  userId: string
  checkoutDate: string
  status: CheckoutStatus
  quantity:number
  asset: Asset
}
interface HistoryItem {
  historyId: string
  actionDate: string
    quantity:number
  actionType: CheckoutStatus
  record: CheckoutRecord
  user?: { name: string }
}

interface Props {
  pending: CheckoutRecord[]
  processed: CheckoutRecord[]
  history: HistoryItem[]
  searchParams: { tab?: string ,action?:string}
}

export default async function ManagerDashboard({
  pending,
  processed,
  history,
  searchParams,
}: Props) {
  const active = searchParams.tab || "dashboard";
  const session: Session | null = await getServerSession(authOptions);
  const getRecords = () => {
    switch (active) {
      case "pendings": return pending;
      case "processed": return processed;
      case "history": return history;
      default: return [];
    }
  };

  const records = getRecords();
  const isHistory = active === "history";

  const renderContent = () => {
    switch (active) {
      case "dashboard": return <ManagerStats />;
      case "employees": return <ManageEmployee session={session} searchParams={searchParams} />;
      case "transfer":  return <EmployeeTransfer session={session} />;
      case "pendings":
      case "processed":
      case "history":
        return (
          <>

            <PageHeader text={`${active} Records`}/>
            {!records.length && (
              <p className="text-gray-500">No records in {active}</p>
            )}

            <ul className="space-y-3">
              {records.map((item) => {
                const h = item as HistoryItem;
                const record = isHistory ? h.record : (item as CheckoutRecord);

                return (
                 <li
  key={isHistory ? h.historyId : record.recordId}
  className="
    relative
    bg-white border border-gray-200 rounded-xl shadow-sm
    hover:shadow-md transition-shadow duration-200
    p-5 flex flex-col md:flex-row justify-between gap-4
  "
>
 
  <span
    className={`
      absolute top-3 right-3
      px-3 py-1 text-xs rounded-full font-semibold
      ${
        (isHistory ? h.actionType : record.status) === "APPROVED"
          ? "bg-green-100 text-green-700"
          : (isHistory ? h.actionType : record.status) === "REJECTED"
          ? "bg-red-100 text-red-700"
          : (isHistory ? h.actionType : record.status) === "PENDING"
          ? "bg-yellow-100 text-yellow-700"
          : (isHistory ? h.actionType : record.status) === "RETURN_REQUESTED" ?  "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-700"
      }
    `}
  >
    {isHistory ? h.actionType : record.status}
  </span>

 
  <div className="space-y-2 pr-14">
    <h3 className="text-lg font-semibold text-gray-800">
      {record.asset.label}
    </h3>

    <div className="text-sm text-gray-600 space-y-1">
      <p>
        <span className="font-medium text-gray-700">Requested By:</span>{" "}
        {record.user?.name ?? h.user?.name ?? "Unknown User"}
      </p>

      <p>
        <span className="font-medium text-gray-700">Type:</span>{" "}
        {record.asset.type?.name ?? "Unknown"}
      </p>

      <p>
        <span className="font-medium text-gray-700">Quantity:</span>{" "}
        {record.quantity ?? "Unknown"}
      </p>

      <p>
        <span className="font-medium text-gray-700">Requested On:</span>{" "}
        {new Date(record.checkoutDate).toLocaleDateString()}
      </p>

      {isHistory && (
        <p>
          <span className="font-medium text-gray-700">Action Date:</span>{" "}
          {new Date(h.actionDate).toLocaleDateString()}
        </p>
      )}
    </div>
  </div>

 
  <div className="flex flex-col md:absolute bottom-3 right-2  md:flex-row justify-center gap-3 min-w-[120px]">
    {active === "pendings" &&
      record.status !== "RETURN_REQUESTED" && (
      <div className="space-x-2">
      <Button idleLabel="APPROVE" pendingLabel="APPROVING" color="green" action={async () =>{
        "use server";
          return await checkoutApprove(record.recordId);
        }}/>


      <Button idleLabel="REJECT" pendingLabel="REJECTING" color="red" action={async () =>{
      "use server";
        return await checkoutReject(record.recordId);
      }}/>
      </div>
    )}

    {active === "pendings" &&
      record.status === "RETURN_REQUESTED" && (
        <>
        <Button idleLabel="RETURN APPROVE" pendingLabel="APPROVING" color="blue" action={async () =>{
          "use server";
          return await checkoutClose(record.recordId);
        }} />
        <Button idleLabel="CANCEL" pendingLabel="CANCELLING" color="red" action={async () =>{
          "use server";
          return await returnCancel(record.recordId);
        }} />

          </>

      )}
  </div>
</li>
                );
              })}
            </ul>
          </>
        );

      default:
        return <p>Select a section</p>;
    }
  };

  const sections = [
    { id: "dashboard", icon: <FiHome size={20} />, label: "Dashboard" },
    { id: "pendings", icon: <FiClock size={20} />, label: "Pendings" },
    { id: "processed", icon: <FiCheckCircle size={20} />, label: "Processed" },
    { id: "history", icon: <FiFileText size={20} />, label: "History" },
    { id: "employees", icon: <FiUsers size={20} />, label: "Employees" },
    { id: "transfer", icon: <FiUser size={20} />, label: "Transfer" },
  ];

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