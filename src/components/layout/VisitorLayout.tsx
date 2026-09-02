import { ReactNode } from 'react';
import { VisitorSidebar } from './VisitorSidebar';
import { Header } from './Header';
import { Clock, TrendingUp } from 'lucide-react';

interface VisitorLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function VisitorLayout({ children, title, subtitle }: VisitorLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f3f1ee] relative overflow-x-hidden">
      <VisitorSidebar />

      <div className="relative z-10 lg:ml-64">
        <Header title={title} subtitle={subtitle} />

        <main className="animate-fade-in px-3 pb-8 pt-4 sm:px-4 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 rounded-[18px] border border-[#2e5a3b]/50 bg-white/85 px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#2ea75c] shadow-[0_0_0_4px_rgba(46,167,92,0.15)]" />
                <TrendingUp className="h-4 w-4 text-[#1d4d2d]" />
                <span className="text-sm font-semibold text-[#1d2a22] sm:text-[1.05rem]">Marché agricole</span>
              </div>
              <span className="text-xs text-[#5d665e] sm:text-[0.95rem]">Prix des cultures mis à jour en temps réel</span>
            </div>

            <div className="flex items-center gap-2 text-[0.75rem] text-[#4c5a52] sm:text-[0.85rem]">
              <Clock size={14} className="text-[#1d4d2d]" />
              <span>Mis à jour à 08:24:28</span>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
