"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { WidgetType } from "@/types/widget";
import { useDashboardStore } from "@/store";
import { useTestApi } from "@/hooks/useTestApi";

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

  const handleCreate = () => {
    if (!title.trim()) return;

    addWidget({
      id: crypto.randomUUID(),
      type,
      apiConfig: {
        endpoint,
        refreshInterval: 60,
      },
      fieldMappings: [],
      displayConfig: {
        title,
      },
      createdAt: Date.now(),
    });

    setTitle("");
    setType("card");
    onClose();
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
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1">
          API Endpoint
        </label>
        <input
          value={endpoint}
          onChange={(e) => {
            setEndpoint(e.target.value);
            setTestApi(false);
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

      {data && (
        <pre className="max-h-40 overflow-auto text-xs bg-black rounded-lg p-3 text-green-400 mb-4">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}


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
          className="px-5 py-2 rounded-lg bg-green-500 text-black font-medium hover:bg-green-400"
        >
          Create Widget
        </button>
      </div>
    </Modal>
  );
}
