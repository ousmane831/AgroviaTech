import { ReactNode } from 'react';
import { VisitorSidebar } from './VisitorSidebar';
import { Header } from './Header';

interface VisitorLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function VisitorLayout({ children, title, subtitle }: VisitorLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f5f7f5] relative overflow-x-hidden">
      <VisitorSidebar />

      <div className="relative z-10 lg:ml-64">
        <Header title={title} subtitle={subtitle} />

        <main className="animate-fade-in px-3 pb-8 pt-6 sm:px-4 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
