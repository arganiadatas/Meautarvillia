import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "../shared/api";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Exchange Rates
  app.get(api.exchangeRates.list.path, async (req, res) => {
    const rates = await storage.getExchangeRates();
    res.json(rates);
  });

  app.put(api.exchangeRates.update.path, async (req, res) => {
    try {
      const type = req.params.type;
      const rate = api.exchangeRates.update.input.parse(req.body);
      const updated = await storage.updateExchangeRate(type, rate);
      if (!updated) return res.status(404).json({ message: "Rate not found" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Indicators
  app.get(api.indicators.list.path, async (req, res) => {
    const indicators = await storage.getIndicators();
    res.json(indicators);
  });

  // Charts
  app.get(api.charts.list.path, async (req, res) => {
    const data = await storage.getChartData();
    // Group by seriesName
    const grouped = data.reduce((acc, curr) => {
      if (!acc[curr.seriesName]) acc[curr.seriesName] = [];
      acc[curr.seriesName].push({ time: curr.time, value: Number(curr.value) });
      return acc;
    }, {} as Record<string, { time: string; value: number }[]>);
    res.json(grouped);
  });

  app.post(api.charts.update.path, async (req, res) => {
    try {
      const point = api.charts.update.input.parse(req.body);
      const created = await storage.addChartDataPoint(point);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Market
  app.get(api.market.list.path, async (req, res) => {
    const quotes = await storage.getMarketQuotes();
    res.json(quotes);
  });

  // News
  app.get(api.news.list.path, async (req, res) => {
    const news = await storage.getNews();
    res.json(news);
  });

  // Seed Data
  await storage.seed();

  return httpServer;
}
