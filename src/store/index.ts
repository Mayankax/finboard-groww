import { create } from "zustand";
import { Widget } from "@/types/widget";

interface DashboardState {
  widgets: Widget[];
  addWidget: (widget: Widget) => void;
  removeWidget: (id: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  widgets: [],

  addWidget: (widget) =>
    set((state) => ({
      widgets: [...state.widgets, widget],
    })),

  removeWidget: (id) =>
    set((state) => ({
      widgets: state.widgets.filter((w) => w.id !== id),
    })),
}));
