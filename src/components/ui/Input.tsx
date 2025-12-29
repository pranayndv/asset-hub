"use client";

import { UseFormRegisterReturn } from "react-hook-form";

type FormInputProps = {
  type?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  maxLength?:number,
  inputMode?:"search" | "email" | "tel" | "text" | "url" | "none" | "numeric" | "decimal" | undefined,
  className?:string,
  min?:string | number
  accept?:string,
};

export default function Input({
  type,
  placeholder,
  register,
  maxLength,
  inputMode,
  className,
  min,
  accept,
  
}: FormInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      {...register}
      min={min}
      inputMode={inputMode}
      maxLength={maxLength}
      accept={accept}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-gray-300 ${className}`}
    />
  );
}
