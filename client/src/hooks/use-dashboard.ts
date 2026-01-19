import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

// Exchange Rates
export function useExchangeRates() {
  return useQuery({
    queryKey: [api.exchangeRates.list.path],
    queryFn: async () => {
      const res = await fetch(api.exchangeRates.list.path);
      if (!res.ok) throw new Error("Failed to fetch exchange rates");
      return api.exchangeRates.list.responses[200].parse(await res.json());
    },
  });
}

// Economic Indicators
export function useIndicators() {
  return useQuery({
    queryKey: [api.indicators.list.path],
    queryFn: async () => {
      const res = await fetch(api.indicators.list.path);
      if (!res.ok) throw new Error("Failed to fetch indicators");
      return api.indicators.list.responses[200].parse(await res.json());
    },
  });
}

// Chart Data
export function useChartData() {
  return useQuery({
    queryKey: [api.charts.list.path],
    queryFn: async () => {
      const res = await fetch(api.charts.list.path);
      if (!res.ok) throw new Error("Failed to fetch chart data");
      return api.charts.list.responses[200].parse(await res.json());
    },
  });
}

// Market Quotes
export function useMarketQuotes() {
  return useQuery({
    queryKey: [api.market.list.path],
    queryFn: async () => {
      const res = await fetch(api.market.list.path);
      if (!res.ok) throw new Error("Failed to fetch market quotes");
      return api.market.list.responses[200].parse(await res.json());
    },
  });
}

// News
export function useNews() {
  return useQuery({
    queryKey: [api.news.list.path],
    queryFn: async () => {
      const res = await fetch(api.news.list.path);
      if (!res.ok) throw new Error("Failed to fetch news");
      return api.news.list.responses[200].parse(await res.json());
    },
  });
}
