"use client";

import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-linear-to-br from-zinc-900 to-zinc-950
                      border border-zinc-800 p-6 shadow-xl shadow-black/50">
        {children}
      </div>
    </div>
  );
}
