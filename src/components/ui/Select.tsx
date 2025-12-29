// components/SelectField.tsx
import { UseFormRegisterReturn } from "react-hook-form";

type Option = {
  value: string | number;
  label: string;
};

type SelectFieldProps = {
  options?: Option[];
  register: UseFormRegisterReturn;
  className?: string;
  placeholder?: string;
};

export const Select = ({
  options,
  register,
  className = "",
  placeholder,
}: SelectFieldProps) => {
  return (
    <select
      {...register}
      className={`w-full p-3 rounded-lg border border-gray-300 bg-gray-50
        focus:ring-1 focus:ring-gray-300 outline-none transition
        ${className}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}

      {options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
