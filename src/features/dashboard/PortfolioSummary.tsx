'use client';

import { DashboardCard } from '@/components/ui';
import { PortfolioChart } from '@/components/charts/PortfolioChart';
import { mockHoldings } from '@/mocks/holdings';
import { computePortfolioTotals } from '@/lib/calculations';
import { formatINR, formatPercent } from '@/lib/formatters';
import { cn } from '@/lib/utils';

// Generate simple chart data from holdings (last 30 days mock)
// Uses a fixed reference date to avoid instability during prerender
const REFERENCE_DATE = '2025-01-15';

function generatePortfolioChartData(
  baseValue: number
): { date: string; value: number }[] {
  const data: { date: string; value: number }[] = [];
  let current = baseValue * 0.9;
  const ref = new Date(REFERENCE_DATE);
  for (let i = 29; i >= 0; i--) {
    const d = new Date(ref);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    // Use a deterministic delta based on index to avoid random instability
    const factor = ((i * 17 + 3) % 20) * 0.001 - 0.008;
    current = Math.round((current * (1 + factor)) * 100) / 100;
    data.push({ date: dateStr, value: current });
  }
  // last point is the real totalValue
  data[data.length - 1]!.value = baseValue;
  return data;
}

const totals = computePortfolioTotals(mockHoldings);
// Simulate day change as 0.8% of total value
const dayChange = totals.totalValue * 0.008;
const dayChangePercent = 0.8;

const chartData = generatePortfolioChartData(totals.totalValue);

function StatRow({
  label,
  value,
  isColored,
  positive,
}: {
  label: string;
  value: string;
  isColored?: boolean;
  positive?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      <p
        className={cn(
          'text-sm font-semibold',
          isColored
            ? positive
              ? 'text-positive'
              : 'text-negative'
            : 'text-pytrade-navy'
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function PortfolioSummary() {
  const pnlPositive = totals.totalPnl >= 0;
  const dayPositive = dayChange >= 0;

  return (
    <DashboardCard title="Portfolio Summary" className="overflow-hidden">
      <p className="text-xs text-amber-600 bg-amber-50 rounded px-2 py-1 mb-3 w-fit">
        Demo portfolio — not real holdings
      </p>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Stats */}
        <div className="flex flex-col gap-3 lg:min-w-[200px]">
          {/* Total value — prominent */}
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">
              Total Value
            </p>
            <p className="text-2xl font-bold text-pytrade-navy">
              {formatINR(totals.totalValue)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatRow
              label="Invested"
              value={formatINR(totals.investedAmount, true)}
            />
            <StatRow
              label="Total P&amp;L"
              value={`${pnlPositive ? '+' : ''}${formatINR(totals.totalPnl, true)} (${formatPercent(totals.pnlPercent)})`}
              isColored
              positive={pnlPositive}
            />
            <StatRow
              label="Day Change"
              value={`${dayPositive ? '+' : ''}${formatINR(dayChange, true)} (${formatPercent(dayChangePercent)})`}
              isColored
              positive={dayPositive}
            />
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 min-w-0">
          <PortfolioChart data={chartData} />
        </div>
      </div>
    </DashboardCard>
  );
}

export default PortfolioSummary;
