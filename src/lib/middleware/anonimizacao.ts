export interface DadosSensiveis {
  ip?: string;
  userAgent?: string;
  headers?: Record<string, string>;
}

export interface NotificacaoPayload {
  usfId: string;
  tipoIncidente: string;
  dataHora: string;
  descricao: string;
  grauDano: "leve" | "moderado" | "grave" | "obito";
  acoesTomadas?: string;
  anonimo: boolean;
}

const HEADERS_IDENTIFICAVEIS = [
  "authorization",
  "cookie",
  "x-forwarded-for",
  "x-real-ip",
  "cf-connecting-ip",
  "true-client-ip",
];

export function anonimizar(
  payload: NotificacaoPayload,
  dadosSensiveis: DadosSensiveis
): {
  payload: NotificacaoPayload;
  dadosDescartados: string[];
} {
  const dadosDescartados: string[] = [];

  if (!payload.anonimo) {
    return { payload, dadosDescartados };
  }

  if (dadosSensiveis.ip) {
    dadosDescartados.push("ip");
  }

  if (dadosSensiveis.userAgent) {
    dadosDescartados.push("user-agent");
  }

  if (dadosSensiveis.headers) {
    for (const header of HEADERS_IDENTIFICAVEIS) {
      if (header in dadosSensiveis.headers) {
        dadosDescartados.push(`header:${header}`);
      }
    }
  }

  return { payload, dadosDescartados };
}

export function sanitizarPayload(
  payload: NotificacaoPayload
): NotificacaoPayload {
  return {
    usfId: payload.usfId,
    tipoIncidente: payload.tipoIncidente.trim(),
    dataHora: payload.dataHora,
    descricao: payload.descricao.trim(),
    grauDano: payload.grauDano,
    acoesTomadas: payload.acoesTomadas?.trim(),
    anonimo: payload.anonimo,
  };
}
