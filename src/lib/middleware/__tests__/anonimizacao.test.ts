import { describe, it, expect } from "vitest";
import { anonimizar, sanitizarPayload, anonimizarExportacao, anonimizarListaExportacao } from "../anonimizacao";

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

describe("anonimizarExportacao", () => {
  it("redacta campos sensiveis do paciente", () => {
    const registro = {
      protocolo: "NOT-001",
      nome_paciente: "Joao Silva",
      codigo_winsaude: "W12345",
      data_nascimento: "1990-01-01",
      cpf: "123.456.789-00",
      rg: "12.345.678-9",
      telefone: "(41) 99999-9999",
      email_paciente: "joao@email.com",
      endereco_paciente: "Rua A, 123",
      tipo_incidente: "Queda",
      descricao: "Paciente caiu",
    };

    const result = anonimizarExportacao(registro);

    expect(result.nome_paciente).toBe("[REDACTED]");
    expect(result.codigo_winsaude).toBe("[REDACTED]");
    expect(result.data_nascimento).toBe("[REDACTED]");
    expect(result.cpf).toBe("[REDACTED]");
    expect(result.rg).toBe("[REDACTED]");
    expect(result.telefone).toBe("[REDACTED]");
    expect(result.email_paciente).toBe("[REDACTED]");
    expect(result.endereco_paciente).toBe("[REDACTED]");
  });

  it("preserva campos nao sensiveis", () => {
    const registro = {
      protocolo: "NOT-001",
      tipo_incidente: "Queda",
      descricao: "Paciente caiu",
      grau_dano: "leve",
    };

    const result = anonimizarExportacao(registro);

    expect(result.protocolo).toBe("NOT-001");
    expect(result.tipo_incidente).toBe("Queda");
    expect(result.descricao).toBe("Paciente caiu");
    expect(result.grau_dano).toBe("leve");
  });

  it("nao quebra se registro nao tem campos sensiveis", () => {
    const registro = { protocolo: "NOT-001" };
    const result = anonimizarExportacao(registro);

    expect(result.protocolo).toBe("NOT-001");
    expect(Object.keys(result)).toHaveLength(1);
  });
});

describe("anonimizarListaExportacao", () => {
  it("redacta todos os registros da lista", () => {
    const registros = [
      { protocolo: "NOT-001", nome_paciente: "Joao" },
      { protocolo: "NOT-002", nome_paciente: "Maria" },
    ];

    const result = anonimizarListaExportacao(registros);

    expect(result).toHaveLength(2);
    expect(result[0].nome_paciente).toBe("[REDACTED]");
    expect(result[1].nome_paciente).toBe("[REDACTED]");
  });

  it("retorna lista vazia quando entrada vazia", () => {
    const result = anonimizarListaExportacao([]);

    expect(result).toEqual([]);
  });
});
