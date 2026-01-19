import { Link } from "wouter";
import { LayoutDashboard, TrendingUp, Newspaper, Activity } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              F
            </div>
            <span className="text-xl font-display font-bold text-white tracking-tight">
              FinBoard<span className="text-primary">.ar</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link href="/markets" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Markets
            </Link>
            <Link href="/news" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors flex items-center gap-2">
              <Newspaper className="w-4 h-4" /> News
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-muted-foreground">Market Open</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
