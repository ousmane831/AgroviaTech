import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { alertes } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const navigate = useNavigate();
  const alertesActives = alertes.filter((a) => a.statut === 'active').length;

  return (
    <header className="sticky top-0 z-30 flex h-24 items-center justify-between border-b border-[#dfe5df] bg-[#f3f3f1]/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-[#f3f3f1]/80 lg:px-8">
      <div className="ml-12 lg:ml-0">
        <h1 className="text-[2.2rem] font-semibold tracking-[-0.04em] text-[#1d2a22] leading-none">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-[1.05rem] text-[#5a665f] font-normal">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-11 w-11 rounded-full border border-[#dfe5df] bg-white text-[#1e2d25] shadow-sm hover:bg-[#eef7f0] hover:text-[#1d4d2d] transition-colors"
          onClick={() => navigate('/agriculteur/alerts')}
          title="Voir les alertes"
        >
          <Bell className="h-5 w-5" />
          {alertesActives > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center animate-pulse"
            >
              {alertesActives}
            </Badge>
          )}
        </Button>

        <Button 
          variant="ghost" 
          size="icon"
          className="h-11 w-11 rounded-full border border-[#dfe5df] bg-white p-0 shadow-sm hover:bg-[#eef7f0] transition-colors"
          onClick={() => navigate('/agriculteur/profile')}
          title="Paramètres du compte"
        >
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#d7e7d6] to-[#b2cdb2] text-[#1d4d2d] font-semibold text-sm">
            <User className="h-4 w-4" />
          </div>
        </Button>
      </div>
    </header>
  );
}
