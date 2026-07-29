import { describe, it, expect, vi, beforeEach } from "vitest";

const chainMock = {
  from: vi.fn().mockReturnThis(),
  innerJoin: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockResolvedValue([]),
};

vi.mock("@/lib/db", () => ({
  db: {
    select: () => chainMock,
  },
}));

const mockAnonimizarListaExportacao = vi.fn(
  (registros: Record<string, unknown>[]) => registros
);

vi.mock("@/lib/middleware/anonimizacao", () => ({
  anonimizarListaExportacao: (...args: Parameters<typeof mockAnonimizarListaExportacao>) =>
    mockAnonimizarListaExportacao(...args),
}));

import { gerarExportacao } from "../exportacao";

const registroMock = {
  protocolo: "NOT-20260728-0001",
  usf_nome: "USF Teste",
  tipo_incidente: "Queda",
  classificacao_incidente: null,
  local_especifico: null,
  data_hora: "2026-07-28 14:30:00",
  descricao: "Paciente caiu no corredor",
  grau_dano: "leve",
  severidade: null,
  anonimo: true,
  created_at: "2026-07-28 14:30:00",
};

describe("gerarExportacao", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("gera exportacao CSV com dados anonimizados", async () => {
    chainMock.orderBy.mockResolvedValue([registroMock]);

    const result = await gerarExportacao({ formato: "csv" });

    expect(result.contentType).toBe("text/csv");
    expect(result.filename).toMatch(/^notificacao-export-\d{4}-\d{2}-\d{2}\.csv$/);
    expect(result.totalRegistros).toBe(1);
    expect(result.dados).toContain("protocolo,usf_nome");
    expect(result.dados).toContain(registroMock.protocolo);
    expect(mockAnonimizarListaExportacao).toHaveBeenCalledTimes(1);
  });

  it("gera exportacao JSON com dados anonimizados", async () => {
    chainMock.orderBy.mockResolvedValue([registroMock]);

    const result = await gerarExportacao({ formato: "json" });

    expect(result.contentType).toBe("application/json");
    expect(result.filename).toMatch(/\.json$/);
    expect(result.totalRegistros).toBe(1);

    const parsed = JSON.parse(result.dados);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0].protocolo).toBe(registroMock.protocolo);
  });

  it("retorna array vazio em CSV quando nao ha registros", async () => {
    chainMock.orderBy.mockResolvedValue([]);

    const result = await gerarExportacao({ formato: "csv" });

    expect(result.totalRegistros).toBe(0);
    expect(result.dados).toContain("protocolo,usf_nome");
  });

  it("retorna array vazio em JSON quando nao ha registros", async () => {
    chainMock.orderBy.mockResolvedValue([]);

    const result = await gerarExportacao({ formato: "json" });

    expect(result.totalRegistros).toBe(0);
    expect(JSON.parse(result.dados)).toEqual([]);
  });

  it("aplica filtros de data quando fornecidos", async () => {
    chainMock.orderBy.mockResolvedValue([]);

    await gerarExportacao({
      formato: "csv",
      dataInicio: new Date("2026-01-01"),
      dataFim: new Date("2026-12-31"),
    });

    expect(chainMock.where).toHaveBeenCalled();
  });

  it("escapa virgulas em campos CSV", async () => {
    const registroComVirgula = {
      ...registroMock,
      descricao: "Paciente, caiu, no corredor",
    };
    chainMock.orderBy.mockResolvedValue([registroComVirgula]);

    const result = await gerarExportacao({ formato: "csv" });

    expect(result.dados).toContain('"Paciente, caiu, no corredor"');
  });

  it("escapa aspas duplas em campos CSV", async () => {
    const registroComAspas = {
      ...registroMock,
      descricao: 'Queda "grave" do paciente',
    };
    chainMock.orderBy.mockResolvedValue([registroComAspas]);

    const result = await gerarExportacao({ formato: "csv" });

    expect(result.dados).toContain('"Queda ""grave"" do paciente"');
  });
});
