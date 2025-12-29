import {
  FiClock,
  FiCheckCircle,
  FiFileText,
} from "react-icons/fi";

import { CheckoutStatus } from "@prisma/client";
import RecordList from "./RecordList";
import Sidebar from "@/components/layout/Sidebar";
import PageHeader from "@/components/common/PageHeader";

interface AssetType {
  name: string;
}
interface Asset {
  assetId: string;
  label: string;
  status: CheckoutStatus;
  type: AssetType;
}

interface CheckoutRecord {
  user: { name: string; email: string } | null;
  recordId: string;
  assetId: string;
  userId: string;
  quantity: number;
  checkoutDate: string;
  status: CheckoutStatus;
  asset: Asset;
}

interface HistoryItem {
  historyId: string;
  actionDate: string;
  actionType: CheckoutStatus;
  record: CheckoutRecord;
}

interface Props {
  pending: CheckoutRecord[];
  processed: CheckoutRecord[];
  history: HistoryItem[];
  searchParams: { tab?: string };
}

const sections = [
  { id: "pending", label: "Pending", icon: <FiClock size={20} /> },
  { id: "processed", label: "Processed", icon: <FiCheckCircle size={20} /> },
  { id: "history", label: "History", icon: <FiFileText size={20} /> },
];

export default function TabsNoState({
  pending,
  processed,
  history,
  searchParams,
}: Props) {
  const active = searchParams.tab || "pending";

  const records =
    active === "pending"
      ? pending
      : active === "processed"
      ? processed
      : history;

  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar
        title="Asset Records"
        items={sections}
        active={active}
      />

 
      <main className="flex-1 p-6 mt-12 lg:mt-0 pb-20 lg:pb-6 lg:ml-64">
            <PageHeader text={`${active} Records`}/>

        <RecordList
          records={records}
          isHistory={active === "history"}
        />
      </main>
    </div>
  );
}
