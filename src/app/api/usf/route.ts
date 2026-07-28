import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { usf } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    const unidades = await db.query.usf.findMany({
      where: eq(usf.ativo, true),
      columns: { id: true, slug: true, nome: true },
      orderBy: [asc(usf.nome)],
    });

    return NextResponse.json(unidades, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao carregar unidades de saúde" },
      { status: 500 }
    );
  }
}
