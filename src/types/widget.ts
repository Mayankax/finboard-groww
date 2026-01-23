export type WidgetType = "card" | "table" | "chart";

export interface ApiConfig {
  endpoint: string;
  refreshInterval: number; // in seconds
  params?: Record<string, string>;
}

export interface FieldMapping {
  label: string;        // Display name (e.g. "Current Price")
  jsonPath: string;     // Path inside API response (e.g. "data.price")
  format?: "currency" | "percentage" | "number";
}

export interface DisplayConfig {
  title: string;
  description?: string;
}

export interface Widget {
  id: string;
  type: WidgetType;

  apiConfig: ApiConfig;
  fieldMappings: FieldMapping[];
  displayConfig: DisplayConfig;

  createdAt: number;
}
