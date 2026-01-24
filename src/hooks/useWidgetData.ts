import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import { Widget } from "@/types/widget";

export function useWidgetData(widget: Widget) {
  return useQuery({
    queryKey: ["widget-data", widget.id, widget.apiConfig.endpoint],
    queryFn: () => fetchApi(widget.apiConfig.endpoint),
    refetchInterval: widget.apiConfig.refreshInterval * 1000,
    enabled: !!widget.apiConfig.endpoint,
    retry: 1,
  });
}
