
import FormError from "@/components/ui/FormError";
import fetchData from "@/hooks/getFetch";
import { FiUsers, FiCheckCircle, FiLayers } from "react-icons/fi";

interface DashboardStats {
  employeesCount: number;
  approvedAssets: number;
  activeAssets: number;
}

export default async function ManagerStats() {
  const { data: stats, error } = await fetchData<DashboardStats>(
    "/api/user/manager-logs"
  );

  if (error) return <FormError message={error}/>;
  if (!stats) return   
  <div className="flex items-center justify-center">
  <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
  </div>;

  return (<>


    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <StatCard
        icon={<FiUsers size={28} />}
        title="Employees"
        value={stats.employeesCount}
        color="blue"
      />

      <StatCard
        icon={<FiCheckCircle size={28} />}
        title="Approved Assets"
        value={stats.approvedAssets}
        color="green"
      />

      <StatCard
        icon={<FiLayers size={28} />}
        title="Active Assets"
        value={stats.activeAssets}
        color="purple"
      />
    </div>
      </>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple";
}) {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 text-blue-700 border-blue-300",
    green: "from-green-50 to-green-100 text-green-700 border-green-300",
    purple: "from-purple-50 to-purple-100 text-purple-700 border-purple-300",
  };

  return (
    <div
      className={`
        bg-linear-to-br ${colorClasses[color]}
        border rounded-xl shadow-md p-5 
        flex flex-col items-center text-center 
        hover:shadow-xl hover:scale-[1.02] transition 
      `}
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm mb-3">
        {icon}
      </div>

      <h3 className="text-sm font-semibold opacity-80">{title}</h3>

      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
