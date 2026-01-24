"use client";

import { X } from "lucide-react";

interface WidgetHeaderProps {
  title: string;
  onRemove: () => void;
}

export default function WidgetHeader({
  title,
  onRemove,
}: WidgetHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-base font-semibold tracking-tight text-white">
        {title}
      </h3>

      <button
        onClick={onRemove}
        className="p-1 rounded-md text-gray-400 hover:text-red-400 hover:bg-zinc-800 transition"
        title="Remove widget"
      >
        <X size={16} />
      </button>
    </div>
  );
}
