import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-surface relative overflow-x-hidden">
      {/* Decorative circles */}
      <div className="decorative-circles hidden md:block">
        <div className="decorative-circle green animate-float" style={{ width: '350px', height: '350px', top: '5%', right: '10%' }} />
        <div className="decorative-circle grey animate-pulse-glow" style={{ width: '250px', height: '250px', bottom: '15%', left: '8%' }} />
        <div className="decorative-circle accent animate-float" style={{ width: '180px', height: '180px', top: '40%', left: '5%', animationDelay: '3s' }} />
        <div className="decorative-circle green animate-pulse-glow" style={{ width: '220px', height: '220px', bottom: '30%', right: '15%', animationDelay: '1.5s' }} />
      </div>

      <Sidebar />
      <div className="relative z-10 lg:ml-64">
        <Header title={title} subtitle={subtitle} />
        <main className="animate-fade-in px-3 pb-6 pt-4 sm:px-4 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
