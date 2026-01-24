import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";

export function useTestApi(endpoint: string, enabled: boolean) {
  return useQuery({
    queryKey: ["test-api", endpoint],
    queryFn: () => fetchApi(endpoint),
    enabled,
    retry: 1,
  });
}
