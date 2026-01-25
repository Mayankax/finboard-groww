export function formatTime(timestamp: number) {
  if (!timestamp) return "—";

  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
