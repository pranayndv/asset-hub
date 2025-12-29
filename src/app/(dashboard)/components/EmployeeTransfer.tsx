"use client";

import { transferEmployee } from "@/actions/managerActions";
import fetchData from "@/hooks/getFetch";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import Button from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import FormError from "@/components/ui/FormError";
import PageHeader from "@/components/common/PageHeader";


const TransferSchema = z.object({
  sourceManagerId: z.string().min(1, "Select a manager"),
  targetManagerId: z.string().min(1, "Select a target manager"),
  employeeIds: z.array(z.string()).min(1, "Select at least one employee"),
});

type TransferForm = z.infer<typeof TransferSchema>;

interface Manager {
  userId: string;
  name: string;
  email: string;
}

interface Employee {
  userId: string;
  name: string;
  email: string;
}

export default function EmployeeTransfer({session}:{session:Session | null}) {
  const userRole = session?.user.role;
  const userID = session?.user.id;

  const [managers, setManagers] = useState<Manager[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);


  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransferForm>({
    resolver: zodResolver(TransferSchema),
    defaultValues: {
      sourceManagerId: userRole === "MANAGER" ? userID : "",
      targetManagerId: "",
      employeeIds: [],
    },
  });

  const sourceManagerId = watch("sourceManagerId");
  const selectedEmployees = watch("employeeIds");


  useEffect(() => {
    async function fetchManagers() {
      const { data } = await fetchData<Manager[]>("/api/admin/manager");
      if (data) setManagers(data);
    }
    fetchManagers();
  }, []);


  useEffect(() => {
    if (!sourceManagerId) return;

    async function loadEmployees() {
      setLoadingEmployees(true);

       const {data} = await fetchData<Employee[]>(`/api/admin/get-employee?managerId=${sourceManagerId}`);

      if (data) setEmployees(data);

      setValue("employeeIds", []);
      setLoadingEmployees(false);
    }
    loadEmployees();
  }, [setValue, sourceManagerId]);


  const toggleEmployee = (id: string) => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const current = watch("employeeIds");
    if (current.includes(id)) {
      setValue(
        "employeeIds",
        current.filter((x: string) => x !== id)
      );
    } else {
      setValue("employeeIds", [...current, id]);
    }
  };


  const onSubmit = async (values: TransferForm) => {
    const res = await transferEmployee({
      employeeIds: values.employeeIds,
      targetManagerId: values.targetManagerId,
    });

    toast.success(res.message);

    reset({
      sourceManagerId: userRole === "MANAGER" ? userID : "",
      targetManagerId: "",
      employeeIds: [],
    });
    setEmployees([]);
  };

  const filteredTargets = managers.filter((m) => m.userId !== sourceManagerId);

 return (
  <div className="p-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100">
    <PageHeader text={`Transfer Employees`}/>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">


      {userRole === "ADMIN" && (
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">
            Select Manager to Transfer From
          </label>

          <Select
            register={register("sourceManagerId")}
            placeholder="-- Select Manager --"
            options={managers.map((m) => ({
              value: m.userId,
              label: `${m.name} (${m.email})`,
            }))}
          />
          <FormError message={errors.sourceManagerId?.message}/>
          
        </div>
      )}


      {sourceManagerId && (
        <div className="space-y-3">
          <PageHeader size="md" text={`Employees Under Manager`} underline="none" color="text-gray-400"/>
          {loadingEmployees ? (
              <div className="flex items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            </div>
          ) : employees.length === 0 ? (
            <p className="text-gray-500 italic">No employees found.</p>
          ) : (
            <ul className="space-y-3">
              {employees.map((emp) => {
                const selected = selectedEmployees.includes(emp.userId);

                return (
                  <li
                    key={emp.userId}
                    className={`
                      flex justify-between items-center p-4 rounded-xl border cursor-pointer 
                      transition shadow-sm hover:shadow-md
                      ${
                        selected
                          ? "bg-blue-50 border-blue-500"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }
                    `}
                    onClick={() => toggleEmployee(emp.userId)}
                  >
                    <div>
                      <p className="font-medium text-gray-800">{emp.name}</p>
                      <p className="text-sm text-gray-500">{emp.email}</p>
                    </div>

                    <input
                      type="checkbox"
                      readOnly
                      checked={selected}
                      className="w-5 h-5 accent-blue-600"
                    />
                  </li>
                );
              })}
            </ul>
          )}

          <FormError message={errors.employeeIds?.message}/>
        </div>
      )}


      {selectedEmployees.length > 0 && (
        <div className="space-y-2">
            <PageHeader size="md" text={`Transfer To Manager`} underline="none" color="text-gray-400"/>


          <Select
            register={register("targetManagerId")}
            placeholder="-- Select Manager --"
            options={filteredTargets.map((m) => ({
              value: m.userId,
              label: `${m.name} (${m.email})`,
            }))}
          />

         <FormError message={errors.targetManagerId?.message}/>
        </div>
      )}

      {selectedEmployees.length > 0 && (
        <Button
          idleLabel="TRANSFER"
          type="submit"
          pendingLabel="TRANSFERING"
          color="blue"
          disabled={isSubmitting}
          className="mx-auto"
        />
      )}
    </form>
  </div>
);
}