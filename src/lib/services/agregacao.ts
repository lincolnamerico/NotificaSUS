import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { notificacao } from "@/lib/db/schema";

export interface FiltrosAgregacao {
  usfId?: string;
  periodo?: number;
  dataInicio?: Date;
  dataFim?: Date;
}

function buildFiltroPeriodo(filtros: FiltrosAgregacao) {
  if (filtros.dataInicio && filtros.dataFim) {
    return sql`${notificacao.createdAt} >= ${filtros.dataInicio} AND ${notificacao.createdAt} <= ${filtros.dataFim}`;
  }
  if (filtros.periodo && filtros.periodo > 0) {
    return sql`${notificacao.createdAt} >= now() - interval '${sql.raw(String(filtros.periodo))} days'`;
  }
  return sql`TRUE`;
}

export async function agregarPorUsf(filtros: FiltrosAgregacao = {}) {
  const filtroPeriodo = buildFiltroPeriodo(filtros);
  const usfFilter = filtros.usfId
    ? sql`${notificacao.usfId} = ${filtros.usfId}`
    : sql`TRUE`;

  const resultado = await db
    .select({
      usfId: notificacao.usfId,
      total: sql<number>`count(*)::int`,
    })
    .from(notificacao)
    .where(sql`${usfFilter} AND ${filtroPeriodo}`)
    .groupBy(notificacao.usfId)
    .orderBy(sql`count(*) desc`);

  return resultado;
}

export async function agregarPorTipoIncidente(filtros: FiltrosAgregacao = {}) {
  const filtroPeriodo = buildFiltroPeriodo(filtros);
  const usfFilter = filtros.usfId
    ? sql`${notificacao.usfId} = ${filtros.usfId}`
    : sql`TRUE`;

  const resultado = await db
    .select({
      tipo: notificacao.tipoIncidente,
      total: sql<number>`count(*)::int`,
    })
    .from(notificacao)
    .where(sql`${usfFilter} AND ${filtroPeriodo}`)
    .groupBy(notificacao.tipoIncidente)
    .orderBy(sql`count(*) desc`);

  return resultado;
}

export async function agregarPorClassificacao(filtros: FiltrosAgregacao = {}) {
  const filtroPeriodo = buildFiltroPeriodo(filtros);
  const usfFilter = filtros.usfId
    ? sql`${notificacao.usfId} = ${filtros.usfId}`
    : sql`TRUE`;

  const resultado = await db
    .select({
      classificacao: notificacao.classificacaoIncidente,
      total: sql<number>`count(*)::int`,
    })
    .from(notificacao)
    .where(sql`${usfFilter} AND ${filtroPeriodo}`)
    .groupBy(notificacao.classificacaoIncidente)
    .orderBy(sql`count(*) desc`);

  return resultado;
}

export async function agregarPorSeveridade(filtros: FiltrosAgregacao = {}) {
  const filtroPeriodo = buildFiltroPeriodo(filtros);
  const usfFilter = filtros.usfId
    ? sql`${notificacao.usfId} = ${filtros.usfId}`
    : sql`TRUE`;

  const resultado = await db
    .select({
      severidade: notificacao.severidade,
      total: sql<number>`count(*)::int`,
    })
    .from(notificacao)
    .where(sql`${usfFilter} AND ${filtroPeriodo}`)
    .groupBy(notificacao.severidade)
    .orderBy(sql`count(*) desc`);

  return resultado;
}

export async function agregarVolumeTemporal(
  filtros: FiltrosAgregacao = {}
) {
  const filtroPeriodo = buildFiltroPeriodo(filtros);
  const usfFilter = filtros.usfId
    ? sql`${notificacao.usfId} = ${filtros.usfId}`
    : sql`TRUE`;

  const resultado = await db
    .select({
      data: sql<string>`to_char(${notificacao.createdAt}, 'YYYY-MM-DD')`,
      total: sql<number>`count(*)::int`,
    })
    .from(notificacao)
    .where(sql`${usfFilter} AND ${filtroPeriodo}`)
    .groupBy(sql`to_char(${notificacao.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${notificacao.createdAt}, 'YYYY-MM-DD')`);

  return resultado;
}

export async function kpisGerais(filtros: FiltrosAgregacao = {}) {
  const filtroPeriodo = buildFiltroPeriodo(filtros);
  const usfFilter = filtros.usfId
    ? sql`${notificacao.usfId} = ${filtros.usfId}`
    : sql`TRUE`;

  const resultado = await db
    .select({
      totalNotificacoes: sql<number>`count(*)::int`,
      totalGrave: sql<number>`count(*) filter (where ${notificacao.grauDano} in ('grave', 'obito'))::int`,
      totalLeve: sql<number>`count(*) filter (where ${notificacao.grauDano} = 'leve')::int`,
      anonimas: sql<number>`count(*) filter (where ${notificacao.anonimo} = true)::int`,
    })
    .from(notificacao)
    .where(sql`${usfFilter} AND ${filtroPeriodo}`);

  return resultado[0];
}
