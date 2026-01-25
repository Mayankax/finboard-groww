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
      <h2 className="text-xl font-semibold text-white mb-4">
        Add New Widget
      </h2>

      {/* Widget Title */}
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1">
          Widget Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Reliance Stock Overview"
          className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white focus:outline-none focus:border-green-500"
        />
      </div>

      {/* Widget Type */}
      <div className="mb-6">
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
                    : "bg-zinc-800 text-gray-300 border-zinc-700 hover:border-zinc-500"
                }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* API Endpoint */}
      <div className="mb-3">
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
          placeholder="https://api.example.com/data"
          className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white focus:outline-none focus:border-green-500"
        />
      </div>

      <button
        onClick={() => setTestApi(true)}
        disabled={!endpoint}
        className="mb-4 px-4 py-2 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 disabled:opacity-50"
      >
        Test API
      </button>
      
       

      {/* API Status */}
      {isLoading && (
        <p className="text-sm text-blue-400 mb-2">Testing API...</p>
      )}

      {error && (
        <p className="text-sm text-red-400 mb-2">
          Failed to fetch API. Please check the endpoint or API key.
        </p>
      )}

      {/* JSON Explorer */}
      {data && (
        <>
          <p className="text-sm text-gray-400 mb-2">
            Select fields to display
          </p>

          <div className="max-h-48 overflow-auto bg-black rounded-lg p-2 mb-3">
            <JsonExplorer data={data} onSelect={handleFieldSelect} />
          </div>
        </>
      )}

      {/* Selected Fields */}
      {fields.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">
            Selected Fields
          </p>

          <div className="flex flex-wrap gap-2">
            {fields.map((field) => (
              <div
                key={field.jsonPath}
                className="
                  flex items-center gap-1
                  px-2 py-1 text-xs
                  rounded-lg
                  bg-zinc-800 border border-zinc-700
                "
              >
                <span>{field.label}</span>

                <button
                  onClick={() => handleRemoveField(field.jsonPath)}
                  className="text-gray-400 hover:text-red-400 transition"
                  title="Remove field"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}



      <div className="mb-4">
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


      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-gray-300 hover:text-white"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          disabled={fields.length === 0}
          className="px-5 py-2 rounded-lg bg-green-500 text-black font-medium hover:bg-green-400 disabled:opacity-50"
        >
          Create Widget
        </button>
      </div>
    </Modal>
  );
}
