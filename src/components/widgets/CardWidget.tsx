"use client";

import { Widget } from "@/types/widget";
import { useWidgetData } from "@/hooks/useWidgetData";
import { getValueByPath } from "@/utils/getValueByPath";

interface CardWidgetProps {
  widget: Widget;
}

export default function CardWidget({ widget }: CardWidgetProps) {
  const { data, isLoading, error } = useWidgetData(widget);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-white mb-3">
        {widget.displayConfig.title}
      </h3>

      {/* Loading */}
      {isLoading && (
        <p className="text-sm text-blue-400">Loading data...</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400">Failed to load data</p>
      )}

      {/* Data */}
      {data && (
        <div className="space-y-2">
          {widget.fieldMappings.map((field) => {
            const value = getValueByPath(data, field.jsonPath);

            return (
              <div
                key={field.jsonPath}
                className="flex justify-between text-sm"
              >
                <span className="text-gray-400">{field.label}</span>
                <span className="text-white font-medium">
                  {value !== undefined ? String(value) : "--"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
