"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createManager } from "@/actions/managerActions";
import { Session } from "next-auth";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import FormError from "@/components/ui/FormError";

const ManagerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type ManagerForm = z.infer<typeof ManagerSchema>;

export default function AdminCreateManager({session}:{session:Session | null}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ManagerForm>({
    resolver: zodResolver(ManagerSchema),
    mode: "onChange",
  });

  const onSubmit = async (formData: ManagerForm) => {
    if (!session?.accessToken) {
      toast.error("Unauthorized, please login again.");
      return;
    }

    const res = await createManager(formData);

    if (!res.success) {
      toast.error(res.message || "Something went wrong!");
      return;
    }

    toast.success("Manager created successfully!");
    reset();
    router.refresh();
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Create New Manager
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
   
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <Input
            type="text"
            placeholder="Enter manager name"
            register={register("name")}
          />
          <FormError message={errors.name?.message}/>
        </div>

  
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <Input
            type="email"
            placeholder="Enter manager email"
            register={register("email")}
          />
          <FormError message={errors.email?.message}/>
        </div>


        <Button
          idleLabel="CREATE"
          pendingLabel="CREATING"
          color="blue"
          type="submit"
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
}
