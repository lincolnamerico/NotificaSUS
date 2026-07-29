"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartSkeleton } from "@/components/ui/loading-skeleton";

interface GraficoPizzaProps {
  dados: { label: string; valor: number }[];
  titulo: string;
  loading?: boolean;
}

const CORES = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

export function GraficoPizza({
  dados,
  titulo,
  loading = false,
}: GraficoPizzaProps) {
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
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={dados.map((d) => ({ name: d.label, value: d.valor }))}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {dados.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CORES[index % CORES.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
