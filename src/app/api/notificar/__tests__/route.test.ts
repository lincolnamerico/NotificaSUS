import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockInsert = vi.fn();
const mockFindFirst = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    insert: () => ({ values: mockInsert }),
    query: {
      notificacao: {
        findFirst: mockFindFirst,
      },
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

function criarRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost/api/notificar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/notificar", () => {
  it("cria notificacao com dados validos e retorna protocolo", async () => {
    mockFindFirst.mockResolvedValue(null);
    mockInsert.mockResolvedValue(undefined);

    const { POST } = await import("../route");
    const response = await POST(
      criarRequest({
        usfId: "usf-123",
        tipoIncidente: "queda-paciente",
        descricao: "Paciente caiu no corredor",
        grauDano: "leve",
      })
    );

    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.protocolo).toMatch(/^NOT-\d{8}-[A-Z0-9]{4}$/);
    expect(mockInsert).toHaveBeenCalledOnce();
  });

  it("retorna 400 quando usfId nao enviado", async () => {
    const { POST } = await import("../route");
    const response = await POST(
      criarRequest({
        tipoIncidente: "queda-paciente",
        descricao: "teste",
        grauDano: "leve",
      })
    );

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("usfId");
  });

  it("retorna 400 quando descricao nao enviada", async () => {
    const { POST } = await import("../route");
    const response = await POST(
      criarRequest({
        usfId: "usf-123",
        tipoIncidente: "queda-paciente",
        grauDano: "leve",
      })
    );

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("descricao");
  });

  it("retorna 400 quando grauDano invalido", async () => {
    const { POST } = await import("../route");
    const response = await POST(
      criarRequest({
        usfId: "usf-123",
        tipoIncidente: "queda-paciente",
        descricao: "teste",
        grauDano: "invalido",
      })
    );

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it("usa anonimo=true por padrao", async () => {
    mockFindFirst.mockResolvedValue(null);
    mockInsert.mockResolvedValue(undefined);

    const { POST } = await import("../route");
    const response = await POST(
      criarRequest({
        usfId: "usf-123",
        tipoIncidente: "queda-paciente",
        descricao: "teste",
        grauDano: "grave",
      })
    );

    const data = await response.json();
    expect(data.anonimo).toBe(true);
  });

  it("quebra de protocolo quando colisao no banco", async () => {
    mockFindFirst.mockResolvedValueOnce({ protocolo: "NOT-20260728-ABCD" });
    mockFindFirst.mockResolvedValueOnce(null);
    mockInsert.mockResolvedValue(undefined);

    const { POST } = await import("../route");
    const response = await POST(
      criarRequest({
        usfId: "usf-123",
        tipoIncidente: "queda-paciente",
        descricao: "teste",
        grauDano: "moderado",
      })
    );

    const data = await response.json();
    expect(response.status).toBe(201);
    expect(data.protocolo).toMatch(/^NOT-\d{8}-[A-Z0-9]{4}$/);
    expect(mockFindFirst).toHaveBeenCalledTimes(2);
  });

  it("retorna 500 quando banco falha ao inserir", async () => {
    mockFindFirst.mockResolvedValue(null);
    mockInsert.mockRejectedValue(new Error("DB connection failed"));

    const { POST } = await import("../route");
    const response = await POST(
      criarRequest({
        usfId: "usf-123",
        tipoIncidente: "queda-paciente",
        descricao: "teste",
        grauDano: "obito",
      })
    );

    const data = await response.json();
    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
  });
});
