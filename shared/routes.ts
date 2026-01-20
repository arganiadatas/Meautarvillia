import { z } from 'zod';
import { 
  insertExchangeRateSchema, 
  insertIndicatorSchema, 
  insertChartDataSchema, 
  insertMarketQuoteSchema, 
  insertNewsSchema,
  exchangeRates,
  economicIndicators,
  chartDataPoints,
  marketQuotes,
  news
} from './schema';

export const api = {
  exchangeRates: {
    list: {
      method: 'GET' as const,
      path: '/api/exchange-rates',
      responses: {
        200: z.array(z.custom<typeof exchangeRates.$inferSelect>()),
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/exchange-rates/:type',
      input: insertExchangeRateSchema.partial(),
      responses: {
        200: z.custom<typeof exchangeRates.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    }
  },
  indicators: {
    list: {
      method: 'GET' as const,
      path: '/api/indicators',
      responses: {
        200: z.array(
          z.object({
            key: z.string(),
            label: z.string(),
            value: z.string(),
            category: z.string().optional(),
            trend: z.string().optional(),
            description: z.string().optional(),
          })
        ),
      },
    },
  },
  charts: {
    list: {
      method: 'GET' as const,
      path: '/api/charts',
      responses: {
        200: z.record(z.array(z.object({ time: z.string(), value: z.number() }))),
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/charts',
      input: insertChartDataSchema,
      responses: {
        201: z.custom<typeof chartDataPoints.$inferSelect>(),
      }
    }
  },
  market: {
    list: {
      method: 'GET' as const,
      path: '/api/market',
      responses: {
        200: z.array(z.custom<typeof marketQuotes.$inferSelect>()),
      },
    },
  },
  news: {
    list: {
      method: 'GET' as const,
      path: '/api/news',
      responses: {
        200: z.array(z.custom<typeof news.$inferSelect>()),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
