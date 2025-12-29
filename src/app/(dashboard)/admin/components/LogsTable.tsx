import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import fetchData from "@/hooks/getFetch";
import PageHeader from "@/components/common/PageHeader";
import FiltersClient from "./FilterClient";


interface UserOption {
  userId: string;
  name: string;
}

interface LogRecord {
  historyId: string;
  actionDate: string;
  actionType: string;
  record: {
    asset: { label: string };
  };
  user: UserOption;
  actionBy: UserOption;
}

interface PageProps {
  searchParams: {
    managerId?: string;
    employeeId?: string;
  };
}

export default async function CheckLogs({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  const managerId =
    role === "MANAGER" ? session?.user.id : searchParams.managerId ?? "";
  const employeeId = searchParams.employeeId ?? "";



  const managers =
    role === "ADMIN"
      ? (await fetchData<UserOption[]>("/api/admin/manager")).data ?? []
      : [];

  const employees =
    managerId
      ? (await fetchData<UserOption[]>(
          `/api/admin/get-employee?managerId=${managerId}`
        )).data ?? []
      : [];

  const params = new URLSearchParams();
  if (managerId) params.append("managerId", managerId);
  if (employeeId) params.append("employeeId", employeeId);

  const logs =
    (await fetchData<LogRecord[]>(
      `/api/admin/check-logs?${params.toString()}`
    )).data ?? [];



  return (
    <div className="p-4 sm:p-6 max-w-full mx-auto">
      <PageHeader text="Check Logs" />


      <FiltersClient
        role={role}
        managers={managers}
        employees={employees}
        selectedManager={managerId}
        selectedEmployee={employeeId}
      />

{/* DESKTOP TABLE */}
<div className="hidden sm:block overflow-hidden rounded-2xl border border-gray-400 shadow">
  <table className="w-full text-sm">
    <thead className="bg-gray-100 border-b border-gray-400 text-gray-700">
      <tr>
        <th className="p-4 text-left">Asset</th>
        <th className="p-4 text-left">Action</th>
        <th className="p-4 text-left">Employee</th>
        <th className="p-4 text-left">Manager</th>
        <th className="p-4 text-left">Date</th>
      </tr>
    </thead>

    <tbody>
      {logs.length ? (
        logs.map((log) => (
          <tr
            key={log.historyId}
            className=" hover:bg-gray-50 transition"
          >
            <td className="p-4">{log.record.asset.label}</td>

            <td className="p-4">
              <span
                className={`
                  px-3 py-1 text-xs rounded-full font-semibold
                  ${
                    log.actionType === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : log.actionType === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : log.actionType === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : log.actionType === "CLOSED"
                      ? "bg-gray-200 text-gray-700"
                      : "bg-blue-100 text-blue-700"
                  }
                `}
              >
                {log.actionType}
              </span>
            </td>

            <td className="p-4">{log.user?.name}</td>
            <td className="p-4">{log.actionBy?.name}</td>

            <td className="p-4">
              {new Date(log.actionDate).toLocaleDateString()}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td
            colSpan={5}
            className="text-center p-6 text-gray-500 font-medium"
          >
            No logs found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


<div className="sm:hidden flex flex-col gap-4">
  {logs.length ? (
    logs.map((log) => (
      <div
        key={log.historyId}
        className="
          bg-white border border-gray-200 rounded-2xl p-5
          shadow-sm hover:shadow-md transition
          flex flex-col gap-3
        "
      >
        <div className="flex justify-between">
          <span
            className={`
              px-3 py-1 text-xs font-semibold rounded-full
              ${
                log.actionType === "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : log.actionType === "REJECTED"
                  ? "bg-red-100 text-red-700"
                  : log.actionType === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"
              }
            `}
          >
            {log.actionType}
          </span>
        </div>

        <div>
          <p className="text-xs text-gray-500">Asset</p>
          <p className="text-base font-semibold">
            {log.record.asset.label}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Employee</p>
          <p className="font-medium">{log.user?.name}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Manager</p>
          <p className="font-medium">{log.actionBy?.name}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Date</p>
          <p className="font-medium">
            {new Date(log.actionDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    ))
  ) : (
    <p className="text-center text-gray-500 mt-4">
      No logs found
    </p>
  )}
</div>

    </div>
  );
}
