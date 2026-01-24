"use client";

import { useDashboardStore } from "@/store";

export default function Dashboard() {
  const widgets = useDashboardStore((state) => state.widgets);

  if (widgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center gap-4">
        <h2 className="text-2xl font-semibold text-white">
          Your dashboard is empty
        </h2>
        <p className="text-gray-400 max-w-md">
          Start building your personalized finance dashboard by adding widgets
          like stock cards, tables, or charts.
        </p>

        <button className="px-5 py-2 rounded-lg bg-green-500 text-black font-medium hover:bg-green-400 transition">
          Add Widget
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className="col-span-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4"
        >
          <h3 className="text-lg font-medium text-white">
            {widget.displayConfig.title}
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Widget type: {widget.type}
          </p>
        </div>
      ))}
    </div>
  );
}
