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

// Authentification
import AuthForm from "./components/auth/AuthForm";

// Pages admin
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminRequestsPage from "./pages/admin/AdminRequestsPage";

// Pages visiteur
import VisitorDashboardPage from "./pages/visiteur/VisitorDashboardPage";
import VisitorNewsPage from "./pages/visiteur/VisitorNewsPage";
import VisitorLearnPage from "./pages/visiteur/VisitorLearnPage";
import VisitorMapPage from "./pages/visiteur/VisitorMapPage";
import VisitorAIDemoPage from "./pages/visiteur/VisitorAIDemoPage";
import AgriculteurRequestPage from "./pages/visiteur/AgriculteurRequestPage";

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
          {/* Routes visiteur - Prioritaires */}
          <Route path="/" element={<VisitorDashboardPage />} />
          <Route path="/visitor/dashboard" element={<VisitorDashboardPage />} />
          <Route path="/visitor/actualites" element={<VisitorNewsPage />} />
          <Route path="/visitor/apprendre" element={<VisitorLearnPage />} />
          <Route path="/visitor/carte" element={<VisitorMapPage />} />
          <Route path="/visitor/demo-ia" element={<VisitorAIDemoPage />} />
          <Route path="/visitor/demande-agriculteur" element={<AgriculteurRequestPage />} />
          
          {/* Authentification */}
          <Route path="/login" element={<AuthForm />} />
          <Route path="/register" element={<AuthForm />} />
          
          {/* Routes admin */}
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/demandes-agriculteurs" element={<AdminRequestsPage />} />
          
          {/* Routes agriculteur */}
          <Route path="/agriculteur/dashboard" element={<Index />} />
          
          {/* Routes principales (legacy) */}
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
