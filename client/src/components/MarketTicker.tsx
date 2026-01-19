import { useMarketQuotes } from "@/hooks/use-dashboard";
import { ArrowUp, ArrowDown } from "lucide-react";

export function MarketTicker() {
  const { data: quotes, isLoading } = useMarketQuotes();

  if (isLoading || !quotes) return <div className="h-10 w-full bg-card/50 animate-pulse" />;

  return (
    <div className="w-full bg-card border-y border-white/5 overflow-hidden">
      <div className="flex animate-scroll whitespace-nowrap py-2">
        {/* Duplicate list for seamless loop */}
        {[...quotes, ...quotes].map((quote, i) => (
          <div key={`${quote.symbol}-${i}`} className="inline-flex items-center mx-6 gap-3">
            <span className="font-mono font-bold text-sm text-white">{quote.symbol}</span>
            <span className="font-mono text-sm text-muted-foreground">${quote.price}</span>
            <span className={`text-xs font-bold flex items-center ${
              Number(quote.changePercent) >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {Number(quote.changePercent) >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {Math.abs(Number(quote.changePercent))}%
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
