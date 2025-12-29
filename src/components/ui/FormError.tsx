"use client";

type FormErrorProps = {
  message?: string;
};

export default function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <p className="text-red-500 mt-2 ml-2 italic text-[10px]">
      {message}
    </p>
  );
}
