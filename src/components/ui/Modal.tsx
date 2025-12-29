"use client";

import { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string; 
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  maxWidth = "max-w-md",
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white w-full ${maxWidth} rounded-2xl shadow-2xl p-6 space-y-6 
        animate-[fadeIn_0.25s_ease-out]`}
      >
        {title && (
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        )}

        <div>{children}</div>

        {footer && (
          <div className="flex justify-end gap-3 pt-2">{footer}</div>
        )}
      </div>
    </div>
  );
}
