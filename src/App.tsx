import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Parcelles from "./pages/Parcelles";
import Recoltes from "./pages/Recoltes";
import Statistiques from "./pages/Statistiques";
import Alertes from "./pages/Alertes";
import Predictions from "./pages/Predictions";
import Parametres from "./pages/Parametres";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/**
 * Application principale AgroviaTech
 * Solution de gestion agricole avec tableau de bord, parcelles, récoltes,
 * statistiques, alertes et prédictions IA
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/parcelles" element={<Parcelles />} />
          <Route path="/recoltes" element={<Recoltes />} />
          <Route path="/statistiques" element={<Statistiques />} />
          <Route path="/alertes" element={<Alertes />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/parametres" element={<Parametres />} />
          {/* Route 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
