"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Widget } from "@/types/widget";
import { useWidgetData } from "@/hooks/useWidgetData";
import { getValueByPath } from "@/utils/getValueByPath";

interface ChartWidgetProps {
  widget: Widget;
}

export default function ChartWidget({ widget }: ChartWidgetProps) {
  const { data, isLoading, error } = useWidgetData(widget);

  if (isLoading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <p className="text-sm text-blue-400">Loading chart...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <p className="text-sm text-red-400">Failed to load chart data</p>
      </div>
    );
  }

  // Extract array data
  let rows: any[] = [];
  if (Array.isArray(data)) rows = data;
  else if (Array.isArray(data.products)) rows = data.products;
  else if (Array.isArray(data.data)) rows = data.data;

  if (rows.length === 0 || widget.fieldMappings.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <p className="text-sm text-gray-400">No chart data available</p>
      </div>
    );
  }

  const field = widget.fieldMappings[0];

  const chartData = rows.map((row, index) => ({
    index,
    value: Number(
      getValueByPath(
        row,
        field.jsonPath.split(".").slice(-1).join(".")
      )
    ),
  }));

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-64">
      <h3 className="text-lg font-semibold text-white mb-2">
        {widget.displayConfig.title}
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="index" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
