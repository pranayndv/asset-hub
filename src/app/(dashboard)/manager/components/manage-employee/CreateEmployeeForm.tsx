"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEmployee } from "@/actions/userActions";
import { Session } from "next-auth";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import FormError from "@/components/ui/FormError";

const EmployeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type EmployeeForm = z.infer<typeof EmployeeSchema>;

export default function ManagerCreateEmployeeForm({session}:{session:Session | null}) {
  const router = useRouter();


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeForm>({
    resolver: zodResolver(EmployeeSchema),
    mode:"onChange",
    defaultValues: {
      name: "",
      email: "",
    },
  });


  const onSubmit = async (formData: EmployeeForm) => {
    if (!session?.accessToken) {
      toast.error("Unauthorized, please login again.");
      return;
    }

    try {
      const data = await createEmployee(formData);

      if (!data.success) {
        toast.error(data.message || "Something went wrong!");
        return;
      }

      toast.success("Employee created successfully!");

      reset();
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Server Error");
    }
  };

 return (
  <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 mb-6">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
      Create New Employee
    </h2>

    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
    
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Name</label>
        <Input
          type="text"
          placeholder="Enter employee name"
          register={register("name")}
        />
        <FormError message={errors.name?.message}/>

      </div>

  
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          placeholder="Enter employee email"
          register={register("email")}
        />
        <FormError message={errors.email?.message}/>
      </div>

      <Button
        idleLabel="CREATE EMPLOYEE"
        type="submit"
        pendingLabel="CREATING"
        color="blue"
        disabled={isSubmitting}
      />
      
    </form>
  </div>
);

}
