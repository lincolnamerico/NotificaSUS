import { GRAUS_DANO } from "./types";

interface Props {
  descricao: string;
  grauDano: string;
  acoesTomadas: string;
  onDescricaoChange: (value: string) => void;
  onGrauDanoChange: (value: string) => void;
  onAcoesChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PassoDescricao({
  descricao,
  grauDano,
  acoesTomadas,
  onDescricaoChange,
  onGrauDanoChange,
  onAcoesChange,
  onNext,
  onBack,
}: Props) {
  const podeAvancar = descricao.trim() !== "";

  return (
    <div>
      <h2 className="text-lg font-semibold text-primary-dark mb-4">
        Descreva o incidente
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="descricao"
            className="block text-sm font-medium text-primary-dark mb-1"
          >
            O que aconteceu? <span className="text-danger">*</span>
          </label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => onDescricaoChange(e.target.value)}
            rows={4}
            placeholder="Descreva o ocorrido de forma objetiva..."
            className="w-full rounded-lg border border-primary/20 bg-white px-4 py-3 text-primary-dark shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
            aria-required="true"
          />
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-primary-dark mb-2">
            Grau de dano
          </legend>
          <div className="grid gap-2" role="radiogroup">
            {GRAUS_DANO.map((g) => (
              <label
                key={g.id}
                className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                  grauDano === g.id
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-primary/10 bg-white hover:border-primary/30"
                }`}
              >
                <input
                  type="radio"
                  name="grauDano"
                  value={g.id}
                  checked={grauDano === g.id}
                  onChange={(e) => onGrauDanoChange(e.target.value)}
                  className="h-4 w-4 text-primary border-primary/30 focus:ring-2 focus:ring-primary/20"
                />
                <div>
                  <span className="font-medium text-primary-dark text-sm">
                    {g.label}
                  </span>
                  <p className="text-xs text-muted">{g.descricao}</p>
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label
            htmlFor="acoes"
            className="block text-sm font-medium text-primary-dark mb-1"
          >
            Ações tomadas (opcional)
          </label>
          <textarea
            id="acoes"
            value={acoesTomadas}
            onChange={(e) => onAcoesChange(e.target.value)}
            rows={2}
            placeholder="Descreva as ações imediatas..."
            className="w-full rounded-lg border border-primary/20 bg-white px-4 py-3 text-primary-dark shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-lg border border-primary/20 bg-white px-6 py-3 text-primary-dark font-medium transition-colors hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!podeAvancar}
          className="flex-1 rounded-lg bg-primary px-6 py-3 text-white font-medium transition-colors hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
