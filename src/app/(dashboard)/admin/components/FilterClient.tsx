"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface UserOption {
  userId: string;
  name: string;
}

interface Props {
  role?: string;
  managers: UserOption[];
  employees: UserOption[];
  selectedManager: string | undefined;
  selectedEmployee: string;
}

export default function FiltersClient({
  role,
  managers,
  employees,
  selectedManager,
  selectedEmployee,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    value ? params.set(key, value) : params.delete(key);

    if (key === "managerId") params.delete("employeeId");

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {role === "ADMIN" && (
        <select
          value={selectedManager}
          onChange={(e) => updateParam("managerId", e.target.value)}
          className="p-3 rounded-lg border border-gray-400 bg-gray-50"
        >
          <option value="">Select Manager</option>
          {managers.map((m) => (
            <option key={m.userId} value={m.userId}>
              {m.name}
            </option>
          ))}
        </select>
      )}

      <select
        value={selectedEmployee}
        disabled={!selectedManager}
        onChange={(e) => updateParam("employeeId", e.target.value)}
        className="p-3 rounded-lg border border-gray-400 bg-gray-50"
      >
        <option value="">Select Employee</option>
        {employees.map((e) => (
          <option key={e.userId} value={e.userId}>
            {e.name}
          </option>
        ))}
      </select>
    </div>
  );
}
