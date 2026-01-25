"use client";

import { useState, useMemo } from "react";
import { Widget } from "@/types/widget";
import { useWidgetData } from "@/hooks/useWidgetData";
import { getValueByPath } from "@/utils/getValueByPath";
import WidgetContainer from "./WidgetContainer";
import { formatTime } from "@/utils/formatTime";

interface TableWidgetProps {
  widget: Widget;
}

const PAGE_SIZE = 5;

export default function TableWidget({ widget }: TableWidgetProps) {
  const { data, isLoading, error, dataUpdatedAt } = useWidgetData(widget);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Extract table rows (array)
  const rows: any[] = useMemo(() => {
    if (!data) return [];

    if (Array.isArray(data)) return data;
    if (data.metric && typeof data.metric === "object") {
      return Object.entries(data.metric).map(([key, value]) => ({
        metric: key,
        value: value,
      }));
    }
    if (Array.isArray(data.products)) return data.products;
    if (Array.isArray(data.data)) return data.data;

    return [];
  }, [data]);

  // Search filtering
  const filteredRows = useMemo(() => {
    if (!search) return rows;

    return rows.filter((row) =>
      widget.fieldMappings.some((field) => {
        const value = getValueByPath(
          row,
          field.jsonPath.split(".").slice(-1).join(".")
        );
        return String(value ?? "")
          .toLowerCase()
          .includes(search.toLowerCase());
      })
    );
  }, [rows, search, widget.fieldMappings]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / PAGE_SIZE)
  );

  const paginatedRows = filteredRows.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <WidgetContainer title={widget.displayConfig.title} widgetId={widget.id}>
      {/* Search */}
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search..."
        className="mb-2 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white"
      />

      {/* States */}
      {isLoading && (
        <p className="text-sm text-blue-400">Loading data...</p>
      )}

      {error && (
        <p className="text-sm text-red-400">Failed to load data</p>
      )}

      {!isLoading && paginatedRows.length === 0 && (
        <p className="text-sm text-gray-400">No matching records found</p>
      )}

      {/* Table scroll area */}
      {paginatedRows.length > 0 && (
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-zinc-900">
              <tr className="text-gray-400 border-b border-zinc-700">
                {widget.fieldMappings.map((field) => (
                  <th key={field.jsonPath} className="text-left py-2 px-1">
                    {field.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedRows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-zinc-800 last:border-none hover:bg-zinc-900/60 transition"
                >
                  {widget.fieldMappings.map((field) => (
                    <td
                      key={field.jsonPath}
                      className="py-1 px-1 text-white"
                    >
                      {String(
                        getValueByPath(
                          row,
                          field.jsonPath.split(".").slice(-1).join(".")
                        ) ?? "--"
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination (fixed at bottom) */}
      {totalPages > 1 && (
        <div className="mt-2 flex justify-between items-center text-sm">
          <button
            disabled={page === 1}
            onClick={(e) => {
              e.stopPropagation();
              setPage((p) => p - 1);
            }}
            className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 transition"
          >
            Prev
          </button>

          <span className="text-gray-400">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={(e) => {
              e.stopPropagation();
              setPage((p) => p + 1);
            }}
            className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 transition"
          >
            Next
          </button>
        </div>
      )}
      {data && (
        <div className="mt-3 pt-2 text-xs text-gray-500 border-t border-zinc-800">
          Last updated {formatTime(dataUpdatedAt)}
        </div>
      )}
    </WidgetContainer>
  );
}
