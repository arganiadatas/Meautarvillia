import { z } from "zod";

export const exchangeRateSchema = z.object({
  type: z.string(),
  value: z.number(),
  updatedAt: z.string().optional(),
});

export const indicatorSchema = z.object({
  name: z.string(),
  value: z.number(),
});

export const chartPointSchema = z.object({
  seriesName: z.string(),
  time: z.string(),
  value: z.number(),
});

export const marketQuoteSchema = z.object({
  symbol: z.string(),
  price: z.number(),
});

export const newsSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
});

export const api = {
  exchangeRates: {
    list: {
      method: "GET" as const,
      path: "/api/exchange-rates",
      responses: {
        200: z.array(exchangeRateSchema),
      },
    },
    update: {
      method: "PUT" as const,
      path: "/api/exchange-rates/:type",
      input: exchangeRateSchema.partial(),
      responses: {
        200: exchangeRateSchema,
        404: z.object({ message: z.string() }),
      },
    },
  },
  indicators: {
    list: {
      method: "GET" as const,
      path: "/api/indicators",
      responses: {
        200: z.array(indicatorSchema),
      },
    },
  },
  charts: {
    list: {
      method: "GET" as const,
      path: "/api/charts",
      responses: {
        200: z.record(z.array(chartPointSchema)),
      },
    },
    update: {
      method: "POST" as const,
      path: "/api/charts",
      input: chartPointSchema,
      responses: {
        201: chartPointSchema,
      },
    },
  },
  market: {
    list: {
      method: "GET" as const,
      path: "/api/market",
      responses: {
        200: z.array(marketQuoteSchema),
      },
    },
  },
  news: {
    list: {
      method: "GET" as const,
      path: "/api/news",
      responses: {
        200: z.array(newsSchema),
      },
    },
  },
};

export function buildUrl(
  path: string,
  params?: Record<string, string | number>,
): string {
  let url = path;
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url = url.replace(`:${key}`, String(value));
    }
  }
  return url;
}
