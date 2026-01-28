"use client";

import { useState } from "react";
import { useDashboardStore } from "@/store";
import WidgetBuilder from "@/components/widgets/WidgetBuilder";
import CardWidget from "@/components/widgets/CardWidget";
import TableWidget from "@/components/widgets/TableWidget";
import ChartWidget from "@/components/widgets/ChartWidget";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import SortableWidget from "./SortableWidget";



export default function Dashboard() {
  const widgets = useDashboardStore((state) => state.widgets);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const reorderWidgets = useDashboardStore(
    (state) => state.reorderWidgets
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = widgets.findIndex((w) => w.id === active.id);
    const newIndex = widgets.findIndex((w) => w.id === over.id);

    reorderWidgets(arrayMove(widgets, oldIndex, newIndex));
  };

  if (widgets.length === 0) {
    return (
      <>
        <div className="relative flex items-center justify-center min-h-[80vh] px-6">
          {/* subtle background glow */}
          <div className="absolute inset-0 -z-10 bg-linear-to-br from-green-500/10 via-transparent to-transparent blur-3xl" />

          <div className="max-w-3xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1 mb-6 rounded-full
                            bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              <span>⚡</span>
              <span>Customizable Finance Dashboard</span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight mb-6">
              Build your own
              <span className="block text-green-400">
                real-time finance dashboard
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto mb-12">
              Connect live financial APIs, select exactly the data you care about,
              and visualize markets using powerful cards, tables, and charts —
              all in one place.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 text-left hover:border-zinc-700 transition">
                <p className="text-sm font-medium mb-1">📊 Interactive Charts</p>
                <p className="text-sm text-gray-400">
                  Track stock prices and trends across different time intervals.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 text-left hover:border-zinc-700 transition">
                <p className="text-sm font-medium mb-1">📋 Smart Tables</p>
                <p className="text-sm text-gray-400">
                  View structured financial data with search and pagination.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 text-left hover:border-zinc-700 transition">
                <p className="text-sm font-medium mb-1">💳 Metric Cards</p>
                <p className="text-sm text-gray-400">
                  Monitor key financial metrics at a glance.
                </p>
              </div>
            </div>

            {/* Primary CTA */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsBuilderOpen(true)}
                className="
                  px-7 py-4 rounded-2xl
                  bg-green-500 text-black
                  font-semibold text-lg
                  hover:bg-green-400 transition
                  shadow-xl shadow-green-500/30
                "
              >
                + Create Your First Widget
              </button>
            </div>

            {/* Secondary hint */}
            <p className="mt-6 text-sm text-gray-500">
              Powered by real financial APIs • Secure • Fully customizable
            </p>
          </div>
        </div>

        <WidgetBuilder
          isOpen={isBuilderOpen}
          onClose={() => setIsBuilderOpen(false)}
        />
      </>
    );
  }


  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Finance Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time widgets powered by live APIs
          </p>
        </div>

        <button
          onClick={() => setIsBuilderOpen(true)}
          className="px-5 py-2 rounded-lg bg-green-500 text-black font-medium hover:bg-green-400 transition shadow-md shadow-green-500/20"
        >
          + Add Widget
        </button>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={widgets.map((w) => w.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-12 gap-6 auto-rows-fr">
            {widgets.map((widget) => {
              const colSpan =
                widget.type === "card"
                  ? "lg:col-span-4"
                  : "lg:col-span-8";

              return (
                <div
                  key={widget.id}
                  className={`col-span-12 ${colSpan}`}
                >
                  <SortableWidget id={widget.id}>
                    {widget.type === "card" && <CardWidget widget={widget} />}
                    {widget.type === "table" && <TableWidget widget={widget} />}
                    {widget.type === "chart" && <ChartWidget widget={widget} />}
                  </SortableWidget>
                </div>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>


      <WidgetBuilder
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
      />
    </>
  );
}
