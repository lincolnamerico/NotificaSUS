import { CATEGORIAS_INCIDENTE } from "./types";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export function PassoTipoIncidente({ value, onChange, onNext }: Props) {
  const podeAvancar = value !== "";

  return (
    <div>
      <h2 className="text-lg font-semibold text-primary-dark mb-4">
        Selecione o tipo de incidente
      </h2>
      <div className="grid gap-3" role="radiogroup" aria-label="Tipo de incidente">
        {CATEGORIAS_INCIDENTE.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="radio"
            aria-checked={value === cat.id}
            onClick={() => onChange(cat.id)}
            className={`flex items-center gap-4 rounded-lg border p-4 text-left transition-all ${
              value === cat.id
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-primary/10 bg-white hover:border-primary/30"
            }`}
          >
            <span className="text-2xl" aria-hidden="true">{cat.icone}</span>
            <span className="font-medium text-primary-dark">{cat.label}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={!podeAvancar}
        className="mt-6 w-full rounded-lg bg-primary px-6 py-3 text-white font-medium transition-colors hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        Próximo
      </button>
    </div>
  );
}
