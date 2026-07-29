"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ChartSkeleton } from "@/components/ui/loading-skeleton";

interface GraficoLinhaProps {
  dados: { data: string; valor: number }[];
  titulo: string;
  loading?: boolean;
}

export function GraficoLinha({
  dados,
  titulo,
  loading = false,
}: GraficoLinhaProps) {
  if (loading) return <ChartSkeleton />;

  if (!dados || dados.length === 0) {
    return (
      <div className="rounded-lg border border-primary/10 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-primary">{titulo}</h3>
        <div className="flex h-48 items-center justify-center text-sm text-muted">
          Nenhum dado disponível no período
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-primary/10 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-primary">{titulo}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={dados}
          margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="data"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
