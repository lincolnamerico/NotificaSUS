import { db } from "@/lib/db";
import { notificacao, usf } from "@/lib/db/schema";
import { sql, eq, and, gte, lte } from "drizzle-orm";
import { anonimizarListaExportacao } from "@/lib/middleware/anonimizacao";

interface FiltrosExportacao {
  usfId?: string;
  dataInicio?: Date;
  dataFim?: Date;
  formato: "csv" | "json";
}

export interface RegistroExportacao {
  protocolo: string;
  usf_nome: string;
  tipo_incidente: string;
  classificacao_incidente: string | null;
  local_especifico: string | null;
  data_hora: string;
  descricao: string;
  grau_dano: string;
  severidade: string | null;
  anonimo: boolean | null;
  created_at: string;
}

async function buscarDados(
  filtros: FiltrosExportacao
): Promise<RegistroExportacao[]> {
  const conditions = [];

  if (filtros.usfId) {
    conditions.push(eq(notificacao.usfId, filtros.usfId));
  }

  if (filtros.dataInicio) {
    conditions.push(gte(notificacao.createdAt, filtros.dataInicio));
  }

  if (filtros.dataFim) {
    conditions.push(lte(notificacao.createdAt, filtros.dataFim));
  }

  const whereFilter = conditions.length > 0 ? and(...conditions) : undefined;

  const resultados = await db
    .select({
      protocolo: notificacao.protocolo,
      usf_nome: usf.nome,
      tipo_incidente: notificacao.tipoIncidente,
      classificacao_incidente: notificacao.classificacaoIncidente,
      local_especifico: notificacao.localEspecifico,
      data_hora: sql<string>`to_char(${notificacao.dataHora}, 'YYYY-MM-DD HH24:MI:SS')`,
      descricao: notificacao.descricao,
      grau_dano: notificacao.grauDano,
      severidade: notificacao.severidade,
      anonimo: notificacao.anonimo,
      created_at: sql<string>`to_char(${notificacao.createdAt}, 'YYYY-MM-DD HH24:MI:SS')`,
    })
    .from(notificacao)
    .innerJoin(usf, eq(notificacao.usfId, usf.id))
    .where(whereFilter)
    .orderBy(sql`${notificacao.createdAt} desc`);

  return resultados;
}

function paraCsv(registros: RegistroExportacao[]): string {
  const cabecalho = [
    "protocolo",
    "usf_nome",
    "tipo_incidente",
    "classificacao_incidente",
    "local_especifico",
    "data_hora",
    "descricao",
    "grau_dano",
    "severidade",
    "anonimo",
    "created_at",
  ];

  const linhas = registros.map((r) =>
    cabecalho
      .map((campo) => {
        const valor = r[campo as keyof RegistroExportacao];
        if (valor === null || valor === undefined) return "";
        const str = String(valor);
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      })
      .join(",")
  );

  return [cabecalho.join(","), ...linhas].join("\n");
}

export async function gerarExportacao(filtros: FiltrosExportacao): Promise<{
  dados: string;
  contentType: string;
  filename: string;
  totalRegistros: number;
}> {
  const registros = await buscarDados(filtros);
  const registrosAnonimizados = anonimizarListaExportacao(
    registros as unknown as Record<string, unknown>[]
  ) as unknown as RegistroExportacao[];

  const timestamp = new Date().toISOString().split("T")[0];

  if (filtros.formato === "json") {
    return {
      dados: JSON.stringify(registrosAnonimizados, null, 2),
      contentType: "application/json",
      filename: `notificacao-export-${timestamp}.json`,
      totalRegistros: registrosAnonimizados.length,
    };
  }

  return {
    dados: paraCsv(registrosAnonimizados),
    contentType: "text/csv",
    filename: `notificacao-export-${timestamp}.csv`,
    totalRegistros: registrosAnonimizados.length,
  };
}
