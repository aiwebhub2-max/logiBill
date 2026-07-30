"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MonthlyRevenue } from "@/types";
import { abbreviateAmount } from "@/lib/utils";

interface RevenueChartProps {
  data: MonthlyRevenue[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-card border border-surface-border rounded-xl p-3 shadow-card-hover">
        <p className="text-xs font-semibold text-gray-600 mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: p.color }}
            />
            <span className="text-gray-700 text-xs">
              {p.name === "revenue" ? "Encaissé" : "Facturé"}:
            </span>
            <span className="text-gray-900 text-xs font-semibold">
              {new Intl.NumberFormat("fr-CD").format(p.value)} FC
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorInvoiced" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#2a2d3e"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            dy={4}
          />

          <YAxis
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => abbreviateAmount(v)}
            dx={-4}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="invoiced"
            name="invoiced"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#colorInvoiced)"
            dot={false}
            activeDot={{
              r: 4,
              fill: "#8b5cf6",
              strokeWidth: 2,
              stroke: "#1a1d2e",
            }}
          />

          <Area
            type="monotone"
            dataKey="revenue"
            name="revenue"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#colorRevenue)"
            dot={false}
            activeDot={{
              r: 4,
              fill: "#6366f1",
              strokeWidth: 2,
              stroke: "#1a1d2e",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
