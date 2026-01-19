import { db } from "./db";
import {
  exchangeRates,
  economicIndicators,
  chartDataPoints,
  marketQuotes,
  news,
  type ExchangeRate,
  type InsertExchangeRate,
  type EconomicIndicator,
  type InsertEconomicIndicator,
  type ChartDataPoint,
  type InsertChartDataPoint,
  type MarketQuote,
  type InsertMarketQuote,
  type NewsItem,
  type InsertNewsItem
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Exchange Rates
  getExchangeRates(): Promise<ExchangeRate[]>;
  updateExchangeRate(type: string, rate: Partial<InsertExchangeRate>): Promise<ExchangeRate>;
  
  // Indicators
  getIndicators(): Promise<EconomicIndicator[]>;
  updateIndicator(key: string, indicator: Partial<InsertEconomicIndicator>): Promise<EconomicIndicator>;
  
  // Charts
  getChartData(seriesName?: string): Promise<ChartDataPoint[]>;
  addChartDataPoint(point: InsertChartDataPoint): Promise<ChartDataPoint>;
  
  // Market
  getMarketQuotes(): Promise<MarketQuote[]>;
  updateMarketQuote(symbol: string, quote: Partial<InsertMarketQuote>): Promise<MarketQuote>;
  
  // News
  getNews(): Promise<NewsItem[]>;
  addNews(item: InsertNewsItem): Promise<NewsItem>;

  // Seed helpers
  createExchangeRate(rate: InsertExchangeRate): Promise<ExchangeRate>;
  createIndicator(indicator: InsertEconomicIndicator): Promise<EconomicIndicator>;
  createMarketQuote(quote: InsertMarketQuote): Promise<MarketQuote>;
}

export class DatabaseStorage implements IStorage {
  async getExchangeRates(): Promise<ExchangeRate[]> {
    return await db.select().from(exchangeRates);
  }

  async updateExchangeRate(type: string, rate: Partial<InsertExchangeRate>): Promise<ExchangeRate> {
    const [updated] = await db
      .update(exchangeRates)
      .set({ ...rate, updatedAt: new Date() })
      .where(eq(exchangeRates.type, type))
      .returning();
    return updated;
  }
  
  async createExchangeRate(rate: InsertExchangeRate): Promise<ExchangeRate> {
    const [created] = await db.insert(exchangeRates).values(rate).returning();
    return created;
  }

  async getIndicators(): Promise<EconomicIndicator[]> {
    return await db.select().from(economicIndicators);
  }

  async updateIndicator(key: string, indicator: Partial<InsertEconomicIndicator>): Promise<EconomicIndicator> {
    const [updated] = await db
      .update(economicIndicators)
      .set(indicator)
      .where(eq(economicIndicators.key, key))
      .returning();
    return updated;
  }
  
  async createIndicator(indicator: InsertEconomicIndicator): Promise<EconomicIndicator> {
    const [created] = await db.insert(economicIndicators).values(indicator).returning();
    return created;
  }

  async getChartData(seriesName?: string): Promise<ChartDataPoint[]> {
    if (seriesName) {
      return await db.select().from(chartDataPoints).where(eq(chartDataPoints.seriesName, seriesName));
    }
    return await db.select().from(chartDataPoints);
  }

  async addChartDataPoint(point: InsertChartDataPoint): Promise<ChartDataPoint> {
    const [created] = await db.insert(chartDataPoints).values(point).returning();
    return created;
  }

  async getMarketQuotes(): Promise<MarketQuote[]> {
    return await db.select().from(marketQuotes);
  }

  async updateMarketQuote(symbol: string, quote: Partial<InsertMarketQuote>): Promise<MarketQuote> {
    const [updated] = await db
      .update(marketQuotes)
      .set(quote)
      .where(eq(marketQuotes.symbol, symbol))
      .returning();
    return updated;
  }
  
  async createMarketQuote(quote: InsertMarketQuote): Promise<MarketQuote> {
    const [created] = await db.insert(marketQuotes).values(quote).returning();
    return created;
  }

  async getNews(): Promise<NewsItem[]> {
    return await db.select().from(news).orderBy(news.publishedAt);
  }

  async addNews(item: InsertNewsItem): Promise<NewsItem> {
    const [created] = await db.insert(news).values(item).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
