import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Widget } from "@/types/widget";

interface DashboardState {
  widgets: Widget[];
  addWidget: (widget: Widget) => void;
  removeWidget: (id: string) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      widgets: [],

      addWidget: (widget) =>
        set((state) => ({
          widgets: [...state.widgets, widget],
        })),

      removeWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
        })),
    }),
    {
      name: "finboard-dashboard", // key in localStorage
    }
  )
);
