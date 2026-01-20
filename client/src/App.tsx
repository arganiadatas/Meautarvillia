import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { MarketTicker } from "@/components/MarketTicker";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/markets" component={Dashboard} /> {/* Placeholder for now */}
      <Route path="/news" component={Dashboard} />    {/* Placeholder for now */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
          <Toaster />
          <Navbar />
          <MarketTicker />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Router />
          </main>
          
          <footer className="border-t border-white/5 bg-card/30 backdrop-blur-md py-8 mt-12">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              <p>© 2026 OFAE.Me - Oficina de Analisis Economicos</p>
              <p className="mt-2 text-xs opacity-60">Datos oficiales de la República Meautarvillia.</p>
            </div>
          </footer>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
