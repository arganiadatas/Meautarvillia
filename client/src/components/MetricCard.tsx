import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  trend?: "up" | "down" | "stable";
  change?: string;
  subtitle?: string;
  className?: string;
}

export function MetricCard({ title, value, trend, change, subtitle, className }: MetricCardProps) {
  return (
    <div className={cn(
      "glass-card p-6 rounded-xl hover:bg-card/70 transition-colors duration-300",
      className
    )}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</h4>
        {trend && (
          <div className={cn(
            "flex items-center text-xs font-bold px-2 py-1 rounded-full",
            trend === 'up' && "bg-green-500/10 text-green-500",
            trend === 'down' && "bg-red-500/10 text-red-500",
            trend === 'stable' && "bg-blue-500/10 text-blue-500",
          )}>
            {trend === 'up' && <ArrowUp className="w-3 h-3 mr-1" />}
            {trend === 'down' && <ArrowDown className="w-3 h-3 mr-1" />}
            {trend === 'stable' && <Minus className="w-3 h-3 mr-1" />}
            {change || trend.toUpperCase()}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono text-white">{value}</span>
      </div>
      
      {subtitle && (
        <p className="mt-2 text-xs text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
