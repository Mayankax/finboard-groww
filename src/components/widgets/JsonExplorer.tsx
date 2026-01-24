"use client";

interface JsonExplorerProps {
  data: any;
  parentPath?: string;
  onSelect: (path: string, value: any) => void;
}

export default function JsonExplorer({
  data,
  parentPath = "",
  onSelect,
}: JsonExplorerProps) {
  if (typeof data !== "object" || data === null) {
    return null;
  }

  return (
    <div className="ml-3 border-l border-zinc-700 pl-3 space-y-1">
      {Object.entries(data).map(([key, value]) => {
        const currentPath = parentPath ? `${parentPath}.${key}` : key;
        const isObject = typeof value === "object" && value !== null;

        return (
          <div key={currentPath}>
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-green-400"
              onClick={() => {
                if (!isObject) {
                  onSelect(currentPath, value);
                }
              }}
            >
              <span className="text-gray-300">{key}</span>
              {!isObject && (
                <span className="text-xs text-gray-500">
                  ({typeof value})
                </span>
              )}
            </div>

            {isObject && (
              <JsonExplorer
                data={value}
                parentPath={currentPath}
                onSelect={onSelect}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
