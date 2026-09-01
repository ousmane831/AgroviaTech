import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
  annee?: number;
}

const variantStyles = {
  default: 'bg-gradient-to-br from-muted to-muted/80 text-muted-foreground',
  primary: 'bg-gradient-to-br from-primary/20 to-primary/10 text-primary shadow-glow',
  success: 'bg-gradient-to-br from-success/20 to-success/10 text-success',
  warning: 'bg-gradient-to-br from-warning/20 to-warning/10 text-warning',
  destructive: 'bg-gradient-to-br from-destructive/20 to-destructive/10 text-destructive',
};

const variantBorderStyles = {
  default: 'border-muted/30',
  primary: 'border-primary/30',
  success: 'border-success/30',
  warning: 'border-warning/30',
  destructive: 'border-destructive/30',
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  annee,
}: StatCardProps) {
  return (
    <Card className={cn(
      'animate-fade-in flex h-full min-h-[220px] flex-col justify-between rounded-[26px] border-[2px] border-[#1d4d2d] bg-[#f7f5f3] p-0 shadow-none',
      variantBorderStyles[variant]
    )}>
      <CardContent className="flex h-full flex-col justify-between px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col justify-start">
            <p className="text-[1.05rem] font-medium text-[#1d2a22]">{title}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#1d4d2d] text-white shadow-sm">
            <Icon className="h-6 w-6" />
          </div>
        </div>

        <div className="mt-1 space-y-0.5">
          <p className="whitespace-pre-line text-[2.2rem] font-semibold leading-[1.1] tracking-[-0.05em] text-[#1d2a22] lg:text-[2.6rem]">
            {value}
          </p>
        </div>

        {subtitle && (
          <p className="mt-2 text-[0.9rem] text-[#5d665e]">{subtitle}</p>
        )}

        {annee && (
          <p className="text-xs text-muted-foreground">Année: {annee}</p>
        )}

        {trend && (
          <div className="mt-2 flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-bold',
                trend.isPositive 
                  ? 'bg-success/20 text-success' 
                  : 'bg-destructive/20 text-destructive'
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">vs mois dernier</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
