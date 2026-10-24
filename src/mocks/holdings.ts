// SIMULATED DATA — NOT REAL MARKET DATA
import type { Holding } from '@/types';

function buildHolding(
  symbol: string,
  name: string,
  quantity: number,
  avgPrice: number,
  currentPrice: number
): Holding {
  const currentValue = quantity * currentPrice;
  const investedValue = quantity * avgPrice;
  const pnl = currentValue - investedValue;
  const pnlPercent = investedValue > 0 ? (pnl / investedValue) * 100 : 0;
  return {
    symbol,
    name,
    quantity,
    avgPrice,
    currentPrice,
    currentValue,
    investedValue,
    pnl,
    pnlPercent,
  };
}

export const mockHoldings: Holding[] = [
  buildHolding('RELIANCE', 'Reliance Industries Ltd', 10, 2780.5, 2923.5),
  buildHolding('TCS', 'Tata Consultancy Services', 5, 3650.0, 3812.75),
  buildHolding('INFY', 'Infosys Ltd', 20, 1690.25, 1756.3),
  buildHolding('HDFCBANK', 'HDFC Bank Ltd', 15, 1540.0, 1682.6),
  buildHolding('ICICIBANK', 'ICICI Bank Ltd', 25, 1185.5, 1248.9),
  buildHolding('ITC', 'ITC Ltd', 100, 452.3, 468.75),
];
