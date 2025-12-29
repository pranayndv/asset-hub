import fetchData from "@/hooks/getFetch";
import TabsContent from "./TabsContent";
import { CheckoutStatus } from "@prisma/client";




interface AssetType { name: string; }
interface Asset { assetId: string; label: string; status: CheckoutStatus; type: AssetType; }

interface CheckoutRecord {
  user: { name: string; email: string } | null;
  recordId: string;
  assetId: string;
  userId: string;
    quantity:number;
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

export default async function EmployeeDashboard({
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
