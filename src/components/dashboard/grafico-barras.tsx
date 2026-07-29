"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartSkeleton } from "@/components/ui/loading-skeleton";

interface GraficoBarrasProps {
  dados: { label: string; valor: number }[];
  titulo: string;
  cor?: string;
  loading?: boolean;
}

export function GraficoBarras({
  dados,
  titulo,
  cor = "#2563eb",
  loading = false,
}: GraficoBarrasProps) {
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
        <BarChart data={dados} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar dataKey="valor" fill={cor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
