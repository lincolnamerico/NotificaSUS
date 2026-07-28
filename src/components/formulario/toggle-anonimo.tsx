"use client";

interface Props {
  anonimo: boolean;
  onToggle: (anonimo: boolean) => void;
}

export function ToggleAnonimo({ anonimo, onToggle }: Props) {
  return (
    <div className="rounded-lg border border-primary/10 bg-white p-4 shadow-sm">
      <label className="flex items-center justify-between cursor-pointer">
        <div>
          <span className="text-sm font-medium text-primary-dark">
            Modo Anônimo
          </span>
          <p className="text-xs text-muted">
            {anonimo
              ? "Seus dados pessoais nao serao armazenados"
              : "Dados minimos serao registrados (sem IP ou dados de navegacao)"}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={anonimo}
          aria-label="Alternar modo anonimo"
          onClick={() => onToggle(!anonimo)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            anonimo ? "bg-primary" : "bg-muted"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              anonimo ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </label>
    </div>
  );
}
