"use client";

import { useState } from "react";

interface Props {
  onConsentChange: (consentido: boolean) => void;
}

export function ConsentimentoLGPD({ onConsentChange }: Props) {
  const [consentido, setConsentido] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.checked;
    setConsentido(value);
    onConsentChange(value);
  }

  return (
    <div className="rounded-lg border border-primary/10 bg-white p-4 shadow-sm">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={consentido}
          onChange={handleChange}
          className="mt-1 h-4 w-4 rounded border-primary/30 text-primary focus:ring-2 focus:ring-primary/20"
          aria-required="true"
        />
        <div className="text-sm text-primary-dark">
          <span className="font-medium">
            Consentimento LGPD
          </span>
          <p className="mt-1 text-muted">
            Estou ciente de que esta notificacao pode ser anonima. Caso opte
            pelo modo identificado, meus dados serao protegidos conforme a Lei
            Geral de Protecao de Dados (LGPD) e utilizados exclusivamente para
            fins de acompanhamento pela gestao municipal de saude.
          </p>
        </div>
      </label>
    </div>
  );
}
