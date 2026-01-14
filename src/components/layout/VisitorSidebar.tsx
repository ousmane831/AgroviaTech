import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Logo from "../../../assets/logo_agrotech.png";
import {
  Newspaper,
  LayoutDashboard,
  BookOpen,
  Map,
  Bot,
  UserPlus,
  LogIn,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VisitorMenuItem } from '@/types/visitor';

// Navigation items pour le rôle visiteur
const visitorNavItems: VisitorMenuItem[] = [
  { path: '/visitor/dashboard', icon: LayoutDashboard, label: 'Dashboard Public' },
  { path: '/visitor/actualites', icon: Newspaper, label: 'Actualités' },
  { path: '/visitor/apprendre', icon: BookOpen, label: 'Apprendre' },
  { path: '/visitor/carte', icon: Map, label: 'Carte Agricole' },
  { path: '/visitor/demo-ia', icon: Bot, label: 'IA Démo', badge: 'Nouveau' },
];

interface VisitorSidebarProps {
  className?: string;
}

export function VisitorSidebar({ className }: VisitorSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleDevenirAgriculteur = () => {
    navigate('/login');
    setIsOpen(false);
  };

  const handleSeConnecter = () => {
    navigate('/login');
    setIsOpen(false);
  };

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

      {/* Sidebar Visiteur */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 transform bg-gradient-to-b from-green-600 to-green-700 border-r border-green-800 transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        <div className="flex h-full flex-col">

         {/* Logo et titre */}
          <div className="flex h-16 items-center gap-3 border-b border-green-800 px-6">
            <div className="h-10 w-10 overflow-hidden rounded-md bg-white/20">
              <img
                src={Logo}
                alt="Logo AgroviaTech"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">AgroviaTech</span>
              <span className="text-xs text-green-100">Espace Visiteur</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {visitorNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative',
                    isActive
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-green-100 hover:bg-white/10 hover:text-white'
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer avec actions */}
          <div className="border-t border-green-800 p-3 space-y-2">
            <Button
              className="w-full justify-start gap-2 bg-white text-green-700 hover:bg-green-50 shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={handleDevenirAgriculteur}
            >
              <UserPlus className="h-4 w-4" />
              <span className="font-medium">Devenir Agriculteur</span>
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-white/30 text-green-700 hover:bg-white/20 hover:border-white/50 transform hover:scale-105 transition-all duration-200"
              onClick={handleSeConnecter}
            >
              <LogIn className="h-4 w-4" />
              <span className="font-medium">Se Connecter</span>
            </Button>

            <div className="rounded-lg bg-white/10 p-3">
              <p className="text-xs text-white font-medium">
                Mode Visiteur
              </p>
              <p className="text-xs text-green-100">
                Accès public limité
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
