import { 
  useExchangeRates, 
  useIndicators, 
  useChartData,
  useNews
} from "@/hooks/use-dashboard";
import { FinancialChart } from "@/components/FinancialChart";
import { MetricCard } from "@/components/MetricCard";
import { format } from "date-fns";
import { Loader2, TrendingUp, AlertCircle, Building2, Newspaper } from "lucide-react";

export default function Dashboard() {
  const { data: rates, isLoading: ratesLoading } = useExchangeRates();
  const { data: indicators, isLoading: indicatorsLoading } = useIndicators();
  const { data: chartData, isLoading: chartsLoading } = useChartData();
  const { data: news, isLoading: newsLoading } = useNews();

  const isLoading = ratesLoading || indicatorsLoading || chartsLoading || newsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground font-mono text-sm">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Market Overview</h1>
          <p className="text-muted-foreground mt-1">Real-time financial indicators and economic data.</p>
        </div>
        <div className="text-sm font-mono text-muted-foreground">
          Updated: {format(new Date(), "MMM dd, HH:mm:ss")}
        </div>
      </div>

      {/* Exchange Rates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {rates?.map((rate) => (
          <div key={rate.id} className="glass-card p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-16 h-16" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">{rate.type} Dollar</h3>
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Buy</p>
                <p className="text-2xl font-bold font-mono text-white">${rate.buy}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Sell</p>
                <p className="text-2xl font-bold font-mono text-white">${rate.sell}</p>
              </div>
            </div>
            <div className={`mt-4 text-xs font-medium px-2 py-1 rounded inline-block ${
              rate.trend === 'up' ? 'bg-green-500/10 text-green-500' : 
              rate.trend === 'down' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
            }`}>
              Trend: {rate.trend?.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Indicators & Info */}
        <div className="space-y-8">
          {/* Central Bank Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Central Bank Data</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {indicators?.filter(i => i.category === 'central_bank').map(indicator => (
                <div key={indicator.id} className="glass-card p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">{indicator.label}</p>
                    <p className="text-lg font-bold font-mono text-white">{indicator.value}</p>
                  </div>
                  {indicator.trend && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      indicator.trend.includes('↓') ? 'bg-red-500/10 text-red-500' : 
                      indicator.trend.includes('↑') ? 'bg-green-500/10 text-green-500' : 'bg-white/5'
                    }`}>
                      {indicator.trend}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Risk & Debt Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-bold">Risk & Debt</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {indicators?.filter(i => i.category === 'debt').map(indicator => (
                <div key={indicator.id} className="glass-card p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm text-muted-foreground">{indicator.label}</p>
                    <p className="text-lg font-bold font-mono text-white">{indicator.value}</p>
                  </div>
                  {indicator.description && (
                    <p className="text-xs text-muted-foreground/60">{indicator.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Middle & Right Column - Charts */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Economic Indicators
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {chartData && Object.entries(chartData).map(([key, data]) => {
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
              const title = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
              return (
                <FinancialChart 
                  key={key}
                  title={title} 
                  description={descriptions[title] || descriptions[key]}
                  data={data}
                  height={280}
                  color={
                    key === 'inflation' ? '#EF4444' : 
                    key === 'gdp' ? '#10B981' : 
                    '#3B82F6'
                  }
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* News Section */}
      <section className="pt-8 border-t border-white/5">
        <div className="flex items-center gap-2 mb-6">
          <Newspaper className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Official Government News</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news?.map((item) => (
            <article key={item.id} className="glass-card p-6 rounded-xl hover:bg-card/70 transition-colors cursor-pointer group">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {item.source}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.publishedAt ? format(new Date(item.publishedAt), "MMM dd, yyyy") : "Just now"}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {item.content}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
