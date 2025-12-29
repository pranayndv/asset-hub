"use client";

import { deleteEmployee, updateEmployee } from "@/actions/userActions";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import FormError from "@/components/ui/FormError";

interface Employee {
  userId: string;
  name: string;
  email: string;
  profileImage?: string | null;
}

const EmployeeEditSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type EmployeeEditForm = z.infer<typeof EmployeeEditSchema>;

export default function EmployeeList({
  employees,
}: {
  employees: Employee[] | null;
}) {
  const [editId, setEditId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeEditForm>({
    resolver: zodResolver(EmployeeEditSchema),
    mode: "onChange",
  });



  const startEdit = async (emp: Employee) => {
    setEditId(emp.userId);
    reset({ name: emp.name, email: emp.email });
    return { success: true };
  };

  const cancelEdit = async () => {
    setEditId(null);
    reset({ name: "", email: "" });
    return { success: true };
  };

  const saveEdit = handleSubmit(async (values) => {
    if (!editId) return;
    await updateEmployee(editId, values);
    await cancelEdit();
  });

  const removeEmployee = async (id: string) => {
    await deleteEmployee(id);
    return { success: true };
  };


  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-5">Employees</h2>

      <ul className="space-y-5">
        {employees?.map((emp) => (
          <li
            key={emp.userId}
            className="bg-white p-5 rounded-2xl border border-gray-400 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center md:justify-between gap-5"
          >
        
            {editId === emp.userId ? (
              <form className="flex flex-col gap-3 w-full">
                <Input
                  register={register("name")}
                  type="text"
                />
                <FormError message={errors.name?.message}/>
                
                <Input
                  register={register("email")}
                  type="email"
                />
                <FormError message={errors.email?.message}/>

                <div className="flex flex-wrap gap-3 mt-2">
                  <Button
                    idleLabel="SAVE"
                    pendingLabel="SAVING"
                    color="green"
                    disabled={isSubmitting}
                    action={async () => {
                      await saveEdit();
                      return { success: true };
                    }}
                  />

                  <Button
                    idleLabel="CANCEL"
                    pendingLabel="CANCELING"
                    color="red"
                    action={cancelEdit}
                  />
                </div>
              </form>
            ) : (
              
              <div className="flex items-center gap-5 w-full md:w-auto">
                <div className="w-14 h-14 bg-gray-200 rounded-full flex justify-center items-center overflow-hidden shadow-inner">
                  {emp.profileImage ? (
                    <Image
                      src={emp.profileImage}
                      alt="Profile"
                      width={100}
                      height={100}
                      className="object-cover w-14 h-14"
                    />
                  ) : (
                    <span className="text-xl font-bold text-gray-700">
                      {emp.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div>
                  <p className="font-semibold text-lg">{emp.name}</p>
                  <p className="text-gray-500 text-sm">{emp.email}</p>
                </div>
              </div>
            )}

 
            {editId !== emp.userId && (
              <div className="flex flex-wrap gap-3 md:justify-end w-full md:w-auto">
                <Button
                  idleLabel="EDIT"
                  pendingLabel="EDITING"
                  color="blue"
                  action={() => startEdit(emp)}
                />

                <Button
                  idleLabel="DELETE"
                  pendingLabel="DELETING"
                  color="red"
                  action={() => removeEmployee(emp.userId)}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
