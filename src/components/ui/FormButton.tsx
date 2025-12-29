"use client";

type ButtonColor = "black" | "white" | "blue" | "green" | "red";

interface ButtonProps {
  type?: "submit" | "button" | "reset";
  label: string;
  disable?: boolean;
  color?: ButtonColor;
  onClick?: () => void;
}

const colorMap: Record<ButtonColor, string> = {
  black: "bg-black text-white hover:bg-gray-800",
  white: "bg-white text-black hover:bg-gray-200",
  blue: "bg-blue-500 text-white hover:bg-blue-600",
  green: "bg-green-500 text-white hover:bg-green-600",
  red: "bg-red-500 text-white hover:bg-red-600",
};

export default function FormButton({
  onClick,
  type = "submit",
  label,
  disable = false,
  color = "black",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disable}
      className={`w-full ${colorMap[color]} font-semibold py-3 rounded-lg text-sm sm:text-base transition active:scale-95`}
    >
      {label}
    </button>
  );
}
