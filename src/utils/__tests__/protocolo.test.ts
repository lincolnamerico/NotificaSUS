import { describe, it, expect } from "vitest";
import { gerarProtocolo, gerarProtocoloUnico } from "../protocolo";

describe("gerarProtocolo", () => {
  it("deve gerar protocolo no formato NOT-YYYYMMDD-XXXX", () => {
    const protocolo = gerarProtocolo();
    expect(protocolo).toMatch(/^NOT-\d{8}-[A-Z0-9]{4}$/);
  });

  it("deve gerar hashes diferentes em chamadas sucessivas", () => {
    const p1 = gerarProtocolo();
    const p2 = gerarProtocolo();
    expect(p1).not.toBe(p2);
  });
});

describe("gerarProtocoloUnico", () => {
  it("deve retornar protocolo quando disponivel", async () => {
    const verificar = async () => true;
    const protocolo = await gerarProtocoloUnico(verificar);
    expect(protocolo).toMatch(/^NOT-\d{8}-[A-Z0-9]{4}$/);
  });

  it("deve tentar novamente quando houver colisao e eventualmente suceder", async () => {
    let chamadas = 0;
    const verificar = async () => {
      chamadas++;
      return chamadas >= 3;
    };
    const protocolo = await gerarProtocoloUnico(verificar, 5);
    expect(protocolo).toMatch(/^NOT-\d{8}-[A-Z0-9]{4}$/);
    expect(chamadas).toBe(3);
  });

  it("deve lancar erro apos exceder maxTentativas", async () => {
    const verificar = async () => false;
    await expect(gerarProtocoloUnico(verificar, 3)).rejects.toThrow(
      "Nao foi possivel gerar um protocolo unico"
    );
  });
});
