interface Props {
  passoAtual: number;
  totalPassos: number;
}

const PASSOS = [
  { numero: 1, label: "Tipo de Incidente" },
  { numero: 2, label: "Descrição e Gravidade" },
  { numero: 3, label: "Revisão e Envio" },
];

export function IndicadorProgresso({ passoAtual, totalPassos }: Props) {
  return (
    <nav aria-label="Progresso do formulário" className="mb-6">
      <p className="text-sm font-medium text-muted mb-3" role="status">
        Passo {passoAtual} de {totalPassos}
      </p>
      <div className="flex gap-2" role="tablist">
        {PASSOS.slice(0, totalPassos).map((passo) => {
          const isActive = passo.numero === passoAtual;
          const isCompleted = passo.numero < passoAtual;
          return (
            <div
              key={passo.numero}
              role="tab"
              aria-selected={isActive}
              aria-label={passo.label}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                isCompleted
                  ? "bg-primary"
                  : isActive
                    ? "bg-primary"
                    : "bg-primary/10"
              }`}
            />
          );
        })}
      </div>
    </nav>
  );
}
