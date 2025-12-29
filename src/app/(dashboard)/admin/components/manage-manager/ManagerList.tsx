"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteManager, updateManager } from "@/actions/managerActions";
import { deleteEmployee, updateEmployee } from "@/actions/userActions";
import fetchData from "@/hooks/getFetch";
import Image from "next/image";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import FormError from "@/components/ui/FormError";

const EditSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type EditForm = z.infer<typeof EditSchema>;

interface Manager {
  userId: string;
  name: string;
  email: string;
  profileImage?: string | null;
}

interface Employee {
  userId: string;
  name: string;
  email: string;
  profileImage?: string | null;
}

export default function ManagerList({
  managerList,
}: {
  managerList: Manager[] | null;
}) {
  const [selectedManager, setSelectedManager] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditForm>({
    mode: "onChange",
    resolver: zodResolver(EditSchema),
    defaultValues: { name: "", email: "" },
  });

  const fetchEmployees = async (managerId: string) => {
    setLoadingEmployees(true);
    const { data } = await fetchData<Employee[]>(
      `/api/admin/get-employee?managerId=${managerId}`
    );
    setEmployees(data ?? []);
    setLoadingEmployees(false);
  };

  const handleManagerClick = (managerId: string) => {
    if (selectedManager === managerId) {
      setSelectedManager(null);
      setEmployees([]);
    } else {
      setSelectedManager(managerId);
      fetchEmployees(managerId);
    }
  };

  const startEdit =async (item: Manager | Employee) => {
    await setEditId(item.userId);
    await reset({ name: item.name, email: item.email });
  };

  const cancelEdit =async () => {
    await setEditId(null);
    await reset({ name: "", email: "" });
  };

  const saveManager = handleSubmit(async (values) => {
    if (!editId) return;
    await updateManager(editId, values);
    cancelEdit();
  });

  const saveEmployee = handleSubmit(async (values) => {
    if (!editId) return;
    await updateEmployee(editId, values);
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.userId === editId ? { ...emp, ...values } : emp
      )
    );
    cancelEdit();
  });

  return (
    <div className="md:max-w-full sm:p-6 mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Managers</h2>

      <ul className="space-y-5">
        {managerList?.map((mgr) => (
          <li
            key={mgr.userId}
            className="bg-white p-5  rounded-2xl border border-gray-400 shadow-sm"
          >
            <div
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-5 cursor-pointer"
              onClick={() => handleManagerClick(mgr.userId)}
            >
              {editId === mgr.userId ? (
                <form
                  onSubmit={saveManager}
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col gap-3 w-full"
                >
                  <Input register={register("name")}/>
                  <FormError message={errors.name?.message}/>
                 

                  <Input register={register("email")}/>
                  <FormError message={errors.email?.message}/>

                  <div className="flex gap-2">
                    <Button
                      idleLabel="Save"
                      pendingLabel="Saving"
                      color="green"
                      type="submit"
                      disabled={isSubmitting}
                    />

                    <Button
                      idleLabel="Cancel"
                      color="gray"
                      type="button"
                      disabled={isSubmitting}
                      action={cancelEdit}
                    />
                  </div>
                </form>
              ) : (
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                    {mgr.profileImage ? (
                      <Image
                        src={mgr.profileImage}
                        alt="Profile"
                        width={56}
                        height={56}
                        className="object-cover rounded-full"
                      />
                    ) : (
                      <span className="font-bold text-xl">
                        {mgr.name[0].toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="font-semibold">{mgr.name}</p>
                    <p className="text-sm text-gray-500">{mgr.email}</p>
                  </div>
                </div>
              )}

              {editId !== mgr.userId && (
                <div
                  className="flex gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    idleLabel="Edit"
                    color="blue"
                    type="button"
                    action={() => startEdit(mgr)}
                  />

                  <Button
                    idleLabel="Delete"
                    color="red"
                    type="button"
                    action={() => deleteManager(mgr.userId)}
                  />
                </div>
              )}
            </div>

            {selectedManager === mgr.userId && (
              <div className="mt-5 pl-6 border-l-4 border-blue-500">
                <h3 className="font-semibold mb-3">
                  Employees Under Manager
                </h3>

                {loadingEmployees ? (
                    <div className="flex items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
                    </div>
                ) : employees.length ? (
                  <ul className="space-y-4">
                    {employees.map((emp) => (
                      <li
                        key={emp.userId}
                        className="bg-gray-50 p-4 rounded-xl flex flex-col sm:flex-row sm:justify-between gap-4"
                      >
                        {editId === emp.userId ? (
                          <form
                            onSubmit={saveEmployee}
                            className="flex flex-col gap-3 w-full"
                          >
                            <Input register={register("name")}  />
                            <Input register={register("email")} />

                            <div className="flex gap-2">
                              <Button
                                idleLabel="Save"
                                pendingLabel="Saving"
                                color="green"
                                type="submit"
                                disabled={isSubmitting}
                              />

                              <Button
                                idleLabel="Cancel"
                                color="gray"
                                type="button"
                                disabled={isSubmitting}
                                action={cancelEdit}
                              />
                            </div>
                          </form>
                        ) : (
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              {emp.profileImage ? (
                                <Image
                                  src={emp.profileImage}
                                  alt="Profile"
                                  width={48}
                                  height={48}
                                   className="object-cover rounded-full"
                                />
                              ) : (
                                <span className="font-bold">
                                  {emp.name[0].toUpperCase()}
                                </span>
                              )}
                            </div>

                            <div>
                              <p className="font-medium">{emp.name}</p>
                              <p className="text-sm text-gray-500">{emp.email}</p>
                            </div>
                          </div>
                        )}

                        {editId !== emp.userId && (
                          <div className="flex gap-3">
                            <Button
                              idleLabel="Edit"
                              color="blue"
                              type="button"
                              action={() => startEdit(emp)}
                            />

                            <Button
                              idleLabel="Delete"
                              color="red"
                              type="button"
                              action={() => deleteEmployee(emp.userId)}
                            />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No employees assigned</p>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
