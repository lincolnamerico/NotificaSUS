import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFindMany = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    query: {
      usf: {
        findMany: mockFindMany,
      },
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/usf", () => {
  it("retorna lista de USFs ativas como JSON", async () => {
    mockFindMany.mockResolvedValueOnce([
      { id: "1", slug: "usf-centro", nome: "USF Centro" },
      { id: "2", slug: "usf-vila-verde", nome: "USF Vila Verde" },
    ]);

    const { GET } = await import("../route");
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(2);
  });

  it("retorna 500 quando banco esta indisponivel", async () => {
    mockFindMany.mockRejectedValueOnce(new Error("DB connection failed"));

    const { GET } = await import("../route");
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error");
  });

  it("retorna array vazio quando nao ha USFs ativas", async () => {
    mockFindMany.mockResolvedValueOnce([]);

    const { GET } = await import("../route");
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });

  it("rota publica - nao exige autenticacao", async () => {
    mockFindMany.mockResolvedValueOnce([]);

    const { GET } = await import("../route");
    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
  });
});
