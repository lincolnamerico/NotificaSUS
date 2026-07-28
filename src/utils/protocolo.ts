function gerarHashCurto(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let hash = "";
  for (let i = 0; i < 4; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

function dataFormatada(): string {
  const agora = new Date();
  const y = agora.getFullYear();
  const m = String(agora.getMonth() + 1).padStart(2, "0");
  const d = String(agora.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

export function gerarProtocolo(): string {
  return `NOT-${dataFormatada()}-${gerarHashCurto()}`;
}

export async function gerarProtocoloUnico(
  verificarDisponivel: (protocolo: string) => Promise<boolean>,
  maxTentativas = 5
): Promise<string> {
  for (let i = 0; i < maxTentativas; i++) {
    const protocolo = gerarProtocolo();
    const disponivel = await verificarDisponivel(protocolo);
    if (disponivel) {
      return protocolo;
    }
  }
  throw new Error("Nao foi possivel gerar um protocolo unico apos " + maxTentativas + " tentativas");
}
