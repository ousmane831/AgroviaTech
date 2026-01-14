import { ReactNode } from 'react';
import { VisitorSidebar } from './VisitorSidebar';
import { Header } from './Header';
import { Clock } from 'lucide-react';

interface VisitorLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function VisitorLayout({ children, title, subtitle }: VisitorLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <VisitorSidebar />

      <div className="lg:ml-64">
        <Header title={title} subtitle={subtitle} />

        <main className="p-4 lg:p-6">
          {/* Badge Marché */}
          <div className="mb-6 bg-green-100 border border-green-200 rounded-lg p-3 flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />

            <span className="text-sm text-green-800 font-semibold">
              Marché agricole
            </span>

            <span className="text-xs text-green-700">
              • Prix des cultures mis à jour en temps réel
            </span>

            <div className="ml-auto flex items-center gap-1 text-xs text-green-600">
              <Clock size={14} />
              <span>Mise à jour continue</span>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
