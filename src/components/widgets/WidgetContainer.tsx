"use client";

import { ReactNode } from "react";
import WidgetHeader from "./WidgetHeader";
import { useDashboardStore } from "@/store";

interface WidgetContainerProps {
  title: string;
  widgetId: string;
  children: ReactNode;
}

export default function WidgetContainer({
  title,
  widgetId,
  children,
}: WidgetContainerProps) {
  const removeWidget = useDashboardStore(
    (state) => state.removeWidget
  );

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
      <WidgetHeader
        title={title}
        onRemove={() => removeWidget(widgetId)}
      />

      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
