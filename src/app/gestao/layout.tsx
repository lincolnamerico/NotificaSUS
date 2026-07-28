import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";

export default async function GestaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/gestao/login");
  }

  return (
    <div className="min-h-dvh flex flex-col bg-surface">
      <DashboardHeader
        nome={session.user.name ?? ""}
        email={session.user.email ?? ""}
      />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">
        {children}
      </main>
    </div>
  );
}
