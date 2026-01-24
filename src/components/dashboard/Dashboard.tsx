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
        <div className="flex flex-col items-center justify-center h-full text-center gap-4">
          <h2 className="text-2xl font-semibold text-white">
            Your dashboard is empty
          </h2>
          <p className="text-gray-400 max-w-md">
            Start building your personalized finance dashboard by adding widgets.
          </p>

          <button
            onClick={() => setIsBuilderOpen(true)}
            className="px-5 py-2 rounded-lg bg-green-500 text-black font-medium hover:bg-green-400 transition"
          >
            Add Widget
          </button>
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button
          onClick={() => setIsBuilderOpen(true)}
          className="px-4 py-2 rounded-lg bg-green-500 text-black font-medium"
        >
          Add Widget
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
          <div className="grid grid-cols-12 gap-6">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className="col-span-12 lg:col-span-6"
              >
                <SortableWidget id={widget.id}>
                  {widget.type === "card" && <CardWidget widget={widget} />}
                  {widget.type === "table" && <TableWidget widget={widget} />}
                  {widget.type === "chart" && <ChartWidget widget={widget} />}
                </SortableWidget>
              </div>
            ))}
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
