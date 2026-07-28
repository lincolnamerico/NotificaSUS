import { db } from "@/lib/db";
import { usf } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import type { Usf } from "./types";
import { FormularioNotificacao } from "@/components/formulario/formulario-notificacao";

interface Props {
  searchParams: Promise<{ usf?: string }>;
}

async function getUsfBySlug(slug: string): Promise<Usf | null> {
  try {
    const result = await db.query.usf.findFirst({
      where: eq(usf.slug, slug),
      columns: { id: true, slug: true, nome: true },
    });
    return result ?? null;
  } catch {
    return null;
  }
}

async function listUsfs(): Promise<Usf[]> {
  try {
    return await db.query.usf.findMany({
      where: eq(usf.ativo, true),
      columns: { id: true, slug: true, nome: true },
      orderBy: [asc(usf.nome)],
    });
  } catch {
    return [];
  }
}

function Brasao() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      aria-label="Brasão de Pinhais/PR"
      role="img"
    >
      <circle cx="24" cy="24" r="22" fill="#1a3a5c" />
      <path
        d="M24 8L28 18H38L30 24L34 34L24 28L14 34L18 24L10 18H20L24 8Z"
        fill="#e8c840"
      />
      <circle cx="24" cy="20" r="4" fill="#1a3a5c" />
    </svg>
  );
}

async function UsfSelector() {
  const unidades = await listUsfs();

  return (
    <div className="space-y-3">
      <label
        htmlFor="usf-select"
        className="block text-sm font-medium text-primary-dark"
      >
        Selecione a Unidade de Saúde
      </label>
      <select
        id="usf-select"
        name="usf"
        className="w-full rounded-lg border border-primary/20 bg-white px-4 py-3 text-primary-dark shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <option value="">Selecione uma unidade...</option>
        {unidades.map((u) => (
          <option key={u.id} value={u.slug}>
            {u.nome}
          </option>
        ))}
      </select>
      {unidades.length === 0 && (
        <p className="text-sm text-danger">
          Nenhuma unidade de saúde disponível no momento.
        </p>
      )}
    </div>
  );
}

export default async function NotificarPage({ searchParams }: Props) {
  const { usf: usfSlug } = await searchParams;
  let usfData: Usf | null = null;

  if (usfSlug) {
    usfData = await getUsfBySlug(usfSlug);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 py-6">
      <header className="mb-8 text-center">
        <div className="mx-auto mb-3 flex items-center justify-center gap-3">
          <Brasao />
          <div className="text-left">
            <h1 className="text-xl font-bold leading-tight text-primary">
              NotificaSUS
            </h1>
            <p className="text-sm text-muted">
              Prefeitura de Pinhais - PR
            </p>
          </div>
        </div>
        <p className="text-sm text-muted">
          Registre um incidente ocorrido em uma unidade de saúde
        </p>
      </header>

      <main className="flex-1 space-y-6">
        {usfData ? (
          <div className="rounded-lg border border-primary/10 bg-white p-4 shadow-sm">
            <p className="text-sm text-muted">Unidade de Saúde</p>
            <p className="mt-1 text-lg font-semibold text-primary">{usfData.nome}</p>
          </div>
        ) : usfSlug ? (
          <div className="rounded-lg border border-danger/20 bg-danger/5 p-4 text-center">
            <p className="text-danger font-medium">
              Unidade de saúde não encontrada. Verifique o QR Code.
            </p>
          </div>
        ) : (
          <UsfSelector />
        )}

        <FormularioNotificacao usfId={usfData?.id} usfNome={usfData?.nome} />
      </main>

      <footer className="mt-8 border-t border-primary/10 pt-4 text-center">
        <p className="text-xs text-muted">
          NotificaSUS v1.0 — Sistema de Notificação de Incidentes em Saúde
        </p>
        <p className="mt-1 text-xs text-muted">
          Prefeitura Municipal de Pinhais - Paraná
        </p>
      </footer>
    </div>
  );
}
