'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { mockHoldings } from '@/mocks/holdings';
import { computePortfolioTotals } from '@/lib/calculations';
import { generatePortfolioHistory } from '@/lib/chartData';
import { formatINR, formatPercent } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import type { Holding } from '@/types';

const PIE_COLORS = ['#0866F5', '#16A34A', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'];

const RANGES = ['1M', '3M', '6M', '1Y'] as const;
type Range = (typeof RANGES)[number];

const RANGE_DAYS: Record<Range, number> = {
  '1M': 30,
  '3M': 90,
  '6M': 180,
  '1Y': 365,
};

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<'holdings' | 'positions'>('holdings');
  const [range, setRange] = useState<Range>('3M');

  const totals = useMemo(() => computePortfolioTotals(mockHoldings), []);
  const chartData = useMemo(
    () => generatePortfolioHistory(totals.totalValue, RANGE_DAYS[range]),
    [totals.totalValue, range]
  );
  const dayChange = totals.totalValue * 0.008;
  const dayChangePositive = true;

  const allocationData = mockHoldings.map((h: Holding) => ({
    name: h.symbol,
    value: h.currentValue,
  }));

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6 pb-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-pytrade-navy">Portfolio</h1>
            <p className="text-xs text-amber-600">
              Demo portfolio — simulated holdings, not real investments
            </p>
          </div>
          <Link
            href="/orders/new"
            className="bg-pytrade-blue text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 text-center"
          >
            + Place Order
          </Link>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: 'Current Value',
              value: formatINR(totals.totalValue),
              sub: '',
              colored: false,
              positive: true,
            },
            {
              label: 'Invested',
              value: formatINR(totals.investedAmount, true),
              sub: '',
              colored: false,
              positive: true,
            },
            {
              label: 'Total P&L',
              value: formatINR(totals.totalPnl, true),
              sub: formatPercent(totals.pnlPercent),
              colored: true,
              positive: totals.totalPnl >= 0,
            },
            {
              label: "Today's Change",
              value: formatINR(dayChange, true),
              sub: formatPercent(0.8),
              colored: true,
              positive: dayChangePositive,
            },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-2xl p-4 shadow-sm min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide truncate">
                {card.label}
              </p>
              <p
                className={cn(
                  'text-lg font-bold mt-1 truncate',
                  card.colored
                    ? card.positive
                      ? 'text-positive'
                      : 'text-negative'
                    : 'text-pytrade-navy'
                )}
              >
                {card.value}
              </p>
              {card.sub && (
                <p
                  className={cn(
                    'text-xs font-medium',
                    card.positive ? 'text-positive' : 'text-negative'
                  )}
                >
                  {card.sub}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Chart + Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-pytrade-navy text-sm">Portfolio Performance</h3>
              <div className="flex gap-1">
                {RANGES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
                      range === r
                        ? 'bg-pytrade-blue text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0866F5" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0866F5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 9 }}
                    tickFormatter={(v: string) => v.slice(5)}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 9 }}
                    tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
                    domain={['auto', 'auto']}
                    width={48}
                  />
                  <Tooltip
                    formatter={(v) => [
                      `₹${(Number(v)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
                      'Value',
                    ]}
                    labelFormatter={(l) => `Date: ${String(l)}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#0866F5"
                    strokeWidth={2}
                    fill="url(#portGrad)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Allocation pie */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-pytrade-navy text-sm mb-3">Allocation</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {allocationData.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [formatINR(Number(v), true), 'Value']} />
                  <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Holdings / Positions tabs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100">
            {(['holdings', 'positions'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={cn(
                  'flex-1 py-3 text-sm font-medium capitalize transition-colors',
                  activeTab === t
                    ? 'text-pytrade-blue border-b-2 border-pytrade-blue'
                    : 'text-gray-500 hover:text-pytrade-navy'
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {activeTab === 'positions' ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              No open positions. Positions are intraday trades that remain open before market close.
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        'Symbol',
                        'Qty',
                        'Avg Price',
                        'Curr Price',
                        'Invested',
                        'Curr Value',
                        'P&L',
                        'Return',
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {mockHoldings.map((h: Holding) => (
                      <tr key={h.symbol} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <Link
                            href={`/stocks/${h.symbol}`}
                            className="font-bold text-pytrade-navy hover:text-pytrade-blue"
                          >
                            {h.symbol}
                          </Link>
                          <p className="text-xs text-gray-400 truncate max-w-[120px]">{h.name}</p>
                        </td>
                        <td className="px-4 py-3">{h.quantity}</td>
                        <td className="px-4 py-3">{formatINR(h.avgPrice)}</td>
                        <td className="px-4 py-3">{formatINR(h.currentPrice)}</td>
                        <td className="px-4 py-3">{formatINR(h.investedValue, true)}</td>
                        <td className="px-4 py-3 font-medium">{formatINR(h.currentValue, true)}</td>
                        <td
                          className={cn(
                            'px-4 py-3 font-semibold text-xs',
                            h.pnl >= 0 ? 'text-positive' : 'text-negative'
                          )}
                        >
                          {h.pnl >= 0 ? '+' : ''}
                          {formatINR(h.pnl, true)}
                        </td>
                        <td
                          className={cn(
                            'px-4 py-3 font-semibold text-xs',
                            h.pnlPercent >= 0 ? 'text-positive' : 'text-negative'
                          )}
                        >
                          {formatPercent(h.pnlPercent)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                    <tr>
                      <td
                        className="px-4 py-3 font-bold text-pytrade-navy text-sm"
                        colSpan={4}
                      >
                        Total
                      </td>
                      <td className="px-4 py-3 font-bold">
                        {formatINR(totals.investedAmount, true)}
                      </td>
                      <td className="px-4 py-3 font-bold">
                        {formatINR(totals.totalValue, true)}
                      </td>
                      <td
                        className={cn(
                          'px-4 py-3 font-bold text-sm',
                          totals.totalPnl >= 0 ? 'text-positive' : 'text-negative'
                        )}
                      >
                        {totals.totalPnl >= 0 ? '+' : ''}
                        {formatINR(totals.totalPnl, true)}
                      </td>
                      <td
                        className={cn(
                          'px-4 py-3 font-bold text-sm',
                          totals.pnlPercent >= 0 ? 'text-positive' : 'text-negative'
                        )}
                      >
                        {formatPercent(totals.pnlPercent)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden divide-y divide-gray-50">
                {mockHoldings.map((h: Holding) => (
                  <div key={h.symbol} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/stocks/${h.symbol}`}>
                          <span className="font-bold text-pytrade-navy hover:text-pytrade-blue">
                            {h.symbol}
                          </span>
                        </Link>
                        <p className="text-xs text-gray-500">{h.quantity} shares</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-pytrade-navy text-sm">
                          {formatINR(h.currentValue, true)}
                        </p>
                        <p
                          className={cn(
                            'text-xs font-semibold',
                            h.pnl >= 0 ? 'text-positive' : 'text-negative'
                          )}
                        >
                          {h.pnl >= 0 ? '+' : ''}
                          {formatINR(h.pnl, true)} ({formatPercent(h.pnlPercent)})
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <span>Avg: {formatINR(h.avgPrice)}</span>
                      <span>LTP: {formatINR(h.currentPrice)}</span>
                      <span>Invested: {formatINR(h.investedValue, true)}</span>
                      <span>Current: {formatINR(h.currentValue, true)}</span>
                    </div>
                  </div>
                ))}
                {/* Mobile totals */}
                <div className="p-4 bg-gray-50">
                  <div className="flex justify-between">
                    <span className="text-sm font-bold text-pytrade-navy">Portfolio Total</span>
                    <span className="text-sm font-bold text-pytrade-navy">
                      {formatINR(totals.totalValue, true)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      Invested: {formatINR(totals.investedAmount, true)}
                    </span>
                    <span
                      className={cn(
                        'text-xs font-semibold',
                        totals.totalPnl >= 0 ? 'text-positive' : 'text-negative'
                      )}
                    >
                      {formatPercent(totals.pnlPercent)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
