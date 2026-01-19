import { pgTable, text, serial, numeric, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Exchange Rates (Dollar quotes)
export const exchangeRates = pgTable("exchange_rates", {
  id: serial("id").primaryKey(),
  type: text("type").notNull().unique(), // e.g., "Blue", "Official"
  buy: numeric("buy").notNull(),
  sell: numeric("sell").notNull(),
  trend: text("trend").default("stable"), // "up", "down", "stable"
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Economic Indicators (Central Bank, Debt, etc.)
export const economicIndicators = pgTable("economic_indicators", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // e.g., "tna", "gdp"
  label: text("label").notNull(),
  value: text("value").notNull(),
  category: text("category").notNull(), // "central_bank", "debt", "reserves"
  trend: text("trend"),
  description: text("description"),
});

// Chart Data Points (Time series for graphs)
export const chartDataPoints = pgTable("chart_data_points", {
  id: serial("id").primaryKey(),
  seriesName: text("series_name").notNull(), // "inflation", "salaries", "rent"
  time: text("time").notNull(), // "YYYY-MM-DD"
  value: numeric("value").notNull(),
});

// Market Quotes (Merval, stocks)
export const marketQuotes = pgTable("market_quotes", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  price: numeric("price").notNull(),
  changePercent: numeric("change_percent").notNull(),
});

// News
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  source: text("source").notNull(),
  publishedAt: timestamp("published_at").defaultNow(),
});

// Schemas
export const insertExchangeRateSchema = createInsertSchema(exchangeRates).omit({ id: true, updatedAt: true });
export const insertIndicatorSchema = createInsertSchema(economicIndicators).omit({ id: true });
export const insertChartDataSchema = createInsertSchema(chartDataPoints).omit({ id: true });
export const insertMarketQuoteSchema = createInsertSchema(marketQuotes).omit({ id: true });
export const insertNewsSchema = createInsertSchema(news).omit({ id: true, publishedAt: true });

// Types
export type ExchangeRate = typeof exchangeRates.$inferSelect;
export type InsertExchangeRate = z.infer<typeof insertExchangeRateSchema>;

export type EconomicIndicator = typeof economicIndicators.$inferSelect;
export type InsertEconomicIndicator = z.infer<typeof insertIndicatorSchema>;

export type ChartDataPoint = typeof chartDataPoints.$inferSelect;
export type InsertChartDataPoint = z.infer<typeof insertChartDataSchema>;

export type MarketQuote = typeof marketQuotes.$inferSelect;
export type InsertMarketQuote = z.infer<typeof insertMarketQuoteSchema>;

export type NewsItem = typeof news.$inferSelect;
export type InsertNewsItem = z.infer<typeof insertNewsSchema>;

// API Types
export type ExchangeRatesResponse = ExchangeRate[];
export type IndicatorsResponse = EconomicIndicator[];
export type ChartDataResponse = Record<string, { time: string; value: number }[]>;
export type MarketQuotesResponse = MarketQuote[];
export type NewsResponse = NewsItem[];
