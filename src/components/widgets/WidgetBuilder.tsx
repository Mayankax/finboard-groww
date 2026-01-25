"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { WidgetType, FieldMapping } from "@/types/widget";
import { useDashboardStore } from "@/store";
import { useTestApi } from "@/hooks/useTestApi";
import JsonExplorer from "./JsonExplorer";

interface WidgetBuilderProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WidgetBuilder({
  isOpen,
  onClose,
}: WidgetBuilderProps) {
  const addWidget = useDashboardStore((state) => state.addWidget);

  const [title, setTitle] = useState("");
  const [type, setType] = useState<WidgetType>("card");

  const [endpoint, setEndpoint] = useState("");
  const [testApi, setTestApi] = useState(false);

  const { data, isLoading, error } = useTestApi(endpoint, testApi);

  const [fields, setFields] = useState<FieldMapping[]>([]);
  const [refreshInterval, setRefreshInterval] = useState(60);


  /* ---------------- Field Selection ---------------- */

  const handleFieldSelect = (path: string, value: any) => {
    setFields((prev) => {
      if (prev.find((f) => f.jsonPath === path)) return prev;

      return [
        ...prev,
        {
          label: path.split(".").pop() || path,
          jsonPath: path,
        },
      ];
    });
  };

  const handleRemoveField = (jsonPath: string) => {
    setFields((prev) =>
      prev.filter((field) => field.jsonPath !== jsonPath)
    );
  };

  /* ---------------- Create Widget ---------------- */

  const handleCreate = () => {
    if (!title.trim() || !endpoint || fields.length === 0) return;

    addWidget({
      id: crypto.randomUUID(),
      type,
      apiConfig: {
        endpoint,
        refreshInterval,
      },
      fieldMappings: fields,
      displayConfig: {
        title,
      },
      createdAt: Date.now(),
    });

    // Reset state
    setTitle("");
    setType("card");
    setEndpoint("");
    setFields([]);
    setTestApi(false);
    onClose();
    setRefreshInterval(60);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col max-h-[90vh] w-full">

        {/* HEADER */}
        <div className="pb-3 border-b border-zinc-800">
          <h2 className="text-xl font-semibold text-white">
            Add New Widget
          </h2>
        </div>

        {/* ✅ SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto pr-1 mt-4 space-y-4">

          {/* Widget Title */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Widget Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Reliance Stock Overview"
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"
            />
          </div>

          {/* Widget Type */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Widget Type
            </label>
            <div className="flex gap-3">
              {(["card", "table", "chart"] as WidgetType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-4 py-2 rounded-lg border transition
                    ${
                      type === t
                        ? "bg-green-500 text-black border-green-500"
                        : "bg-zinc-800 text-gray-300 border-zinc-700"
                    }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* API Endpoint */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              API Endpoint
            </label>
            <input
              value={endpoint}
              onChange={(e) => {
                setEndpoint(e.target.value);
                setTestApi(false);
                setFields([]);
              }}
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"
            />
          </div>

          <button
            onClick={() => setTestApi(true)}
            disabled={!endpoint}
            className="px-4 py-2 rounded-lg bg-zinc-700 text-white"
          >
            Test API
          </button>

          {isLoading && (
            <p className="text-sm text-blue-400">Testing API...</p>
          )}

          {error && (
            <p className="text-sm text-red-400">
              Failed to fetch API.
            </p>
          )}

          {/* JSON Explorer */}
          {data && (
            <>
              <p className="text-sm text-gray-400">
                Select fields to display
              </p>

              <div className="max-h-60 overflow-y-auto bg-black rounded-lg p-2 border border-zinc-800">
                <JsonExplorer data={data} onSelect={handleFieldSelect} />
              </div>
            </>
          )}

          {/* Selected Fields */}
          {fields.length > 0 && (
            <div>
              <p className="text-sm text-gray-400 mb-2">
                Selected Fields
              </p>

              <div className="flex flex-wrap gap-2">
                {fields.map((field) => (
                  <div
                    key={field.jsonPath}
                    className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-zinc-800 border border-zinc-700"
                  >
                    <span>{field.label}</span>
                    <button
                      onClick={() => handleRemoveField(field.jsonPath)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Refresh Interval */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Refresh Interval
            </label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"
            >
              <option value={30}>Every 30 seconds</option>
              <option value={60}>Every 1 minute</option>
              <option value={300}>Every 5 minutes</option>
            </select>
          </div>
        </div>

        {/* FOOTER (fixed) */}
        <div className="pt-3 border-t border-zinc-800 flex justify-end gap-3 mt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={fields.length === 0}
            className="px-5 py-2 rounded-lg bg-green-500 text-black"
          >
            Create Widget
          </button>
        </div>
      </div>
    </Modal>
  );

}
