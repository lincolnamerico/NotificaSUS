import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import {
  agregarPorUsf,
  agregarPorTipoIncidente,
  agregarPorClassificacao,
  agregarPorSeveridade,
  agregarVolumeTemporal,
  kpisGerais,
} from "@/lib/services/agregacao";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const usfId = searchParams.get("usf_id") ?? undefined;
  const periodoRaw = searchParams.get("periodo");
  const periodo = periodoRaw ? parseInt(periodoRaw, 10) : 30;

  const filtros = { usfId, periodo };

  try {
    const [porUsf, porTipo, porClassificacao, porSeveridade, volumeTemporal, kpis] =
      await Promise.all([
        agregarPorUsf(filtros),
        agregarPorTipoIncidente(filtros),
        agregarPorClassificacao(filtros),
        agregarPorSeveridade(filtros),
        agregarVolumeTemporal(filtros),
        kpisGerais(filtros),
      ]);

    return NextResponse.json({
      kpis,
      porUsf,
      porTipo,
      porClassificacao,
      porSeveridade,
      volumeTemporal,
    });
  } catch (error) {
    console.error("Erro ao carregar graficos:", error);
    return NextResponse.json(
      { error: "Erro ao carregar dados dos graficos" },
      { status: 500 }
    );
  }
}
