"use client";

import { useState } from "react";

interface PainelExportacaoProps {
  usfId?: string;
  periodo?: string;
}

export function PainelExportacao({
  usfId,
  periodo = "30",
}: PainelExportacaoProps) {
  const [formato, setFormato] = useState<"csv" | "json">("csv");
  const [confirmado, setConfirmado] = useState(false);
  const [exportando, setExportando] = useState(false);

  async function handleExportar() {
    if (!confirmado) return;
    setExportando(true);

    try {
      const params = new URLSearchParams();
      params.set("formato", formato);
      if (usfId) params.set("usf_id", usfId);
      params.set("periodo", periodo);

      const res = await fetch(`/api/gestao/exportar/dados?${params}`);
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Erro ao exportar dados");
        return;
      }

      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const filename =
        disposition.match(/filename="?(.+?)"?$/)?.[1] ??
        `notificacao-export.${formato}`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Erro ao exportar dados");
    } finally {
      setExportando(false);
    }
  }

  return (
    <div className="rounded-lg border border-primary/10 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-primary">
        Exportar Dados
      </h3>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-primary-dark">
            Formato
          </label>
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={() => setFormato("csv")}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                formato === "csv"
                  ? "bg-primary text-white"
                  : "bg-primary/5 text-primary-dark hover:bg-primary/10"
              }`}
            >
              CSV
            </button>
            <button
              type="button"
              onClick={() => setFormato("json")}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                formato === "json"
                  ? "bg-primary text-white"
                  : "bg-primary/5 text-primary-dark hover:bg-primary/10"
              }`}
            >
              JSON
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2 text-xs text-primary-dark">
          <input
            type="checkbox"
            checked={confirmado}
            onChange={(e) => setConfirmado(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            Estou ciente que dados sensíveis do paciente (nome, código
            Winsaúde, data de nascimento) serão anonimizados na exportação
            conforme LGPD.
          </span>
        </label>

        <button
          type="button"
          onClick={handleExportar}
          disabled={!confirmado || exportando}
          className="w-full rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {exportando ? "Exportando..." : "Exportar"}
        </button>
      </div>
    </div>
  );
}
