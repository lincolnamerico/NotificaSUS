"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type FormularioData, DADOS_INICIAIS, CATEGORIAS_INCIDENTE, GRAUS_DANO } from "./types";
import { IndicadorProgresso } from "./indicador-progresso";
import { PassoTipoIncidente } from "./passo-tipo-incidente";
import { PassoDescricao } from "./passo-descricao";
import { PassoRevisao } from "./passo-revisao";

interface Props {
  usfId?: string;
  usfNome?: string;
}

function getCategoriaLabel(id: string) {
  return CATEGORIAS_INCIDENTE.find((c) => c.id === id)?.label ?? id;
}

function getGrauDanoLabel(id: string) {
  return GRAUS_DANO.find((g) => g.id === id)?.label ?? id;
}

export function FormularioNotificacao({ usfId, usfNome }: Props) {
  const router = useRouter();
  const [passo, setPasso] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [data, setData] = useState<FormularioData>({
    ...DADOS_INICIAIS,
    usfId: usfId ?? "",
  });

  function atualizar(campo: Partial<FormularioData>) {
    setData((prev) => ({ ...prev, ...campo }));
  }

  function avancar() {
    setPasso((p) => Math.min(p + 1, 3));
  }

  function voltar() {
    setPasso((p) => Math.max(p - 1, 1));
  }

  async function enviar() {
    setEnviando(true);
    setErro(null);

    try {
      const res = await fetch("/api/notificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usfId: data.usfId,
          tipoIncidente: data.tipoIncidente,
          dataHora: new Date().toISOString(),
          descricao: data.descricao,
          grauDano: data.grauDano,
          acoesTomadas: data.acoesTomadas,
          anonimo: data.anonimo,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setErro(result.error ?? "Erro ao enviar notificação");
        return;
      }

      const params = new URLSearchParams({
        protocolo: result.protocolo,
        tipo: getCategoriaLabel(data.tipoIncidente),
        grau: getGrauDanoLabel(data.grauDano),
      });
      if (usfNome) params.set("usf", usfNome);

      router.push(`/notificar/confirmacao?${params.toString()}`);
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="w-full">
      <IndicadorProgresso passoAtual={passo} totalPassos={3} />

      {passo === 1 && (
        <PassoTipoIncidente
          value={data.tipoIncidente}
          onChange={(v) => atualizar({ tipoIncidente: v })}
          onNext={avancar}
        />
      )}

      {passo === 2 && (
        <PassoDescricao
          descricao={data.descricao}
          grauDano={data.grauDano}
          acoesTomadas={data.acoesTomadas}
          onDescricaoChange={(v) => atualizar({ descricao: v })}
          onGrauDanoChange={(v) => atualizar({ grauDano: v as FormularioData["grauDano"] })}
          onAcoesChange={(v) => atualizar({ acoesTomadas: v })}
          onNext={avancar}
          onBack={voltar}
        />
      )}

      {passo === 3 && (
        <PassoRevisao
          data={data}
          onToggleAnonimo={(v) => atualizar({ anonimo: v })}
          onConsentChange={(v) => atualizar({ consentimentoLGPD: v })}
          onBack={voltar}
          onSubmit={enviar}
          enviando={enviando}
          erro={erro}
        />
      )}
    </div>
  );
}
