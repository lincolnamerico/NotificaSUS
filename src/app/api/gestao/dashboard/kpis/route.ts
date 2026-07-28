import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { notificacao, usf } from "@/lib/db/schema";
import { sql, eq, and, gte, desc } from "drizzle-orm";

function getPeriodStart(periodo: string): Date {
  const agora = new Date();
  switch (periodo) {
    case "hoje":
      return new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
    case "7d":
      return new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
    case "90d":
      return new Date(agora.getTime() - 90 * 24 * 60 * 60 * 1000);
    default:
      return new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const usfId = searchParams.get("usf_id");
  const periodo = searchParams.get("periodo") ?? "30d";

  const periodStart = getPeriodStart(periodo);
  const filters = [gte(notificacao.createdAt, periodStart)];
  if (usfId) {
    filters.push(eq(notificacao.usfId, usfId));
  }
  const baseFilter = and(...filters);

  try {
    const [totalResult] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(notificacao)
      .where(baseFilter);

    const porUsf = await db
      .select({
        nome: usf.nome,
        total: sql<number>`count(*)::int`,
      })
      .from(notificacao)
      .innerJoin(usf, eq(notificacao.usfId, usf.id))
      .where(baseFilter)
      .groupBy(usf.nome)
      .orderBy(desc(sql`count(*)`))
      .limit(5);

    const porGravidade = await db
      .select({
        grauDano: notificacao.grauDano,
        total: sql<number>`count(*)::int`,
      })
      .from(notificacao)
      .where(baseFilter)
      .groupBy(notificacao.grauDano)
      .orderBy(notificacao.grauDano);

    const porTipo = await db
      .select({
        tipoIncidente: notificacao.tipoIncidente,
        total: sql<number>`count(*)::int`,
      })
      .from(notificacao)
      .where(baseFilter)
      .groupBy(notificacao.tipoIncidente)
      .orderBy(desc(sql`count(*)`));

    const volumeTemporal = await db
      .select({
        data: sql<string>`${notificacao.createdAt}::date::text`,
        total: sql<number>`count(*)::int`,
      })
      .from(notificacao)
      .where(and(
        gte(notificacao.createdAt, getPeriodStart("30d")),
        usfId ? eq(notificacao.usfId, usfId) : undefined,
      ))
      .groupBy(sql`${notificacao.createdAt}::date`)
      .orderBy(sql`${notificacao.createdAt}::date`);

    const porGravidadeMap: Record<string, number> = {
      leve: 0, moderado: 0, grave: 0, obito: 0,
    };
    for (const item of porGravidade) {
      porGravidadeMap[item.grauDano] = item.total;
    }

    const hojeFilter = and(
      gte(notificacao.createdAt, getPeriodStart("hoje")),
      ...(usfId ? [eq(notificacao.usfId, usfId)] : []),
    );
    const dias7Filter = and(
      gte(notificacao.createdAt, getPeriodStart("7d")),
      ...(usfId ? [eq(notificacao.usfId, usfId)] : []),
    );

    const [hoje] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(notificacao)
      .where(hojeFilter);

    const [dias7] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(notificacao)
      .where(dias7Filter);

    return NextResponse.json({
      total: {
        hoje: hoje.total,
        "7d": dias7.total,
        "30d": totalResult.total,
      },
      porUsf,
      porGravidade: porGravidadeMap,
      porTipo,
      volumeTemporal,
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao carregar KPIs" },
      { status: 500 },
    );
  }
}
