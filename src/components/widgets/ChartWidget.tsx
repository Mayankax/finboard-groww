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
import { useEffect, useMemo, useState } from "react";

interface ChartWidgetProps {
  widget: Widget;
}

interface ChartPoint {
  index: string;
  value: number;
}

export default function ChartWidget({ widget }: ChartWidgetProps) {
  const { data, isLoading, error, dataUpdatedAt } = useWidgetData(widget);

  const [history, setHistory] = useState<ChartPoint[]>([]);

  // ✅ Handle live Finnhub quote API (c = current price)
  useEffect(() => {
    if (typeof (data as any)?.c === "number") {
      setHistory((prev) => [
        ...prev.slice(-20), // keep last 20 points
        {
          index: new Date().toLocaleTimeString(),
          value: Number((data as any).c),
        },
      ]);
    }
  }, [dataUpdatedAt, data]);

  const chartData = useMemo<ChartPoint[]>(() => {
    if (!data) return history;

    // ✅ Finnhub candle API (historical)
    if (Array.isArray((data as any).c) && Array.isArray((data as any).t)) {
      return (data as any).t
        .map((time: number, index: number): ChartPoint => ({
          index: new Date(time * 1000).toLocaleDateString(),
          value: Number((data as any).c[index]),
        }))
        .filter((d: { index: string; value: number }) => !isNaN(d.value));
    }

    // ✅ Generic array APIs
    let rows: any[] = [];
    if (Array.isArray(data)) rows = data;
    else if (Array.isArray((data as any)?.products))
      rows = (data as any).products;
    else if (Array.isArray((data as any)?.data))
      rows = (data as any).data;

    const field = widget.fieldMappings[0];
    if (!rows.length || !field) return history;

    return rows
      .map((row, index): ChartPoint => {
        const val = getValueByPath(
          row,
          field.jsonPath.split(".").slice(-1).join(".")
        );

        return {
          index: String(index),
          value: Number(val),
        };
      })
      .filter((d) => !isNaN(d.value));
  }, [data, widget.fieldMappings, history]);

  return (
    <WidgetContainer title={widget.displayConfig.title} widgetId={widget.id}>
      {isLoading && <p className="text-sm text-blue-400">Loading chart...</p>}

      {error && (
        <p className="text-sm text-red-400">Failed to load chart data</p>
      )}

      {!isLoading && chartData.length === 0 && (
        <p className="text-sm text-gray-400">
          No time-series data available for this widget
        </p>
      )}

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
