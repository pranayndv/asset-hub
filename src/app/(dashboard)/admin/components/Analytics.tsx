import {
  DashboardAnalyticsData,
  AdminAnalytics,
  ManagerAnalytics,
  RequestsSummary,
} from "@/lib/types/analytics";

import {
  FiUsers,
  FiUserCheck,
  FiServer,
  FiPackage,
  FiTool,
  FiCheckCircle,
  FiAlertCircle,
  FiArchive,
  FiXCircle,
  FiRefreshCcw,
  FiClock,
  FiFileText
} from "react-icons/fi";

interface AnalyticsProps {
  analytics: DashboardAnalyticsData | null;
}

export default function DashboardAnalytics({ analytics }: AnalyticsProps) {
  if (!analytics) {
    return (
      <p className="text-gray-500 text-center py-10">
        No analytics data available.
      </p>
    );
  }

  const isAdmin = analytics.userRole === "ADMIN";
  const isManager = analytics.userRole === "MANAGER";

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      
      {isAdmin && (
        <>
          <ModernCard
            title="Managers"
            value={(analytics as AdminAnalytics).managers}
            icon={<FiUsers size={26} />}
            color="blue"
          />

          <ModernCard
            title="Employees"
            value={(analytics as AdminAnalytics).employees}
            icon={<FiUserCheck size={26} />}
            color="green"
          />

          <ModernCard
            title="Total Assets"
            value={(analytics as AdminAnalytics).assets.total}
            icon={<FiPackage size={26} />}
            color="purple"
          />

          <ModernCard
            title="Available Assets"
            value={(analytics as AdminAnalytics).assets.available}
            icon={<FiCheckCircle size={26} />}
            color="emerald"
          />

          <ModernCard
            title="Checked Out"
            value={(analytics as AdminAnalytics).assets.checkedOut}
            icon={<FiAlertCircle size={26} />}
            color="yellow"
          />

          <ModernCard
            title="In Maintenance"
            value={(analytics as AdminAnalytics).assets.inMaintenance}
            icon={<FiTool size={26} />}
            color="orange"
          />

          <ModernCard
            title="Lost"
            value={(analytics as AdminAnalytics).assets.lost}
            icon={<FiXCircle size={26} />}
            color="red"
          />

          <ModernCard
            title="Retired"
            value={(analytics as AdminAnalytics).assets.retired}
            icon={<FiArchive size={26} />}
            color="gray"
          />

          <RequestCard requests={(analytics as AdminAnalytics).requests} />
        </>
      )}

      
      {isManager && (
        <>
          <ModernCard
            title="Team Employees"
            value={(analytics as ManagerAnalytics).teamEmployees}
            icon={<FiUsers size={26} />}
            color="blue"
          />

          <ModernCard
            title="Active Assets"
            value={(analytics as ManagerAnalytics).activeAssets}
            icon={<FiServer size={26} />}
            color="purple"
          />

          <RequestCard requests={(analytics as ManagerAnalytics).requests} />
        </>
      )}
    </div>
  );
}


interface ModernCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color:
    | "blue"
    | "green"
    | "purple"
    | "emerald"
    | "orange"
    | "yellow"
    | "red"
    | "gray";
}

const colorStyles: Record<string, string> = {
  blue: "from-blue-50 to-blue-100 text-blue-700 border-blue-200",
  green: "from-green-50 to-green-100 text-green-700 border-green-200",
  purple: "from-purple-50 to-purple-100 text-purple-700 border-purple-200",
  emerald: "from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200",
  orange: "from-orange-50 to-orange-100 text-orange-700 border-orange-200",
  yellow: "from-yellow-50 to-yellow-100 text-yellow-700 border-yellow-200",
  red: "from-red-50 to-red-100 text-red-700 border-red-200",
  gray: "from-gray-50 to-gray-100 text-gray-700 border-gray-200",
};

function ModernCard({ title, value, icon, color }: ModernCardProps) {
  return (
    <div
      className={`
        bg-linear-to-br ${colorStyles[color]}
        p-5 rounded-xl border shadow-sm hover:shadow-lg 
        transition transform hover:scale-[1.02]
        flex flex-col items-center text-center
      `}
    >
      <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm mb-3">
        {icon}
      </div>

      <p className="text-sm font-medium opacity-80">{title}</p>

      <h2 className="text-3xl font-bold mt-1">{value}</h2>
    </div>
  );
}

interface RequestCardProps {
  requests: RequestsSummary;
}

function RequestCard({ requests }: RequestCardProps) {
  return (
    <div className="col-span-2 bg-white rounded-2xl shadow-lg border p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-5">
        Request Status Overview
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
        <RequestItem
          label="Pending"
          value={requests.pending}
          color="yellow"
          icon={<FiClock size={20} />}
        />

        <RequestItem
          label="Approved"
          value={requests.approved}
          color="green"
          icon={<FiCheckCircle size={20} />}
        />

        <RequestItem
          label="Rejected"
          value={requests.rejected}
          color="red"
          icon={<FiXCircle size={20} />}
        />

        <RequestItem
          label="Return Req."
          value={requests.returnRequested}
          color="blue"
          icon={<FiRefreshCcw size={20} />}
        />

        <RequestItem
          label="Closed"
          value={requests.closed}
          color="purple"
          icon={<FiFileText size={20} />}
        />
      </div>
    </div>
  );
}

interface RequestItemProps {
  label: string;
  value: number;
  color: "yellow" | "green" | "red" | "blue" | "purple";
  icon: React.ReactNode;
}

function RequestItem({ label, value, color, icon }: RequestItemProps) {
  const colorMap: Record<string, string> = {
    yellow: "from-yellow-50 to-yellow-100 text-yellow-700 border-yellow-200",
    green: "from-green-50 to-green-100 text-green-700 border-green-200",
    red: "from-red-50 to-red-100 text-red-700 border-red-200",
    blue: "from-blue-50 to-blue-100 text-blue-700 border-blue-200",
    purple: "from-purple-50 to-purple-100 text-purple-700 border-purple-200",
  };

  return (
    <div
      className={`
        bg-linear-to-br ${colorMap[color]}
        rounded-xl p-4 border shadow-sm 
        hover:shadow-lg hover:scale-[1.02] transition-all duration-200
        flex flex-col items-center text-center
      `}
    >

      <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm mb-2">
        {icon}
      </div>

      <p className="text-xs opacity-70 font-medium">{label}</p>

      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  );
}
