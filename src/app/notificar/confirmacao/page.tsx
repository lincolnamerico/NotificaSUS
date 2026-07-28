import Link from "next/link";

interface Props {
  searchParams: Promise<{
    protocolo?: string;
    tipo?: string;
    usf?: string;
    grau?: string;
  }>;
}

function CheckVerde() {
  return (
    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10" aria-hidden="true">
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-success"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}

export default async function ConfirmacaoPage({ searchParams }: Props) {
  const { protocolo, tipo, usf, grau } = await searchParams;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 py-6">
      <main className="flex-1 flex flex-col items-center justify-center text-center">
        <CheckVerde />

        <h1 className="text-2xl font-bold text-primary-dark">
          Notificação Registrada
        </h1>

        <p className="mt-2 text-sm text-muted">
          Seu protocolo de atendimento
        </p>

        <div className="mt-4 rounded-lg bg-primary/5 border border-primary/10 px-6 py-4">
          <p
            className="text-2xl font-bold tracking-wider text-primary select-all"
            aria-label={`Protocolo: ${protocolo ?? ""}`}
          >
            {protocolo ?? "---"}
          </p>
        </div>

        {tipo && (
          <div className="mt-6 w-full space-y-2 text-left">
            <p className="text-sm text-muted">Resumo da Notificação</p>
            <div className="rounded-lg border border-primary/10 bg-white p-4 text-sm">
              {usf && (
                <p className="flex justify-between">
                  <span className="text-muted">USF:</span>
                  <span className="font-medium text-primary-dark">{usf}</span>
                </p>
              )}
              {tipo && (
                <p className="flex justify-between mt-1">
                  <span className="text-muted">Tipo:</span>
                  <span className="font-medium text-primary-dark">{tipo}</span>
                </p>
              )}
              {grau && (
                <p className="flex justify-between mt-1">
                  <span className="text-muted">Gravidade:</span>
                  <span className="font-medium text-primary-dark">{grau}</span>
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 rounded-lg border border-accent/20 bg-accent/5 p-4 text-sm">
          <p className="text-primary-dark">
            Guarde seu protocolo. Não é possível consultar o status por ser um
            registro anônimo.
          </p>
        </div>

        <Link
          href="/notificar"
          className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-white font-medium transition-colors hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          Nova Notificação
        </Link>
      </main>

      <footer className="mt-8 border-t border-primary/10 pt-4 text-center">
        <p className="text-xs text-muted">
          NotificaSUS v1.0 — Prefeitura de Pinhais - PR
        </p>
      </footer>
    </div>
  );
}
