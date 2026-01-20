import { readFile, writeFile } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";

const DATA_FILE = path.resolve(process.cwd(), "data.json");

type ExchangeRate = {
  type: string;
  buy: string;
  sell: string;
  trend?: string;
  updatedAt?: string;
};

type EconomicIndicator = {
  key: string;
  label: string;
  value: string;
  category?: string;
  trend?: string;
  description?: string;
};

type ChartDataPoint = {
  seriesName: string;
  time: string;
  value: string;
};

type MarketQuote = {
  symbol: string;
  price: string;
  changePercent?: string;
};

type NewsItem = {
  id: string;
  title: string;
  content: string;
  source?: string;
  publishedAt?: string;
};

type StorageData = {
  exchangeRates: ExchangeRate[];
  indicators: EconomicIndicator[];
  charts: ChartDataPoint[];
  market: MarketQuote[];
  news: NewsItem[];
};

const defaultData: StorageData = {
  exchangeRates: [],
  indicators: [],
  charts: [],
  market: [],
  news: [],
};

async function loadData(): Promise<StorageData> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    await saveData(defaultData);
    return structuredClone(defaultData);
  }
}

async function saveData(data: StorageData) {
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

export class FileStorage {
  async seed() {
    const data = await loadData();
    if (data.indicators.length === 0) {
      data.indicators.push(
        {
          key: "tna",
          label: "Tasa Nominal Anual",
          value: "10%",
          category: "central_bank",
          trend: "Posible Crisis",
          description: "Tasa de referencia del Banco Central"
        },
        {
          key: "gdp",
          label: "PBI Anual",
          value: "$193.567.008 Millones",
          category: "central_bank",
          trend: "up",
          description: "Producto Bruto Interno estimado anual"
        },
        {
          key: "reserves",
          label: "Reservas Internacionales",
          value: "US$83,914 Millones",
          category: "central_bank",
          trend: "down",
          description: "↓ 43,03%"
        },
        {
          key: "public_debt",
          label: "Deuda Pública",
          value: "$1.936 Mil Millones",
          category: "debt",
          trend: "↑",
          description: "0,99% del PBI"
        },
        {
          key: "external_debt",
          label: "Deuda Externa",
          value: "$0,00",
          category: "debt",
          trend: "stable",
          description: "Obligaciones con acreedores internacionales"
        }
      );
    }
    if (data.exchangeRates.length === 0) {
      data.exchangeRates.push(
        {
          type: "Oficial",
          buy: "270.80",
          sell: "279.76",
          trend: "↑",
          updatedAt: new Date().toISOString()
        },
        {
          type: "Blue",
          buy: "278.50",
          sell: "278.76",
          trend: "↑",
          updatedAt: new Date().toISOString()
        },
        {
          type: "Euro",
          buy: "320.85",
          sell: "329.95",
          trend: "↑",
          updatedAt: new Date().toISOString()
        }
      );
    }


    if (data.market.length === 0) {
      data.market.push(
        { symbol: "IDA MERVAL", price: "83,593.75", changePercent: "-0.20" },
        { symbol: "JOYERIA", price: "174,266.03", changePercent: "2.80" }
      );
    }

    // 📊 SEED DE GRÁFICOS
    if (data.charts.length === 0) {
      const series = [
        "Alquileres",
        "Salarios",
        "Aprobación",
        "Inflación",
        "Canasta Básica",
        "EMAE",
        "Desocupación",
        "Supermercados"
      ];

      const today = new Date();

      for (const name of series) {
        for (let i = 30; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);

          data.charts.push({
            seriesName: name,
            time: d.toISOString().split("T")[0],
            value: (Math.random() * 100 + 50).toFixed(2)
          });
        }
      }
    }

    if (data.news.length === 0) {
      data.news.push({
        id: randomUUID(),
        title: "Industrias",
        content: "Ind. Automotriz y Joyas dejará de exportar",
        source: "Oficial",
        publishedAt: new Date().toISOString()
      });
    }

    await saveData(data);
  }


  async getExchangeRates() {
    return (await loadData()).exchangeRates;
  }

  async updateExchangeRate(type: string, rate: Partial<ExchangeRate>) {
    const data = await loadData();
    const found = data.exchangeRates.find(r => r.type === type);
    if (!found) return null;
    Object.assign(found, rate, { updatedAt: new Date().toISOString() });
    await saveData(data);
    return found;
  }

  async getIndicators() {
    return (await loadData()).indicators;
  }

  async getChartData() {
    return (await loadData()).charts;
  }

  async addChartDataPoint(point: ChartDataPoint) {
    const data = await loadData();
    data.charts.push(point);
    await saveData(data);
    return point;
  }

  async getMarketQuotes() {
    return (await loadData()).market;
  }

  async getNews() {
    return (await loadData()).news;
  }
}

export const storage = new FileStorage();
