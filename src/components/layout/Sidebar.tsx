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
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Navigation items pour AgroviaTech
const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
  { path: '/parcelles', icon: MapPin, label: 'Parcelles' },
  { path: '/recoltes', icon: Wheat, label: 'Récoltes' },
  { path: '/statistiques', icon: TrendingUp, label: 'Statistiques' },
  { path: '/alertes', icon: Bell, label: 'Alertes' },
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
          'fixed left-0 top-0 z-40 h-screen w-64 transform bg-sidebar transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        <div className="flex h-full flex-col">

         {/* Logo et titre */}
<div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">

  {/* Logo */}
  <div className="h-18 w-18 overflow-hidden rounded-md bg-transparent">
    <img
      src={Logo}
      alt="Logo AgroviaTech"
      className="h-full w-full object-cover"
    />
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
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Footer avec paramètres */}
          <div className="border-t border-sidebar-border p-3">
            <NavLink
              to="/parametres"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )
              }
            >
              <Settings className="h-5 w-5" />
              Paramètres
            </NavLink>
            <div className="mt-4 rounded-lg bg-sidebar-accent/30 p-3">
              <p className="text-xs text-sidebar-foreground/70">
                Mode Démonstration
              </p>
              <p className="text-xs font-medium text-sidebar-primary">
                Données simulées actives
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
