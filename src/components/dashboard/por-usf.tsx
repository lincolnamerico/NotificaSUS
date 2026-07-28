interface PorUsfProps {
  dados: { nome: string; total: number }[];
}

export function PorUsf({ dados }: PorUsfProps) {
  const maxTotal = Math.max(...dados.map((d) => d.total), 1);

  return (
    <div className="rounded-lg border border-primary/10 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-primary">
        Top 5 Unidades de Saúde
      </h3>
      <div className="space-y-2">
        {dados.map((item) => (
          <div key={item.nome} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-primary-dark">{item.nome}</span>
              <span className="font-medium text-primary">{item.total}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-primary/5">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(item.total / maxTotal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
