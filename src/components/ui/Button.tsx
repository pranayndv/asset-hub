"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";


type ActionResult = {
  success?: boolean;
  message?: string;
};

type AsyncActionButtonProps = {
  action?: () => Promise<ActionResult | void>;
  idleLabel: string;
  pendingLabel?: string;
  onSuccess?: () => void;
  onError?: (message?: string) => void;
  type?: "submit" | "reset" | "button";
  color?: string;
  className?: string;
  disabled?: boolean;
};

export default function Button({
  action,
  idleLabel,
  pendingLabel = "Processing...",
  onSuccess,
  onError,
  type = "button",
  color = "grey",
  className,
  disabled = false,
}: AsyncActionButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!action) return;

    startTransition(async () => {
      const result = await action();
 if (result) {
        router.refresh();
        onError?.(result.message);
        return;
      }

     
      onSuccess?.();
      router.refresh();
    });
  };


  return (
    <button
      onClick={handleClick}
      type={type}
      disabled={isPending || disabled}
      className={`
        px-5 py-1.5
        rounded-lg
        font-medium text-${color}-700

        bg-linear-to-br from-${color}-50 to-${color}-100
        border-2 border-${color}-500/60

        shadow-sm
        transition-all duration-200 ease-out

        hover:from-${color}-100 hover:to-${color}-200
        hover:shadow-md hover:border-${color}-600

        focus:outline-none
        focus:ring-2 focus:ring-${color}-500/30
        hover:scale-[1.01]
      
        disabled:opacity-50
        disabled:cursor-not-allowed ${className}`}
      
    >
      {isPending ? pendingLabel : idleLabel}
    </button>
  );
}
