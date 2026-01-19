import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
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
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const rates = await storage.getExchangeRates();
  if (rates.length === 0) {
    await storage.createExchangeRate({
      type: "official",
      buy: "850.00",
      sell: "900.00",
      trend: "stable"
    });
    await storage.createExchangeRate({
      type: "blue",
      buy: "1100.00",
      sell: "1150.00",
      trend: "up"
    });
  }

  const indicators = await storage.getIndicators();
  if (indicators.length === 0) {
    await storage.createIndicator({
      key: "tna",
      label: "Tasa Nominal Anual",
      value: "10%",
      category: "central_bank"
    });
    await storage.createIndicator({
      key: "gdp",
      label: "PBI Anual",
      value: "$193.567.008 Millones",
      category: "central_bank"
    });
    await storage.createIndicator({
      key: "reserves",
      label: "Reservas Internacionales",
      value: "US$147,289 Millones",
      trend: "down",
      category: "central_bank",
      description: "↓ 23,15%"
    });
    await storage.createIndicator({
      key: "public_debt",
      label: "Deuda Pública",
      value: "$1.144 Mil Millones",
      category: "debt",
      description: "0,59% del PBI"
    });
    await storage.createIndicator({
      key: "external_debt",
      label: "Deuda Externa",
      value: "$0,00",
      category: "debt"
    });
  }

  const quotes = await storage.getMarketQuotes();
  if (quotes.length === 0) {
    await storage.createMarketQuote({
      symbol: "IDA MERVAL",
      price: "83983.17",
      changePercent: "0.41"
    });
    await storage.createMarketQuote({
      symbol: "JOYERIA",
      price: "171628.89",
      changePercent: "2.80"
    });
  }

  const chartData = await storage.getChartData();
  if (chartData.length === 0) {
    // Seed some chart data
    const series = [
      "Alquileres", "Salarios", "Aprobación", "Inflación", 
      "Canasta Básica", "EMAE", "Desocupación", "Supermercados"
    ];
    
    const descriptions: Record<string, string> = {
      "Alquileres": "Indicador del alquiler promedio del país",
      "Salarios": "Indice de crecimiento Salarial de Meautarvillia",
      "Aprobación": "Indice de Aprobación gubernamental de todos los gobiernos",
      "Inflación": "El índice de precios al consumidor (IPC) mide la variación de precios de los bienes y servicios representativos del gasto de consumo de los hogares.",
      "Canasta Básica": "Establece el ingreso que un hogar tipo debe tener para satisfacer, por medio de la compra de bienes y servicios no alimentarios (vestimenta, educación, salud, etc.), un conjunto de necesidades consideradas esenciales.",
      "EMAE": "El Estimador Mensual de Actividad Económica (EMAE) refleja la evolución mensual de la actividad económica del conjunto de los sectores productivos a nivel nacional.",
      "Desocupación": "Presenta información sobre el comportamiento del mercado de trabajo, midiendo el porcentaje de la población económicamente activa que se encuentra sin empleo.",
      "Supermercados": "Mide la evolución de las ventas a los consumidores finales en supermercados a precios corrientes. Es un indicador clave del consumo privado y la actividad económica interna."
    };
    
    const today = new Date();
    for (const s of series) {
      for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const timeStr = date.toISOString().split('T')[0];
        const value = (Math.random() * 100 + 50).toFixed(2);
        
        await storage.addChartDataPoint({
          seriesName: s,
          time: timeStr,
          value: value
        });
      }
    }
  }
  
  const newsItems = await storage.getNews();
  if (newsItems.length === 0) {
    await storage.addNews({
      title: "Nuevo anuncio económico",
      content: "El gobierno anuncia nuevas medidas para estabilizar el mercado cambiario.",
      source: "Oficial"
    });
    await storage.addNews({
      title: "Actualización de reservas",
      content: "El Banco Central informa un aumento en las reservas de moneda extranjera.",
      source: "BCRA"
    });
  }
}
