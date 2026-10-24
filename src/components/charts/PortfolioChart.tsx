'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import { formatINR } from '@/lib/formatters';

type TimeRange = '1W' | '1M' | '3M' | '6M' | '1Y';

const TIME_RANGES: TimeRange[] = ['1W', '1M', '3M', '6M', '1Y'];

const SLICE_MAP: Record<TimeRange, number> = {
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '6M': 180,
  '1Y': 365,
};

interface DataPoint {
  date: string;
  value: number;
}

interface PortfolioChartProps {
  data: DataPoint[];
  className?: string;
}

interface TooltipPayload {
  active?: boolean;
  payload?: Array<{ payload: DataPoint }>;
}

function CustomTooltip({ active, payload }: TooltipPayload) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-sm">
      <p className="text-gray-500 text-xs mb-0.5">{point.date}</p>
      <p className="font-semibold text-gray-900">{formatINR(point.value)}</p>
    </div>
  );
}

function formatAxisDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

function formatAxisINR(value: number): string {
  if (Math.abs(value) >= 1e7) return `\u20B9${(value / 1e7).toFixed(1)}Cr`;
  if (Math.abs(value) >= 1e5) return `\u20B9${(value / 1e5).toFixed(1)}L`;
  if (Math.abs(value) >= 1e3) return `\u20B9${(value / 1e3).toFixed(0)}K`;
  return `\u20B9${value}`;
}

export function PortfolioChart({ data, className }: PortfolioChartProps) {
  const [range, setRange] = useState<TimeRange>('1M');

  const sliceCount = SLICE_MAP[range];
  const slicedData = data.slice(-sliceCount);

  return (
    <div className={cn('w-full', className)}>
      {/* Time range buttons */}
      <div className="flex items-center gap-1 mb-3">
        {TIME_RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
              r === range
                ? 'bg-pytrade-blue text-white'
                : 'text-gray-500 hover:bg-gray-100'
            )}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={slicedData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0866F5" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#0866F5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatAxisDate}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={formatAxisINR}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#0866F5"
            strokeWidth={2}
            fill="url(#portfolioGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#0866F5', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PortfolioChart;
