import { CATEGORIAS_INCIDENTE, GRAUS_DANO, type FormularioData } from "./types";
import { ToggleAnonimo } from "./toggle-anonimo";
import { ConsentimentoLGPD } from "../ui/consentimento-lgpd";

interface Props {
  data: FormularioData;
  onToggleAnonimo: (anonimo: boolean) => void;
  onConsentChange: (consentido: boolean) => void;
  onBack: () => void;
  onSubmit: () => void;
  enviando?: boolean;
  erro?: string | null;
}

function getCategoriaLabel(id: string) {
  return CATEGORIAS_INCIDENTE.find((c) => c.id === id)?.label ?? id;
}

function getGrauDanoLabel(id: string) {
  return GRAUS_DANO.find((g) => g.id === id)?.label ?? id;
}

export function PassoRevisao({
  data,
  onToggleAnonimo,
  onConsentChange,
  onBack,
  onSubmit,
  enviando,
  erro,
}: Props) {
  const podeEnviar = data.consentimentoLGPD && !enviando;

  return (
    <div>
      <h2 className="text-lg font-semibold text-primary-dark mb-4">
        Revise os dados
      </h2>

      <div className="space-y-3">
        <div className="rounded-lg border border-primary/10 bg-white p-4">
          <p className="text-xs text-muted uppercase tracking-wide">Tipo de Incidente</p>
          <p className="mt-1 font-medium text-primary-dark">
            {getCategoriaLabel(data.tipoIncidente)}
          </p>
        </div>

        <div className="rounded-lg border border-primary/10 bg-white p-4">
          <p className="text-xs text-muted uppercase tracking-wide">Descrição</p>
          <p className="mt-1 text-sm text-primary-dark whitespace-pre-wrap">
            {data.descricao}
          </p>
        </div>

        <div className="rounded-lg border border-primary/10 bg-white p-4">
          <p className="text-xs text-muted uppercase tracking-wide">Grau de Dano</p>
          <p className="mt-1 font-medium text-primary-dark">
            {getGrauDanoLabel(data.grauDano)}
          </p>
        </div>

        {data.acoesTomadas && (
          <div className="rounded-lg border border-primary/10 bg-white p-4">
            <p className="text-xs text-muted uppercase tracking-wide">Ações Tomadas</p>
            <p className="mt-1 text-sm text-primary-dark whitespace-pre-wrap">
              {data.acoesTomadas}
            </p>
          </div>
        )}

        <ToggleAnonimo
          anonimo={data.anonimo}
          onToggle={onToggleAnonimo}
        />

        <ConsentimentoLGPD onConsentChange={onConsentChange} />
      </div>

      {erro && (
        <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700" role="alert">
          {erro}
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={enviando}
          className="flex-1 rounded-lg border border-primary/20 bg-white px-6 py-3 text-primary-dark font-medium transition-colors hover:bg-primary/5 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!podeEnviar}
          className="flex-1 rounded-lg bg-primary px-6 py-3 text-white font-medium transition-colors hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {enviando ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}
