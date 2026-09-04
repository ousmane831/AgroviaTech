import { Bell, User, LogOut, Settings, LayoutDashboard, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { alertes } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { useAuthComplete } from '@/hooks/useAuthComplete';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthComplete();
  const alertesActives = alertes.filter((a) => a.statut === 'active').length;

  const profilePath = user?.role === 'ADMIN'
    ? '/admin/dashboard'
    : user?.role === 'AGRICULTEUR'
      ? '/agriculteur/profile'
      : '/visitor/dashboard';

  const dashboardPath = user?.role === 'ADMIN'
    ? '/admin/dashboard'
    : user?.role === 'AGRICULTEUR'
      ? '/agriculteur/dashboard'
      : '/visitor/dashboard';

  const displayName = user ? `${user.prenom || ''} ${user.nom || ''}`.trim() || user.email : 'Compte';

  return (
    <header className="sticky top-0 z-30 flex min-h-[88px] flex-col gap-3 border-b border-[#dfe5df] bg-[#f3f3f1]/95 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-[#f3f3f1]/80 sm:flex-row sm:items-center sm:justify-between sm:px-4 lg:h-24 lg:px-8">
      <div className="ml-12 sm:ml-0">
        <h1 className="text-xl font-semibold tracking-[-0.04em] text-[#1d2a22] leading-none sm:text-2xl lg:text-[2.2rem]">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-sm text-[#5a665f] font-normal lg:text-[1.05rem]">{subtitle}</p>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2 sm:ml-0 sm:gap-3">
        {user && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-10 w-10 rounded-full border border-[#dfe5df] bg-white text-[#1e2d25] shadow-sm transition-colors hover:bg-[#eef7f0] hover:text-[#1d4d2d] sm:h-11 sm:w-11"
            onClick={() => navigate('/agriculteur/alerts')}
            title="Voir les alertes"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            {alertesActives > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[9px] animate-pulse sm:h-5 sm:w-5"
              >
                {alertesActives}
              </Badge>
            )}
          </Button>
        )}

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto rounded-full border border-[#dfe5df] bg-white px-2 py-2 shadow-sm transition-all hover:bg-[#eef7f0] active:scale-[0.98] sm:px-3"
                title="Mon compte"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#d7e7d6] to-[#b2cdb2] text-[#1d4d2d] font-semibold text-xs shadow-inner sm:h-9 sm:w-9 sm:text-sm">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <span className="hidden text-sm font-medium text-[#1d2a22] sm:inline">{displayName}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-[220px] rounded-2xl border-[#dfe5df] bg-white p-2 shadow-xl"
            >
              <DropdownMenuLabel className="px-2 py-2 text-sm font-semibold text-[#1d2a22]">
                {displayName}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#edf1ee]" />

              <DropdownMenuItem onClick={() => navigate(profilePath)} className="cursor-pointer rounded-xl px-2 py-2 text-sm">
                <Settings className="mr-2 h-4 w-4" />
                Profil
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate(dashboardPath)} className="cursor-pointer rounded-xl px-2 py-2 text-sm">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Tableau de bord
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-[#edf1ee]" />

              <DropdownMenuItem
                onClick={() => logout()}
                className="cursor-pointer rounded-xl px-2 py-2 text-sm text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="outline"
            className="rounded-full border-[#dfe5df] bg-white px-3 py-2 text-sm font-medium text-[#1d4d2d] hover:bg-[#eef7f0]"
            onClick={() => navigate('/login')}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Connexion
          </Button>
        )}
      </div>
    </header>
  );
}
