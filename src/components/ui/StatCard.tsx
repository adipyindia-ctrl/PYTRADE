import { cn } from '@/lib/utils';
import { Card } from './Card';
import type { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  changePositive,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</span>
        {Icon && (
          <span className="p-1.5 bg-blue-50 rounded-lg">
            <Icon className="h-4 w-4 text-pytrade-blue" />
          </span>
        )}
      </div>
      <span className="text-xl font-bold text-pytrade-navy mt-1">{value}</span>
      {change !== undefined && (
        <span
          className={cn(
            'inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full w-fit',
            changePositive
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          )}
        >
          {changePositive ? '▲' : '▼'} {change}
        </span>
      )}
    </Card>
  );
}

export default StatCard;
