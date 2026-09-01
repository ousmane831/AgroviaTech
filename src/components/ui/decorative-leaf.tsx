import { cn } from '@/lib/utils';

interface DecorativeLeafProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'accent' | 'grey';
}

export function DecorativeLeaf({ className, size = 'md', color = 'green' }: DecorativeLeafProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const colorClasses = {
    green: 'text-primary/20',
    accent: 'text-accent/20',
    grey: 'text-muted-foreground/20',
  };

  return (
    <svg
      className={cn(
        sizeClasses[size],
        colorClasses[color],
        'animate-float',
        className
      )}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C12 2 6 8 6 14C6 20 12 22 12 22C12 22 18 18 18 14C18 8 12 2 12 2Z" />
      <path d="M12 2C12 2 16 6 16 10C16 14 12 18 12 18C12 18 8 14 8 10C8 6 12 2 12 2Z" opacity="0.5" />
    </svg>
  );
}
