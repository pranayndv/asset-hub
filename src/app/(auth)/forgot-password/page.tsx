"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { postFetch } from "@/hooks/postFetch";
import { getSession } from "@/actions/userActions";
import Input from "@/components/ui/Input";
import FormError from "@/components/ui/FormError";
import FormButton from "@/components/ui/FormButton";



const EmailSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

const OtpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6),
});

const PasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm: z.string().min(6),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type Step = 1 | 2 | 3;

export default function ForgotPasswordForm() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [verifiedOtp, setVerifiedOtp] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const [loading, setLoading] = useState(false);



  const emailForm = useForm({
    resolver: zodResolver(EmailSchema),
    mode: "onChange",
  });

  const otpForm = useForm({
    resolver: zodResolver(OtpSchema),
    mode: "onChange",
  });

  const pwForm = useForm({
    resolver: zodResolver(PasswordSchema),
    mode: "onChange",
  });

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session?.user?.email) {
        setEmail(session.user.email);
        emailForm.setValue("email", session.user.email);
      }
    })();
  }, [emailForm]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setInterval(() => setResendIn((v) => v - 1), 1000);
    return () => clearInterval(timer);
  }, [resendIn]);



  const requestOtp = async (email: string) => {
    setLoading(true);
    toast.dismiss();

    try {
      const json = await postFetch("/auth/request-reset", { email });

      if (!json.success) {
        toast.error(json.message || "Failed to send OTP");
        return false;
      }

      toast.success("OTP sent! Check your email.");
      setResendIn(60);
      return true;
    } finally {
      setLoading(false);
    }
  };

  const submitEmail = emailForm.handleSubmit(async ({ email }) => {
    const ok = await requestOtp(email);
    if (ok) {
      setEmail(email);
      setStep(2);
    }
  });

  const submitOtp = otpForm.handleSubmit(async ({ otp }) => {
    setLoading(true);
    toast.dismiss();

    try {
      const json = await postFetch("/auth/verify-otp", { email, otp });

      if (!json.success) {
        toast.error(json.message || "Invalid OTP");
        return;
      }

      setVerifiedOtp(otp);
      toast.success("OTP verified!");
      setStep(3);
    } finally {
      setLoading(false);
    }
  });

  const submitPassword = pwForm.handleSubmit(async ({ password }) => {
    setLoading(true);
    toast.dismiss();

    try {
      const json = await postFetch("/auth/set-password", {
        email,
        otp: verifiedOtp,
        password,
      });

      if (!json.success) {
        toast.error(json.message || "Could not reset password");
        return;
      }

      toast.success("Password updated! Redirecting…");
      setTimeout(() => router.push("/login"), 1500);
    } finally {
      setLoading(false);
    }
  });



  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 flex sm:items-center sm:justify-center">

      <div className="w-full sm:max-w-md sm:rounded-3xl sm:shadow-2xl bg-white sm:bg-white/80 sm:backdrop-blur-xl flex flex-col min-h-screen sm:min-h-0">


        <div className="px-6 pt-8 pb-6 text-center">
          <h1 className="text-2xl font-bold text-black">
            Reset Password
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Recover your account securely
          </p>

          <div className="mt-6 flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-8 rounded-full transition ${
                  step >= s ? "bg-black" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        
        <div className="flex-1 px-6">

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={submitEmail} className="space-y-6">
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Email address
                </label>
                <Input
                  type="email"
                  register={emailForm.register("email")}
                  placeholder="you@example.com"
                />
                  <FormError message={emailForm.formState.errors.email?.message}/>

              </div>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={submitOtp} className="space-y-6">
              <div>
                <label className="text-xs text-gray-500">Email</label>
                <div className="mt-1 h-12 rounded-xl text-gray-400 bg-gray-100 px-4 flex items-center text-sm">
                  {email}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-600">OTP</label>
                <Input
                  register={otpForm.register("otp")}
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="••••••"
                />

                <FormError message= {otpForm.formState.errors.otp?.message}/>
                
              </div>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form onSubmit={submitPassword} className="space-y-6">
              <div>
                <label className="text-xs text-gray-600">New password</label>
                <Input
                  type="password"
                  register={pwForm.register("password")}
                  placeholder="Password"
                />
                
                <FormError message={pwForm.formState.errors.password?.message}/>
              </div>

              <div>
                <label className="text-xs text-gray-600">Confirm password</label>
                <Input
                  type="password"
                  register={pwForm.register("confirm")}
                  placeholder="Confirm Password"
                />
                <FormError message= {pwForm.formState.errors.confirm?.message}/>
              </div>
            </form>
          )}
        </div>

  
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t sm:static sm:border-0">
          {step === 1 && (
            <FormButton
              onClick={submitEmail}
              disable={loading}
              color='black'
              label={loading ? "Sending…" : "Send OTP"}
            />
              
           
          )}

          {step === 2 && (
            <div className="space-y-3">
              <FormButton
                onClick={submitOtp}
                disable={loading}
                label={loading ? "Verifying…" : "Verify OTP"}
                color="black"
             />

             <FormButton
                onClick={() => requestOtp(email)}
                disable={resendIn > 0 || loading}
                label={resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
                color="white"
             />

            </div>
          )}

          {step === 3 && (
            <FormButton
                onClick={submitPassword}
                disable={loading}
                label={loading ? "Updating…" : "Reset Password"}
                color="black"
             />
          )}
        </div>
      </div>
    </div>
  );
}
