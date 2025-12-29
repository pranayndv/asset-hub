import fetchData from "@/hooks/getFetch";
import TabsContent from "./TabsContent";
import { AssetStatus, CheckoutStatus } from "@prisma/client";



interface AssetType {
  name: string;
}

interface Asset {
  assetId: string;
  label: string;
  status: AssetStatus;
  type: AssetType;
}

interface CheckoutRecord {
  user: {
    name:string;
    email:string;
  };
  recordId: string;
  assetId: string;
  userId: string;
    quantity:number
  checkoutDate: string;
  status: CheckoutStatus;
  asset: Asset;
  
}

interface HistoryItem {
  historyId: string;
  actionDate: string;
    quantity:number
  actionType: CheckoutStatus;
  record: CheckoutRecord;
}


export default async function ManagerDashboard({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {

const { data: pendingData } = await fetchData<CheckoutRecord[]>("/api/checkout?status=PENDING&status=RETURN_REQUESTED");
const { data: processedData } = await fetchData<CheckoutRecord[]>("/api/checkout?status=APPROVED&status=REJECTED&status=CLOSED");
const { data: historyData } = await fetchData<HistoryItem[]>("/api/checkout/history");


return (
  <TabsContent
    pending={pendingData ?? []}
    processed={processedData ?? []}
    history={historyData ?? []}
    searchParams={searchParams}
  />
);
}
