import { CheckoutStatus } from "@prisma/client";
import { checkoutCancel, checkoutReturn, returnCancel } from "@/actions/checkoutActions";
import Button from "@/components/ui/Button";

interface AssetType { name: string }
interface Asset { assetId: string; label: string; status: CheckoutStatus; type: AssetType }

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

type RecordItem = CheckoutRecord | HistoryItem;

interface RecordListProps {
  records: RecordItem[];
  isHistory: boolean;
}

export default function RecordList({ records, isHistory }: RecordListProps) {
  if (records.length === 0) {
    return <p className="text-gray-500">No records available.</p>;
  }

  return (
    <ul className="space-y-3">
      {records.map((item) => {
        const h = item as HistoryItem;
        const record = isHistory ? h.record : (item as CheckoutRecord);

        const status = isHistory ? h.actionType : record.status;

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
                  status === "APPROVED"
                    ? "bg-green-100 text-green-700"
                    : status === "REJECTED"
                    ? "bg-red-100 text-red-700"
                    : status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : status === "RETURN_REQUESTED"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }
              `}
            >
              {status}
            </span>

        
            <div className="space-y-2 pr-14">
              <h3 className="text-lg font-semibold text-gray-800">
                {record.asset.label}
              </h3>

              <div className="text-sm text-gray-600 space-y-1">
                {record.user && (
                  <p>
                    <span className="font-medium text-gray-700">
                      Requested By:
                    </span>{" "}
                    {record.user.name}
                  </p>
                )}

                <p>
                  <span className="font-medium text-gray-700">Type:</span>{" "}
                  {record.asset.type?.name ?? "Unknown"}
                </p>

                

                <p>
                  <span className="font-medium text-gray-700">Quantity:</span>{" "}
                  {record.quantity}
                </p>

                <p>
                  <span className="font-medium text-gray-700">
                    {isHistory ? "Action Date:" : "Requested On:"}
                  </span>{" "}
                  {new Date(
                    isHistory ? h.actionDate : record.checkoutDate
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

          
             <div className="flex flex-col md:absolute bottom-3 right-2  md:flex-row justify-center gap-3 min-w-[120px]">
              {record.status === CheckoutStatus.PENDING && (
                
                <Button idleLabel="CANCEL" pendingLabel="CANCELING" color="red" action={async () =>{
                        "use server";
                          return await checkoutCancel(record.recordId);
                        }}/>
              )}

              {!isHistory && record.status === CheckoutStatus.APPROVED && (
                <Button idleLabel="RETURN" pendingLabel="REQUESTING" color="blue" action={async () =>{
                        "use server";
                          return await checkoutReturn(record.recordId);
                        }}/>
              )}
              
          
              {!isHistory && record.status === CheckoutStatus.RETURN_REQUESTED && (
                <Button idleLabel="RETURN CANCEL" pendingLabel="CANCELING" color="orange" action={async () =>{
                        "use server";
                          return await returnCancel(record.recordId);
                        }}/>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
