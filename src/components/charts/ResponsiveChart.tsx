'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveChartProps {
  children: ReactNode;
  height?: number;
  className?: string;
}

export function ResponsiveChart({ children, height = 220, className }: ResponsiveChartProps) {
  return (
    <div
      className={cn('w-full', className)}
      style={{ height: `${height}px` }}
    >
      {children}
    </div>
  );
}

export default ResponsiveChart;
