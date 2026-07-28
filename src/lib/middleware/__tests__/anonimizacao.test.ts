import { describe, it, expect } from "vitest";
import { anonimizar, sanitizarPayload } from "../anonimizacao";

const payloadBase = {
  usfId: "123e4567-e89b-12d3-a456-426614174000",
  tipoIncidente: "Queda de paciente",
  dataHora: "2026-07-28T14:30:00Z",
  descricao: "Paciente caiu no corredor",
  grauDano: "leve" as const,
  acoesTomadas: "Prestado atendimento imediato",
  anonimo: true,
};

describe("anonimizar", () => {
  it("descarta IP em modo anonimo", () => {
    const result = anonimizar(payloadBase, {
      ip: "192.168.1.1",
      userAgent: "Mozilla/5.0",
    });

    expect(result.dadosDescartados).toContain("ip");
    expect(result.dadosDescartados).toContain("user-agent");
  });

  it("nao descarta dados quando anonimo=false", () => {
    const result = anonimizar(
      { ...payloadBase, anonimo: false },
      { ip: "192.168.1.1", userAgent: "Mozilla/5.0" }
    );

    expect(result.dadosDescartados).toHaveLength(0);
  });

  it("descarta headers identificaveis em modo anonimo", () => {
    const result = anonimizar(payloadBase, {
      headers: {
        authorization: "Bearer token123",
        cookie: "session=abc",
        "x-forwarded-for": "10.0.0.1",
      },
    });

    expect(result.dadosDescartados).toContain("header:authorization");
    expect(result.dadosDescartados).toContain("header:cookie");
    expect(result.dadosDescartados).toContain("header:x-forwarded-for");
  });

  it("ignora headers nao identificaveis", () => {
    const result = anonimizar(payloadBase, {
      headers: {
        "content-type": "application/json",
        accept: "*/*",
      },
    });

    expect(result.dadosDescartados).toHaveLength(0);
  });

  it("retorna payload intacto quando anonimo=true", () => {
    const result = anonimizar(payloadBase, {
      ip: "192.168.1.1",
    });

    expect(result.payload).toEqual(payloadBase);
  });
});

describe("sanitizarPayload", () => {
  it("trim campos de texto", () => {
    const result = sanitizarPayload({
      ...payloadBase,
      descricao: "  descricao com espacos  ",
      tipoIncidente: "  Queda  ",
      acoesTomadas: "  acao  ",
    });

    expect(result.descricao).toBe("descricao com espacos");
    expect(result.tipoIncidente).toBe("Queda");
    expect(result.acoesTomadas).toBe("acao");
  });

  it("preserva valores booleanos e enumeracoes", () => {
    const result = sanitizarPayload(payloadBase);

    expect(result.anonimo).toBe(true);
    expect(result.grauDano).toBe("leve");
  });
});
