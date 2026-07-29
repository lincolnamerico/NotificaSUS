/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockAuth = vi.fn();
vi.mock("@/lib/auth/auth", () => ({
  auth: (...args: any[]) => mockAuth(...args),
}));

const chainMock = {
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  limit: vi.fn().mockResolvedValue([{ papel: "gestor" }]),
};

vi.mock("@/lib/db", () => ({
  db: {
    select: () => chainMock,
  },
}));

const mockGerarExportacao = vi.fn();
vi.mock("@/lib/services/exportacao", () => ({
  gerarExportacao: (...args: any[]) => mockGerarExportacao(...args),
}));

import { GET } from "../route";

function criaRequest(formato?: string, usfId?: string, periodo?: string) {
  let url = "http://localhost/api/gestao/exportar/dados";
  const params = new URLSearchParams();
  if (formato) params.set("formato", formato);
  if (usfId) params.set("usf_id", usfId);
  if (periodo) params.set("periodo", periodo);
  const queryString = params.toString();
  if (queryString) url += "?" + queryString;
  return new NextRequest(url);
}

describe("GET /api/gestao/exportar/dados", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna 401 quando nao autenticado", async () => {
    mockAuth.mockResolvedValue(null);

    const response = await GET(criaRequest());
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe("Não autenticado");
  });

  it("retorna 403 quando usuario e visualizador", async () => {
    mockAuth.mockResolvedValue({ user: { email: "visualizador@pinhais.pr.gov.br" } });
    chainMock.limit.mockResolvedValue([{ papel: "visualizador" }]);

    const response = await GET(criaRequest());
    expect(response.status).toBe(403);
    const body = await response.json();
    expect(body.error).toBe("Sem permissão para exportar dados");
  });

  it("retorna 200 com CSV para gestor", async () => {
    mockAuth.mockResolvedValue({ user: { email: "gestor@pinhais.pr.gov.br" } });
    chainMock.limit.mockResolvedValue([{ papel: "gestor" }]);

    mockGerarExportacao.mockResolvedValue({
      dados: "protocolo,tipo\nNOT-001,Queda",
      contentType: "text/csv",
      filename: "notificacao-export-2026-07-28.csv",
      totalRegistros: 1,
    });

    const response = await GET(criaRequest("csv"));
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/csv");
    expect(response.headers.get("Content-Disposition")).toContain(".csv");
    expect(response.headers.get("X-Total-Registros")).toBe("1");
  });

  it("retorna 200 com JSON para gestor", async () => {
    mockAuth.mockResolvedValue({ user: { email: "gestor@pinhais.pr.gov.br" } });
    chainMock.limit.mockResolvedValue([{ papel: "gestor" }]);

    mockGerarExportacao.mockResolvedValue({
      dados: JSON.stringify([{ protocolo: "NOT-001", tipo: "Queda" }]),
      contentType: "application/json",
      filename: "notificacao-export-2026-07-28.json",
      totalRegistros: 1,
    });

    const response = await GET(criaRequest("json"));
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/json");
  });

  it("usa formato csv como padrao quando nao especificado", async () => {
    mockAuth.mockResolvedValue({ user: { email: "gestor@pinhais.pr.gov.br" } });
    chainMock.limit.mockResolvedValue([{ papel: "gestor" }]);
    mockGerarExportacao.mockResolvedValue({
      dados: "",
      contentType: "text/csv",
      filename: "export.csv",
      totalRegistros: 0,
    });

    await GET(criaRequest());

    expect(mockGerarExportacao).toHaveBeenCalledWith(
      expect.objectContaining({ formato: "csv" })
    );
  });

  it("aplica filtro usf_id quando fornecido", async () => {
    mockAuth.mockResolvedValue({ user: { email: "gestor@pinhais.pr.gov.br" } });
    chainMock.limit.mockResolvedValue([{ papel: "gestor" }]);
    mockGerarExportacao.mockResolvedValue({
      dados: "",
      contentType: "text/csv",
      filename: "export.csv",
      totalRegistros: 0,
    });

    await GET(criaRequest("csv", "usf-456"));

    expect(mockGerarExportacao).toHaveBeenCalledWith(
      expect.objectContaining({ usfId: "usf-456" })
    );
  });

  it("aplica filtro de periodo quando fornecido", async () => {
    mockAuth.mockResolvedValue({ user: { email: "gestor@pinhais.pr.gov.br" } });
    chainMock.limit.mockResolvedValue([{ papel: "gestor" }]);
    mockGerarExportacao.mockResolvedValue({
      dados: "",
      contentType: "text/csv",
      filename: "export.csv",
      totalRegistros: 0,
    });

    await GET(criaRequest("csv", undefined, "30"));

    expect(mockGerarExportacao).toHaveBeenCalledWith(
      expect.objectContaining({
        dataInicio: expect.any(Date),
      })
    );
  });

  it("retorna 500 quando exportacao falha", async () => {
    mockAuth.mockResolvedValue({ user: { email: "gestor@pinhais.pr.gov.br" } });
    chainMock.limit.mockResolvedValue([{ papel: "gestor" }]);
    mockGerarExportacao.mockRejectedValue(new Error("Export error"));

    const response = await GET(criaRequest());
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("Erro ao gerar exportacao");
  });

  it("permite exportacao para usuario com papel admin", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@pinhais.pr.gov.br" } });
    chainMock.limit.mockResolvedValue([{ papel: "admin" }]);
    mockGerarExportacao.mockResolvedValue({
      dados: "protocolo,tipo\nNOT-001,Queda",
      contentType: "text/csv",
      filename: "notificacao-export-2026-07-28.csv",
      totalRegistros: 1,
    });

    const response = await GET(criaRequest("csv"));
    expect(response.status).toBe(200);
  });
});
