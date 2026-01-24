"use client";

import { ReactNode } from "react";

interface WidgetContainerProps {
  title: string;
  children: ReactNode;
}

export default function WidgetContainer({
  title,
  children,
}: WidgetContainerProps) {
  return (
    <div
      className="
        bg-linear-to-br from-zinc-900 to-zinc-950
        border border-zinc-800/80
        rounded-2xl
        p-5
        shadow-lg shadow-black/40
        hover:border-zinc-700 transition
        h-95
        flex flex-col
      "
    >
      <h3 className="text-lg font-semibold text-white mb-3">
        {title}
      </h3>

      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
