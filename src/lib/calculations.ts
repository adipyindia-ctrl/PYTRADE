import type { Holding, PortfolioSummaryData } from '@/types';

export function computePortfolioTotals(
  holdings: Holding[]
): Omit<PortfolioSummaryData, 'chartData' | 'dayChange' | 'dayChangePercent'> {
  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const investedAmount = holdings.reduce((sum, h) => sum + h.investedValue, 0);
  const totalPnl = totalValue - investedAmount;
  const pnlPercent = investedAmount > 0 ? (totalPnl / investedAmount) * 100 : 0;
  return { totalValue, investedAmount, totalPnl, pnlPercent };
}
