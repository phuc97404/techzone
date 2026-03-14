"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueChartProps {
  data: { date: string; value: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}tr`}
          />
          <Tooltip 
            formatter={(value: any) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value as number)}
            contentStyle={{ borderRadius: "8px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-background-elevated)" }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="var(--color-primary)" 
            strokeWidth={3}
            dot={{ r: 4, fill: "var(--color-primary)", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
