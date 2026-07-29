/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

let resolveData: any[] = [];

const chainMock = {
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  groupBy: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockResolvedValue([]),
  then: (resolve: (value: any[]) => void) => resolve(resolveData),
};

vi.mock("@/lib/db", () => ({
  db: {
    select: () => chainMock,
  },
}));

import {
  agregarPorUsf,
  agregarPorTipoIncidente,
  agregarPorClassificacao,
  agregarPorSeveridade,
  agregarVolumeTemporal,
  kpisGerais,
} from "../agregacao";

describe("agregarPorUsf", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna dados agregados por USF", async () => {
    const mockData = [{ usfId: "usf-1", total: 10 }];
    chainMock.orderBy.mockResolvedValue(mockData);

    const result = await agregarPorUsf();

    expect(result).toEqual(mockData);
    expect(chainMock.from).toHaveBeenCalled();
    expect(chainMock.groupBy).toHaveBeenCalled();
  });

  it("aplica filtro usfId quando fornecido", async () => {
    await agregarPorUsf({ usfId: "usf-123" });
    expect(chainMock.where).toHaveBeenCalled();
  });

  it("retorna array vazio quando nao ha dados", async () => {
    chainMock.orderBy.mockResolvedValue([]);
    const result = await agregarPorUsf();
    expect(result).toEqual([]);
  });
});

describe("agregarPorTipoIncidente", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna dados agregados por tipo de incidente", async () => {
    const mockData = [
      { tipo: "Queda", total: 5 },
      { tipo: "Erro de medicacao", total: 3 },
    ];
    chainMock.orderBy.mockResolvedValue(mockData);

    const result = await agregarPorTipoIncidente();

    expect(result).toEqual(mockData);
    expect(chainMock.groupBy).toHaveBeenCalled();
  });

  it("filtra por periodo quando fornecido", async () => {
    chainMock.orderBy.mockResolvedValue([]);
    await agregarPorTipoIncidente({ periodo: 7 });
    expect(chainMock.where).toHaveBeenCalled();
  });
});

describe("agregarPorClassificacao", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna dados agregados por classificacao", async () => {
    const mockData = [
      { classificacao: "Circunstancia da queda", total: 4 },
    ];
    chainMock.orderBy.mockResolvedValue(mockData);

    const result = await agregarPorClassificacao();

    expect(result).toEqual(mockData);
  });
});

describe("agregarPorSeveridade", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna dados agregados por severidade", async () => {
    const mockData = [
      { severidade: "Alta", total: 2 },
      { severidade: "Media", total: 5 },
    ];
    chainMock.orderBy.mockResolvedValue(mockData);

    const result = await agregarPorSeveridade();

    expect(result).toEqual(mockData);
  });
});

describe("agregarVolumeTemporal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna dados agregados por data", async () => {
    const mockData = [
      { data: "2026-07-01", total: 3 },
      { data: "2026-07-02", total: 5 },
    ];
    chainMock.orderBy.mockResolvedValue(mockData);

    const result = await agregarVolumeTemporal();

    expect(result).toEqual(mockData);
  });
});

describe("kpisGerais", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resolveData = [];
  });

  it("retorna KPIs agregados", async () => {
    const mockKpis = {
      totalNotificacoes: 50,
      totalGrave: 5,
      totalLeve: 30,
      anonimas: 20,
    };
    resolveData = [mockKpis];

    const result = await kpisGerais();

    expect(result).toEqual(mockKpis);
  });

  it("retorna zeros quando nao ha notificacoes", async () => {
    const mockKpis = {
      totalNotificacoes: 0,
      totalGrave: 0,
      totalLeve: 0,
      anonimas: 0,
    };
    resolveData = [mockKpis];

    const result = await kpisGerais();

    expect(result.totalNotificacoes).toBe(0);
  });
});
