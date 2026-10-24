'use client';

import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MiniChartProps {
  data: { time: string; value: number }[];
  positive: boolean;
  height?: number;
}

export function MiniChart({ data, positive, height = 60 }: MiniChartProps) {
  const strokeColor = positive ? '#16A34A' : '#DC2626';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={strokeColor}
          strokeWidth={1.5}
          dot={false}
          activeDot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default MiniChart;
