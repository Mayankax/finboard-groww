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
import WidgetContainer from "./WidgetContainer";
import { useMemo } from "react";

interface ChartWidgetProps {
  widget: Widget;
}

export default function ChartWidget({ widget }: ChartWidgetProps) {
  const { data, isLoading, error } = useWidgetData(widget);

  const chartData = useMemo(() => {
    let rows: any[] = [];
    if (Array.isArray(data)) rows = data;
    else if (Array.isArray(data?.products)) rows = data.products;
    else if (Array.isArray(data?.data)) rows = data.data;

    const field = widget.fieldMappings[0];
    if (!rows.length || !field) return [];

    return rows.map((row, index) => {
      const val = getValueByPath(
        row,
        field.jsonPath.split(".").slice(-1).join(".")
      );

      return {
        index,
        value: Number(val),
      };
    }).filter(d => !isNaN(d.value));
  }, [data, widget.fieldMappings]);

  return (
    <WidgetContainer title={widget.displayConfig.title} widgetId={widget.id}>
      {isLoading && <p className="text-sm text-blue-400">Loading chart...</p>}
      {error && <p className="text-sm text-red-400">Failed to load chart data</p>}
      {!isLoading && chartData.length === 0 && (
        <p className="text-sm text-gray-400">No chart data available</p>
      )}

      {/* ✅ give chart its own height */}
      {chartData.length > 0 && (
        <div className="w-full h-65">
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
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </WidgetContainer>
  );
}
