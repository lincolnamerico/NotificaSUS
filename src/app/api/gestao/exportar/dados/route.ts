import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { gerarExportacao } from "@/lib/services/exportacao";
import { db } from "@/lib/db";
import { usuario } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const userRecord = await db
    .select()
    .from(usuario)
    .where(eq(usuario.email, session.user.email))
    .limit(1);

  const papel = userRecord[0]?.papel;
  if (papel === "visualizador") {
    return NextResponse.json(
      { error: "Sem permissão para exportar dados" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const formato = (searchParams.get("formato") === "json" ? "json" : "csv") as "csv" | "json";
  const usfId = searchParams.get("usf_id") ?? undefined;
  const periodoRaw = searchParams.get("periodo");
  const periodo = periodoRaw ? parseInt(periodoRaw, 10) : undefined;

  let dataInicio: Date | undefined;
  if (periodo && periodo > 0) {
    dataInicio = new Date(Date.now() - periodo * 24 * 60 * 60 * 1000);
  }

  try {
    const resultado = await gerarExportacao({
      usfId,
      dataInicio,
      formato,
    });

    return new NextResponse(resultado.dados, {
      headers: {
        "Content-Type": resultado.contentType,
        "Content-Disposition": `attachment; filename="${resultado.filename}"`,
        "X-Total-Registros": String(resultado.totalRegistros),
      },
    });
  } catch (error) {
    console.error("Erro na exportacao:", error);
    return NextResponse.json(
      { error: "Erro ao gerar exportacao" },
      { status: 500 }
    );
  }
}
