import { create } from "zustand";

export interface DashboardState {
  widgets: any[];
}

export const useDashboardStore = create<DashboardState>(() => ({
  widgets: [],
}));
