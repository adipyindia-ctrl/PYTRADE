// SIMULATED DATA — NOT REAL MARKET DATA
import type { MarketIndex } from '@/types';

// Simple seeded pseudo-random to avoid hydration mismatches
function seededRand(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateChartData(base: number, seedOffset: number, points = 20): { time: string; value: number }[] {
  const data: { time: string; value: number }[] = [];
  let current = base;
  const startHour = 9;
  const startMin = 15;
  for (let i = 0; i < points; i++) {
    const totalMinutes = startHour * 60 + startMin + i * 15;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    // Deterministic walk: ±0.15% per step
    const rand = seededRand(seedOffset + i);
    const delta = current * (rand * 0.003 - 0.0015);
    current = Math.round((current + delta) * 100) / 100;
    data.push({ time, value: current });
  }
  return data;
}

export const mockIndices: MarketIndex[] = [
  {
    id: 'nifty50',
    name: 'NIFTY 50',
    value: 24523.15,
    change: 142.35,
    changePercent: 0.58,
    chartData: generateChartData(24380, 1),
  },
  {
    id: 'sensex',
    name: 'SENSEX',
    value: 80845.22,
    change: -215.6,
    changePercent: -0.27,
    chartData: generateChartData(81060, 100),
  },
  {
    id: 'banknifty',
    name: 'BANK NIFTY',
    value: 51248.75,
    change: 312.4,
    changePercent: 0.61,
    chartData: generateChartData(50936, 200),
  },
  {
    id: 'finnifty',
    name: 'FIN NIFTY',
    value: 23418.9,
    change: -88.25,
    changePercent: -0.38,
    chartData: generateChartData(23507, 300),
  },
];
