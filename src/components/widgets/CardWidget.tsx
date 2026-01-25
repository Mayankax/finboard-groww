"use client";

import { Widget } from "@/types/widget";
import { useWidgetData } from "@/hooks/useWidgetData";
import { getValueByPath } from "@/utils/getValueByPath";
import WidgetContainer from "./WidgetContainer";
import { formatTime} from "@/utils/formatTime";

interface CardWidgetProps {
  widget: Widget;
}

export default function CardWidget({ widget }: CardWidgetProps) {
  const { data, isLoading, error, dataUpdatedAt } = useWidgetData(widget);

  return (
    <WidgetContainer title={widget.displayConfig.title} widgetId={widget.id}>
      {/* Loading */}
      {isLoading && (
        <p className="text-sm text-blue-400">Loading data...</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400">Unable to fetch data. Please check API or rate limits.</p>
      )}

      {/* Data */}
      {data && (
        <div className="space-y-2">
          {widget.fieldMappings.map((field) => {
            const value = getValueByPath(data, field.jsonPath);

            return (
              <div
                key={field.jsonPath}
                className="flex justify-between text-sm items-center"
              >
                <span className="text-gray-400">{field.label}</span>
                <span className="text-white font-semibold tabular-nums">
                  {value !== undefined ? String(value) : "--"}
                </span>
              </div>
            );
          })}
        </div>
      )}
      {data && (
        <div className="mt-auto pt-3 text-xs text-gray-500 border-t border-zinc-800">
          Last updated {formatTime(dataUpdatedAt)}
        </div>
      )}


      {!isLoading && !error && !data && (
        <p className="text-sm text-gray-400">No data available</p>
      )}
    </WidgetContainer>
  );
}
