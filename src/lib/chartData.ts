function seededRand(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export function generateStockChartData(
  basePrice: number,
  symbol: string,
  points: number
): { date: string; value: number }[] {
  const seed = symbol.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const data: { date: string; value: number }[] = [];
  let current = basePrice * 0.85;
  const now = new Date('2025-01-15');
  for (let i = 0; i < points; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - (points - 1 - i));
    const r = seededRand(seed + i);
    current = Math.max(current * (1 + (r * 0.03 - 0.01)), 1);
    data.push({ date: d.toISOString().split('T')[0], value: Math.round(current * 100) / 100 });
  }
  data[data.length - 1]!.value = basePrice;
  return data;
}

export const RANGE_POINTS: Record<string, number> = {
  '1D': 20, '1W': 7, '1M': 30, '3M': 90, '1Y': 252, 'ALL': 500
};
