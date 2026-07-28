import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notificacao } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { anonimizar, sanitizarPayload, type NotificacaoPayload } from "@/lib/middleware/anonimizacao";
import { gerarProtocoloUnico } from "@/utils/protocolo";

const GRAUS_DANO_VALIDOS = ["leve", "moderado", "grave", "obito"] as const;

interface BodyNotificar {
  usfId?: string;
  tipoIncidente?: string;
  dataHora?: string;
  descricao?: string;
  grauDano?: string;
  acoesTomadas?: string;
  anonimo?: boolean;
}

function validarBody(body: BodyNotificar): string | null {
  if (!body.usfId || typeof body.usfId !== "string") return "usfId é obrigatório";
  if (!body.tipoIncidente || typeof body.tipoIncidente !== "string") return "tipoIncidente é obrigatório";
  if (!body.descricao || typeof body.descricao !== "string") return "descricao é obrigatória";
  if (!body.grauDano || !GRAUS_DANO_VALIDOS.includes(body.grauDano as typeof GRAUS_DANO_VALIDOS[number])) {
    return "grauDano deve ser: leve, moderado, grave ou obito";
  }
  if (body.dataHora && isNaN(Date.parse(body.dataHora))) {
    return "dataHora inválida";
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body: BodyNotificar = await request.json();

    const erro = validarBody(body);
    if (erro) {
      return NextResponse.json({ error: erro, success: false }, { status: 400 });
    }

    const grauDano = body.grauDano as "leve" | "moderado" | "grave" | "obito";

    const payload: NotificacaoPayload = {
      usfId: body.usfId!,
      tipoIncidente: body.tipoIncidente!,
      dataHora: body.dataHora ?? new Date().toISOString(),
      descricao: body.descricao!,
      grauDano,
      acoesTomadas: body.acoesTomadas ?? "",
      anonimo: body.anonimo ?? true,
    };

    const sanitizado = sanitizarPayload(payload);

    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined;
    const userAgent = request.headers.get("user-agent") ?? undefined;
    const headers: Record<string, string> = {};
    for (const h of ["authorization", "cookie", "x-forwarded-for", "x-real-ip"]) {
      const val = request.headers.get(h);
      if (val) headers[h] = val;
    }

    const { dadosDescartados } = anonimizar(sanitizado, { ip, userAgent, headers });

    const protocolo = await gerarProtocoloUnico(async (p) => {
      const existente = await db.query.notificacao.findFirst({
        where: eq(notificacao.protocolo, p),
      });
      return !existente;
    });

    await db.insert(notificacao).values({
      protocolo,
      usfId: sanitizado.usfId,
      tipoIncidente: sanitizado.tipoIncidente,
      dataHora: new Date(sanitizado.dataHora),
      descricao: sanitizado.descricao,
      grauDano: sanitizado.grauDano,
      acoesTomadas: sanitizado.acoesTomadas || null,
      anonimo: sanitizado.anonimo,
    });

    return NextResponse.json(
      {
        protocolo,
        success: true,
        anonimo: sanitizado.anonimo,
        dadosDescartados,
      },
      { status: 201 }
    );
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : "Erro interno do servidor";
    return NextResponse.json({ error: mensagem, success: false }, { status: 500 });
  }
}
