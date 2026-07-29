/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockAuth = vi.fn();
vi.mock("@/lib/auth/auth", () => ({
  auth: (...args: any[]) => mockAuth(...args),
}));

const mockAgregarPorUsf = vi.fn();
const mockAgregarPorTipo = vi.fn();
const mockAgregarPorClassificacao = vi.fn();
const mockAgregarPorSeveridade = vi.fn();
const mockAgregarVolumeTemporal = vi.fn();
const mockKpisGerais = vi.fn();

vi.mock("@/lib/services/agregacao", () => ({
  agregarPorUsf: (...args: any[]) => mockAgregarPorUsf(...args),
  agregarPorTipoIncidente: (...args: any[]) => mockAgregarPorTipo(...args),
  agregarPorClassificacao: (...args: any[]) => mockAgregarPorClassificacao(...args),
  agregarPorSeveridade: (...args: any[]) => mockAgregarPorSeveridade(...args),
  agregarVolumeTemporal: (...args: any[]) => mockAgregarVolumeTemporal(...args),
  kpisGerais: (...args: any[]) => mockKpisGerais(...args),
}));

import { GET } from "../route";

function criaRequest(usfId?: string, periodo?: string) {
  let url = "http://localhost/api/gestao/dashboard/graficos";
  const params = new URLSearchParams();
  if (usfId) params.set("usf_id", usfId);
  if (periodo) params.set("periodo", periodo);
  const queryString = params.toString();
  if (queryString) url += "?" + queryString;
  return new NextRequest(url);
}

describe("GET /api/gestao/dashboard/graficos", () => {
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

  it("retorna 200 com todos os dados de graficos quando autenticado", async () => {
    mockAuth.mockResolvedValue({ user: { email: "gestor@pinhais.pr.gov.br" } });

    mockAgregarPorUsf.mockResolvedValue([{ usfId: "usf-1", total: 10 }]);
    mockAgregarPorTipo.mockResolvedValue([{ tipo: "Queda", total: 5 }]);
    mockAgregarPorClassificacao.mockResolvedValue([]);
    mockAgregarPorSeveridade.mockResolvedValue([]);
    mockAgregarVolumeTemporal.mockResolvedValue([]);
    mockKpisGerais.mockResolvedValue({
      totalNotificacoes: 10,
      totalGrave: 2,
      totalLeve: 5,
      anonimas: 3,
    });

    const response = await GET(criaRequest());
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.kpis.totalNotificacoes).toBe(10);
    expect(body.porUsf).toHaveLength(1);
    expect(body.porTipo).toHaveLength(1);
    expect(body.porClassificacao).toEqual([]);
    expect(body.porSeveridade).toEqual([]);
    expect(body.volumeTemporal).toEqual([]);
  });

  it("aplica filtro usf_id quando fornecido", async () => {
    mockAuth.mockResolvedValue({ user: { email: "gestor@pinhais.pr.gov.br" } });
    mockAgregarPorUsf.mockResolvedValue([]);
    mockAgregarPorTipo.mockResolvedValue([]);
    mockAgregarPorClassificacao.mockResolvedValue([]);
    mockAgregarPorSeveridade.mockResolvedValue([]);
    mockAgregarVolumeTemporal.mockResolvedValue([]);
    mockKpisGerais.mockResolvedValue({
      totalNotificacoes: 0,
      totalGrave: 0,
      totalLeve: 0,
      anonimas: 0,
    });

    await GET(criaRequest("usf-123"));

    expect(mockAgregarPorUsf).toHaveBeenCalledWith(
      expect.objectContaining({ usfId: "usf-123" })
    );
  });

  it("usa periodo padrao 30 dias quando nao fornecido", async () => {
    mockAuth.mockResolvedValue({ user: { email: "gestor@pinhais.pr.gov.br" } });
    mockAgregarPorUsf.mockResolvedValue([]);
    mockAgregarPorTipo.mockResolvedValue([]);
    mockAgregarPorClassificacao.mockResolvedValue([]);
    mockAgregarPorSeveridade.mockResolvedValue([]);
    mockAgregarVolumeTemporal.mockResolvedValue([]);
    mockKpisGerais.mockResolvedValue({
      totalNotificacoes: 0,
      totalGrave: 0,
      totalLeve: 0,
      anonimas: 0,
    });

    await GET(criaRequest());

    expect(mockAgregarPorUsf).toHaveBeenCalledWith(
      expect.objectContaining({ periodo: 30 })
    );
  });

  it("aplica periodo customizado quando fornecido", async () => {
    mockAuth.mockResolvedValue({ user: { email: "gestor@pinhais.pr.gov.br" } });
    mockAgregarPorUsf.mockResolvedValue([]);
    mockAgregarPorTipo.mockResolvedValue([]);
    mockAgregarPorClassificacao.mockResolvedValue([]);
    mockAgregarPorSeveridade.mockResolvedValue([]);
    mockAgregarVolumeTemporal.mockResolvedValue([]);
    mockKpisGerais.mockResolvedValue({
      totalNotificacoes: 0,
      totalGrave: 0,
      totalLeve: 0,
      anonimas: 0,
    });

    await GET(criaRequest(undefined, "7"));

    expect(mockAgregarPorUsf).toHaveBeenCalledWith(
      expect.objectContaining({ periodo: 7 })
    );
  });

  it("retorna 500 quando servico de agregacao falha", async () => {
    mockAuth.mockResolvedValue({ user: { email: "gestor@pinhais.pr.gov.br" } });
    mockAgregarPorUsf.mockRejectedValue(new Error("DB error"));

    const response = await GET(criaRequest());
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("Erro ao carregar dados dos graficos");
  });
});
