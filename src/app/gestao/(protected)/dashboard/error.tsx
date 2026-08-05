"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-xl font-bold text-primary">Erro no Dashboard</h1>
      <p className="max-w-md text-sm text-muted">{error.message}</p>
      <pre className="max-w-lg overflow-auto rounded bg-primary/5 p-4 text-left text-xs text-muted">
        {error.stack}
      </pre>
      <button
        onClick={reset}
        className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
      >
        Tentar novamente
      </button>
    </div>
  );
}
