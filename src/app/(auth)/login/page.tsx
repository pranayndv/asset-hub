"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import FormButton from "@/components/ui/FormButton";
import FormError from "@/components/ui/FormError";
import toast from "react-hot-toast";


const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginForm) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl: "/",
    });

    if (res?.error) {
      toast.error("Invalid credentials");
    } else if (res?.ok) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Login
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              type="email"
              placeholder="Email"
              register={register("email")}
            />
            
              <FormError message={errors.email?.message} />
           
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              register={register("password")}
            />
            
              <FormError message={errors.password?.message} />
          
          </div>

          <FormButton
            label={isSubmitting ? "Logging in..." : "Login"}
            color="black"
            disable={isSubmitting}
          />
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/forgot-password"
            className="text-blue-800 hover:text-blue-600 text-sm sm:text-base"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
