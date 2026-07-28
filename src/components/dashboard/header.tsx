"use client";

import { signOut } from "@/lib/auth/auth";

interface DashboardHeaderProps {
  nome: string;
  email: string;
}

export function DashboardHeader({ nome, email }: DashboardHeaderProps) {
  return (
    <header className="border-b border-primary/10 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div>
          <h2 className="text-lg font-bold text-primary">NotificaSUS</h2>
          <p className="text-xs text-muted">Dashboard Gerencial</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-primary-dark">{nome}</p>
            <p className="text-xs text-muted">{email}</p>
          </div>
          <button
            onClick={() => signOut({ redirectTo: "/gestao/login" })}
            className="rounded-lg border border-primary/20 px-3 py-1.5 text-xs font-medium text-primary-dark transition-colors hover:bg-primary/5"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
