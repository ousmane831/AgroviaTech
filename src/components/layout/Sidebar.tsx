import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Logo from "../../../assets/logo_agrotech.png";
import {
  LayoutDashboard,
  MapPin,
  Wheat,
  TrendingUp,
  Bell,
  Brain,
  Settings,
  Menu,
  X,
  Leaf,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Navigation items pour AgroviaTech - Espace agriculteur
const navItems = [
  { path: '/agriculteur/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { path: '/agriculteur/parcels', icon: MapPin, label: 'Parcelles' },
  { path: '/agriculteur/harvests', icon: Wheat, label: 'Récoltes' },
  { path: '/agriculteur/statistics', icon: TrendingUp, label: 'Statistiques' },
  { path: '/agriculteur/alerts', icon: Bell, label: 'Alertes' },
  { path: '/visitor/market', icon: ShoppingBag, label: 'AgroviaMarket' },
  { path: '/predictions', icon: Brain, label: 'Prédictions IA' },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bouton mobile pour ouvrir le menu */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 transform bg-gradient-to-b from-primary to-primary/90 border-r border-primary/20 transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        <div className="flex h-full flex-col">

         {/* Logo et titre */}
          <div className="flex h-16 items-center gap-3 border-b border-primary/20 px-6">
            {/* Logo */}
            <div className="h-10 w-10 overflow-hidden rounded-md bg-white/20 shadow-glow">
              <img
                src={Logo}
                alt="Logo AgroviaTech"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">AgroviaTech</span>
              <span className="text-xs text-primary-foreground/70">Espace Agriculteur</span>
            </div>
          </div>


          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover-lift',
                    isActive
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-primary-foreground/80 hover:bg-white/10 hover:text-white'
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Footer avec paramètres */}
          <div className="border-t border-primary/20 p-3">
            <NavLink
              to="/parametres"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover-lift',
                  isActive
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-primary-foreground/80 hover:bg-white/10 hover:text-white'
                )
              }
            >
              <Settings className="h-5 w-5" />
              Paramètres
            </NavLink>
            <div className="mt-4 rounded-lg bg-white/10 p-3 backdrop-blur-sm">
              <p className="text-xs text-white font-medium">
                Mode Démonstration
              </p>
              <p className="text-xs text-primary-foreground/70">
                Données simulées actives
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
