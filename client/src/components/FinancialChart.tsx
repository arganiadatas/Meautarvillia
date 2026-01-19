import { useEffect, useRef } from 'react';
import { createChart, ColorType, ISeriesApi } from 'lightweight-charts';

interface ChartProps {
  data: { time: string; value: number }[];
  title?: string;
  color?: string;
  height?: number;
}

export function FinancialChart({ data, title, color = '#2962FF', height = 300 }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
    });

    const newSeries = chart.addAreaSeries({
      lineColor: color,
      topColor: color,
      bottomColor: 'rgba(41, 98, 255, 0)',
    });

    // Ensure data is sorted by time
    const sortedData = [...data].sort((a, b) => 
      new Date(a.time).getTime() - new Date(b.time).getTime()
    );
    
    newSeries.setData(sortedData);
    chart.timeScale().fitContent();

    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, color, height]);

  return (
    <div className="w-full h-full flex flex-col glass-card rounded-xl overflow-hidden p-4">
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
      <div ref={chartContainerRef} className="w-full flex-grow" />
    </div>
  );
}
