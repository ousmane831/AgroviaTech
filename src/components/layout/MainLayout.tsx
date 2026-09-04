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
    <div className="min-h-screen overflow-x-hidden bg-[#f5f7f5]">
      <Sidebar />
      <div className="relative z-10 lg:ml-64">
        <Header title={title} subtitle={subtitle} />
        <main className="animate-fade-in px-3 pb-6 pt-4 sm:px-4 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
