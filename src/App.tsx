import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthComplete } from "@/hooks/useAuthComplete";
import { ROLE_REDIRECTS, UserRole } from "@/types/auth";
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

// Pages visiteur
import VisitorDashboardPage from "./pages/visiteur/VisitorDashboardPage";
import AgriculteurRequestPage from "./pages/visiteur/AgriculteurRequestPage";
import AgroviaMarketPage from "./pages/AgroviaMarketPage";
import AgroviaMarketHarvestPage from "./pages/AgroviaMarketHarvestPage";
import AgroviaMarketBuyerPage from "./pages/AgroviaMarketBuyerPage";
import AgroviaMarketMatchesPage from "./pages/AgroviaMarketMatchesPage";

const queryClient = new QueryClient();

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}) => {
  const { isAuthenticated, user, isLoading } = useAuthComplete();

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Chargement...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_REDIRECTS[user.role] || "/visitor/dashboard"} replace />;
  }

  return <>{children}</>;
};

const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

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
          <Route path="/visitor/market" element={<ProtectedRoute allowedRoles={['AGRICULTEUR', 'VISITEUR']}><AgroviaMarketPage /></ProtectedRoute>} />
          <Route path="/visitor/market/harvest" element={<ProtectedRoute allowedRoles={['AGRICULTEUR']}><AgroviaMarketHarvestPage /></ProtectedRoute>} />
          <Route path="/visitor/market/buyer" element={<ProtectedRoute allowedRoles={['VISITEUR']}><AgroviaMarketBuyerPage /></ProtectedRoute>} />
          <Route path="/visitor/market/matches" element={<ProtectedRoute allowedRoles={['AGRICULTEUR', 'VISITEUR']}><AgroviaMarketMatchesPage /></ProtectedRoute>} />
          <Route path="/visitor/demande-agriculteur" element={<AgriculteurRequestPage />} />
          
          {/* Authentification */}
          <Route path="/login" element={<AuthForm />} />
          <Route path="/register" element={<AuthForm />} />
          
          {/* Routes admin */}
          <Route
            path="/admin/dashboard"
            element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboardPage /></ProtectedRoute>}
          />
          
          {/* Routes agriculteur */}
          <Route
            path="/agriculteur/dashboard"
            element={<ProtectedRoute allowedRoles={['AGRICULTEUR']}><Index /></ProtectedRoute>}
          />
          <Route
            path="/agriculteur/parcels"
            element={<ProtectedRoute allowedRoles={['AGRICULTEUR']}><Parcelles /></ProtectedRoute>}
          />
          <Route
            path="/agriculteur/harvests"
            element={<ProtectedRoute allowedRoles={['AGRICULTEUR']}><Recoltes /></ProtectedRoute>}
          />
          <Route
            path="/agriculteur/alerts"
            element={<ProtectedRoute allowedRoles={['AGRICULTEUR']}><Alertes /></ProtectedRoute>}
          />
          <Route
            path="/agriculteur/statistics"
            element={<ProtectedRoute allowedRoles={['AGRICULTEUR']}><Statistiques /></ProtectedRoute>}
          />
          <Route
            path="/agriculteur/profile"
            element={<ProtectedRoute allowedRoles={['AGRICULTEUR']}><Parametres /></ProtectedRoute>}
          />
          <Route
            path="/agriculteur/settings"
            element={<ProtectedRoute allowedRoles={['AGRICULTEUR']}><Parametres /></ProtectedRoute>}
          />
          
          {/* Routes principales (legacy) */}
          <Route path="/parcelles" element={<ProtectedRoute allowedRoles={['AGRICULTEUR']}><Parcelles /></ProtectedRoute>} />
          <Route path="/recoltes" element={<ProtectedRoute allowedRoles={['AGRICULTEUR']}><Recoltes /></ProtectedRoute>} />
          <Route path="/statistiques" element={<ProtectedRoute allowedRoles={['AGRICULTEUR']}><Statistiques /></ProtectedRoute>} />
          <Route path="/alertes" element={<ProtectedRoute allowedRoles={['AGRICULTEUR']}><Alertes /></ProtectedRoute>} />
          <Route path="/predictions" element={<ProtectedRoute allowedRoles={['AGRICULTEUR']}><Predictions /></ProtectedRoute>} />
          <Route path="/parametres" element={<ProtectedRoute allowedRoles={['AGRICULTEUR']}><Parametres /></ProtectedRoute>} />
          
          {/* Route 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
