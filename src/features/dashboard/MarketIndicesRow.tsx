'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/ui';
import { MiniChart } from '@/components/charts/MiniChart';
import { mockIndices } from '@/mocks/indices';
import { formatPercent } from '@/lib/formatters';
import { cn } from '@/lib/utils';

export function MarketIndicesRow() {
  return (
    <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
      <div className="flex flex-row gap-3 snap-x snap-mandatory w-max lg:w-auto lg:grid lg:grid-cols-4">
        {mockIndices.map((index) => {
          const positive = index.changePercent >= 0;
          return (
            <Card
              key={index.id}
              className={cn(
                'min-w-[160px] lg:min-w-0 snap-start flex flex-col gap-1 p-3',
                'cursor-default select-none'
              )}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  DEMO DATA
                </span>
              </div>
              <p className="text-xs font-medium text-gray-500 truncate">{index.name}</p>
              <p className="text-lg font-bold text-pytrade-navy leading-tight">
                {index.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
              <div
                className={cn(
                  'flex items-center gap-0.5 text-xs font-semibold',
                  positive ? 'text-positive' : 'text-negative'
                )}
              >
                {positive ? (
                  <ArrowUpRight className="h-3 w-3 shrink-0" aria-hidden="true" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 shrink-0" aria-hidden="true" />
                )}
                <span>
                  {index.change >= 0 ? '+' : ''}
                  {index.change.toFixed(2)} ({formatPercent(index.changePercent)})
                </span>
              </div>
              <div className="mt-1 h-[48px]">
                <MiniChart data={index.chartData} positive={positive} height={48} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default MarketIndicesRow;
