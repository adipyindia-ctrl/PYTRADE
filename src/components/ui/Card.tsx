import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: boolean;
}

export function Card({ className, padding = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-100',
        padding && 'p-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface DashboardCardProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DashboardCard({ title, action, children, className }: DashboardCardProps) {
  return (
    <Card className={className}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-3">
          {title && (
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              {title}
            </h3>
          )}
          {action && <div className="flex items-center">{action}</div>}
        </div>
      )}
      {children}
    </Card>
  );
}

export default Card;
