"use client";

import { useEffect, useState } from "react";
import type { KpiData } from "@/components/dashboard/types";
import { TotalNotificacoes } from "@/components/dashboard/total-notificacoes";
import { PorUsf } from "@/components/dashboard/por-usf";
import { PorGravidade } from "@/components/dashboard/por-gravidade";
import { PorTipo } from "@/components/dashboard/por-tipo";
import { VolumeTemporal } from "@/components/dashboard/volume-temporal";
import { DashboardFiltros } from "@/components/dashboard/dashboard-filtros";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

interface UsfOption {
  id: string;
  nome: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<KpiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [usfId, setUsfId] = useState("");
  const [periodo, setPeriodo] = useState("30d");
  const [usfs, setUsfs] = useState<UsfOption[]>([]);

  useEffect(() => {
    const fetchKpis = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (usfId) params.set("usf_id", usfId);
        params.set("periodo", periodo);

        const res = await fetch(`/api/gestao/dashboard/kpis?${params}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchKpis();
  }, [usfId, periodo]);

  useEffect(() => {
    fetch("/api/usf")
      .then((r) => r.json())
      .then((list) => setUsfs(list));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <DashboardFiltros
          usfId={usfId}
          periodo={periodo}
          usfs={usfs}
          onUsfChange={setUsfId}
          onPeriodoChange={setPeriodo}
        />
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : data ? (
        <div className="space-y-6">
          <TotalNotificacoes
            hoje={data.total.hoje}
            dias7={data.total["7d"]}
            dias30={data.total["30d"]}
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PorUsf dados={data.porUsf} />
            <PorGravidade dados={data.porGravidade} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PorTipo dados={data.porTipo} />
            <VolumeTemporal dados={data.volumeTemporal} />
          </div>
        </div>
      ) : (
        <p className="text-muted">Erro ao carregar dados.</p>
      )}
    </div>
  );
}
