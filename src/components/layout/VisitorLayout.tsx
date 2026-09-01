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
    <div className="min-h-screen bg-[#f3f1ee] relative overflow-hidden">
      <VisitorSidebar />

      <div className="lg:ml-64 relative z-10">
        <Header title={title} subtitle={subtitle} />

        <main className="animate-fade-in px-6 pb-8 pt-5 lg:px-8">
          <div className="mb-7 flex items-center justify-between gap-3 rounded-[18px] border border-[#2e5a3b]/50 bg-white/85 px-5 py-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-3.5 w-3.5 rounded-full bg-[#2ea75c] shadow-[0_0_0_4px_rgba(46,167,92,0.15)]" />
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#1d4d2d]" />
                <span className="text-[1.05rem] font-semibold text-[#1d2a22]">Marché agricole</span>
              </div>
              <span className="text-[0.95rem] text-[#5d665e]">• Prix des cultures mis à jour en temps réel</span>
            </div>

            <div className="hidden items-center gap-2 text-[0.85rem] text-[#4c5a52] sm:flex">
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
