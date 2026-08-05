interface DashboardFiltrosProps {
  usfId: string;
  periodo: string;
  usfs: { id: string; nome: string }[];
  onUsfChange: (usfId: string) => void;
  onPeriodoChange: (periodo: string) => void;
}

export function DashboardFiltros({
  usfId,
  periodo,
  usfs = [],
  onUsfChange,
  onPeriodoChange,
}: DashboardFiltrosProps) {
  const lista = Array.isArray(usfs) ? usfs : [];
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={usfId}
        onChange={(e) => onUsfChange(e.target.value)}
        className="rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-primary-dark shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <option value="">Todas as USFs</option>
        {lista.map((u) => (
          <option key={u.id} value={u.id}>
            {u.nome}
          </option>
        ))}
      </select>
      <select
        value={periodo}
        onChange={(e) => onPeriodoChange(e.target.value)}
        className="rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-primary-dark shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <option value="hoje">Hoje</option>
        <option value="7d">Últimos 7 dias</option>
        <option value="30d">Últimos 30 dias</option>
        <option value="90d">Últimos 90 dias</option>
      </select>
    </div>
  );
}
