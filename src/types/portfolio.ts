export interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  currentValue: number;
  investedValue: number;
  pnl: number;
  pnlPercent: number;
}

export interface PortfolioSummaryData {
  totalValue: number;
  investedAmount: number;
  totalPnl: number;
  pnlPercent: number;
  dayChange: number;
  dayChangePercent: number;
  chartData: { date: string; value: number }[];
}
