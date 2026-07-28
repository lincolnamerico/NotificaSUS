import { KpiCard } from "./kpi-card";

interface TotalNotificacoesProps {
  hoje: number;
  dias7: number;
  dias30: number;
}

export function TotalNotificacoes({ hoje, dias7, dias30 }: TotalNotificacoesProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <KpiCard titulo="Hoje" valor={hoje} />
      <KpiCard titulo="Últimos 7 dias" valor={dias7} />
      <KpiCard titulo="Últimos 30 dias" valor={dias30} />
    </div>
  );
}
