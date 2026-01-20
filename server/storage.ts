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
  seed(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async seed(): Promise<void> {
    const rates = await this.getExchangeRates();
    if (rates.length === 0) {
      await this.createExchangeRate({
        type: "official",
        buy: "850.00",
        sell: "900.00",
        trend: "stable"
      });
      await this.createExchangeRate({
        type: "blue",
        buy: "1100.00",
        sell: "1150.00",
        trend: "up"
      });
    }

    const indicators = await this.getIndicators();
    if (indicators.length === 0) {
      await this.createIndicator({
        key: "tna",
        label: "Tasa Nominal Anual",
        value: "10%",
        category: "central_bank"
      });
      await this.createIndicator({
        key: "gdp",
        label: "PBI Anual",
        value: "$193.567.008 Millones",
        category: "central_bank"
      });
      await this.createIndicator({
        key: "reserves",
        label: "Reservas Internacionales",
        value: "US$147,289 Millones",
        trend: "down",
        category: "central_bank",
        description: "↓ 23,15%"
      });
      await this.createIndicator({
        key: "public_debt",
        label: "Deuda Pública",
        value: "$1.144 Mil Millones",
        category: "debt",
        description: "0,59% del PBI"
      });
      await this.createIndicator({
        key: "external_debt",
        label: "Deuda Externa",
        value: "$0,00",
        category: "debt"
      });
    }

    const quotes = await this.getMarketQuotes();
    if (quotes.length === 0) {
      await this.createMarketQuote({
        symbol: "IDA MERVAL",
        price: "83983.17",
        changePercent: "0.41"
      });
      await this.createMarketQuote({
        symbol: "JOYERIA",
        price: "171628.89",
        changePercent: "2.80"
      });
    }

    const chartData = await this.getChartData();
    if (chartData.length === 0) {
      const series = [
        "Alquileres", "Salarios", "Aprobación", "Inflación", 
        "Canasta Básica", "EMAE", "Desocupación", "Supermercados"
      ];

      const today = new Date();
      for (const s of series) {
        for (let i = 30; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const timeStr = date.toISOString().split('T')[0];
          const value = (Math.random() * 100 + 50).toFixed(2);
          
          await this.addChartDataPoint({
            seriesName: s,
            time: timeStr,
            value: value
          });
        }
      }
    }
    
    const newsItems = await this.getNews();
    if (newsItems.length === 0) {
      await this.addNews({
        title: "Nuevo anuncio económico",
        content: "El gobierno anuncia nuevas medidas para estabilizar el mercado cambiario.",
        source: "Oficial"
      });
      await this.addNews({
        title: "Actualización de reservas",
        content: "El Banco Central informa un aumento en las reservas de moneda extranjera.",
        source: "BCRA"
      });
    }
  }
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
