import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Logo from "../../../assets/logo_agrotech.png";
import {
  LayoutDashboard,
  ShoppingBag,
  Leaf,
  BriefcaseBusiness,
  MessageSquareText,
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
  { path: '/visitor/market', icon: ShoppingBag, label: 'AgroviaMarket' },
  { path: '/visitor/market/harvest', icon: Leaf, label: 'Déclarer une récolte' },
  { path: '/visitor/market/buyer', icon: BriefcaseBusiness, label: 'Publier un besoin' },
  { path: '/visitor/market/matches', icon: MessageSquareText, label: 'Matchs & négociation' },
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
        className="fixed left-3 top-3 z-50 rounded-full border border-white/20 bg-[#1e5a36] text-white shadow-lg lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Visiteur */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-[82vw] max-w-[280px] transform bg-[#1e5a36] border-r border-[#234b2f] transition-transform duration-300 ease-in-out lg:w-[260px] lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        <div className="flex h-full flex-col">

          <div className="flex h-[92px] items-center gap-3 border-b border-[#2a6a42] px-5">
            <div className="h-10 w-10 overflow-hidden rounded-md bg-[#f4f1eb] shadow-sm">
              <img
                src={Logo}
                alt="Logo AgroviaTech"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[1.05rem] font-bold text-white">AgroviaTech</span>
              <span className="text-[0.7rem] text-[#d6eadb]">Espace Visiteur</span>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-3 py-4">
            {visitorNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-3 text-[0.98rem] font-medium transition-all duration-200 relative',
                    isActive
                      ? 'bg-[#f3f7f2] text-[#1d4d2d] shadow-sm'
                      : 'text-[#edf6ee] hover:bg-white/10 hover:text-white'
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-[#d7a63d] px-2 py-0.5 text-[0.65rem] font-semibold text-[#243d2e]">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-[#2a6a42] p-3 space-y-2">
            <Button
              className="w-full justify-start gap-2 rounded-xl bg-white text-[#1d4d2d] hover:bg-[#edf6ee] shadow-lg transition-all duration-200"
              onClick={handleDevenirAgriculteur}
            >
              <UserPlus className="h-4 w-4" />
              <span className="font-medium">Devenir Agriculteur</span>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-2 rounded-xl border-white/30 bg-transparent text-[#edf6ee] hover:bg-white/10 hover:border-white/50 transition-all duration-200"
              onClick={handleSeConnecter}
            >
              <LogIn className="h-4 w-4" />
              <span className="font-medium">Se Connecter</span>
            </Button>

            <div className="rounded-xl bg-[#f1f8f3]/10 p-3 backdrop-blur-sm">
              <p className="text-xs font-medium text-white">Mode Visiteur</p>
              <p className="text-[0.7rem] text-[#dfeee2]">Accès public limité</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
