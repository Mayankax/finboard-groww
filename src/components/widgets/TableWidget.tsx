"use client";

import { useState, useMemo } from "react";
import { Widget } from "@/types/widget";
import { useWidgetData } from "@/hooks/useWidgetData";
import { getValueByPath } from "@/utils/getValueByPath";

interface TableWidgetProps {
  widget: Widget;
}

const PAGE_SIZE = 5;

export default function TableWidget({ widget }: TableWidgetProps) {
  const { data, isLoading, error } = useWidgetData(widget);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Extract table rows (array)
  const rows: any[] = useMemo(() => {
    if (!data) return [];

    // Try common array locations
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.products)) return data.products;
    if (Array.isArray(data.data)) return data.data;

    return [];
  }, [data]);

  // Search filtering
  const filteredRows = useMemo(() => {
    if (!search) return rows;

    return rows.filter((row) =>
      widget.fieldMappings.some((field) => {
        const normalizedPath = field.jsonPath.split(".").slice(-1).join(".");
        const value = getValueByPath(row, normalizedPath);
        return String(value).toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [rows, search, widget.fieldMappings]);

  // Pagination
  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);
  const paginatedRows = filteredRows.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-white mb-3">
        {widget.displayConfig.title}
      </h3>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search..."
        className="mb-3 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white"
      />

      {/* States */}
      {isLoading && (
        <p className="text-sm text-blue-400">Loading data...</p>
      )}

      {error && (
        <p className="text-sm text-red-400">Failed to load data</p>
      )}

      {!isLoading && paginatedRows.length === 0 && (
        <p className="text-sm text-gray-400">No data found</p>
      )}

      {/* Table */}
      {paginatedRows.length > 0 && (
        <div className="overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-gray-400 border-b border-zinc-700">
                {widget.fieldMappings.map((field) => (
                  <th key={field.jsonPath} className="text-left py-2">
                    {field.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedRows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-zinc-800 last:border-none"
                >
                  {widget.fieldMappings.map((field) => (
                    <td key={field.jsonPath} className="py-2 text-white">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 rounded bg-zinc-800 disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-gray-400">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded bg-zinc-800 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
