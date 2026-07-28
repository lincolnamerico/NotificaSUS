interface KpiCardProps {
  titulo: string;
  valor: number | string;
  descricao?: string;
}

export function KpiCard({ titulo, valor, descricao }: KpiCardProps) {
  return (
    <div className="rounded-lg border border-primary/10 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">
        {titulo}
      </p>
      <p className="mt-1 text-3xl font-bold text-primary">{valor}</p>
      {descricao && (
        <p className="mt-1 text-xs text-muted">{descricao}</p>
      )}
    </div>
  );
}
