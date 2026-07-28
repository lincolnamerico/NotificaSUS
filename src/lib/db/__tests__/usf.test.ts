import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFindMany = vi.fn();
const mockFindFirst = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    query: {
      usf: {
        findMany: mockFindMany,
        findFirst: mockFindFirst,
      },
    },
  },
}));

const mockUsfs = [
  { id: "1", slug: "usf-vila-verde", nome: "USF Vila Verde" },
  { id: "2", slug: "usf-centro", nome: "USF Centro" },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("USF queries", () => {
  it("retorna USF ativas ordenadas por nome", async () => {
    mockFindMany.mockResolvedValueOnce(mockUsfs);

    const { db } = await import("@/lib/db");
    const { usf } = await import("@/lib/db/schema");
    const { eq, asc } = await import("drizzle-orm");

    const result = await db.query.usf.findMany({
      where: eq(usf.ativo, true),
      columns: { id: true, slug: true, nome: true },
      orderBy: [asc(usf.nome)],
    });

    expect(result).toHaveLength(2);
    expect(result[0].nome).toBe("USF Vila Verde");
    expect(mockFindMany).toHaveBeenCalledOnce();
  });

  it("retorna USF por slug", async () => {
    mockFindFirst.mockResolvedValueOnce(mockUsfs[0]);

    const { db } = await import("@/lib/db");
    const { usf } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");

    const result = await db.query.usf.findFirst({
      where: eq(usf.slug, "usf-vila-verde"),
      columns: { id: true, slug: true, nome: true },
    });

    expect(result).not.toBeNull();
    expect(result!.nome).toBe("USF Vila Verde");
  });

  it("retorna null para slug inexistente", async () => {
    mockFindFirst.mockResolvedValueOnce(null);

    const { db } = await import("@/lib/db");
    const { usf } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");

    const result = await db.query.usf.findFirst({
      where: eq(usf.slug, "slug-invalido"),
      columns: { id: true, slug: true, nome: true },
    });

    expect(result).toBeNull();
  });

  it("retorna lista vazia quando nao ha USFs ativas", async () => {
    mockFindMany.mockResolvedValueOnce([]);

    const { db } = await import("@/lib/db");
    const { usf } = await import("@/lib/db/schema");
    const { eq, asc } = await import("drizzle-orm");

    const result = await db.query.usf.findMany({
      where: eq(usf.ativo, true),
      columns: { id: true, slug: true, nome: true },
      orderBy: [asc(usf.nome)],
    });

    expect(result).toEqual([]);
  });
});
