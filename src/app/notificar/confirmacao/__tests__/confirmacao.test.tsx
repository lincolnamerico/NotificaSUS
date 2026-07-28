// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ConfirmacaoPage from "../page";

const MOCK_PROPS = {
  searchParams: Promise.resolve({
    protocolo: "NOT-20260728-A3F2",
    tipo: "Queda de paciente",
    usf: "USF Jardim Amélia",
    grau: "Leve",
  }),
};

describe("ConfirmacaoPage", () => {
  it("deve renderizar o titulo de confirmacao", async () => {
    const Page = await ConfirmacaoPage(MOCK_PROPS);
    render(Page);
    expect(screen.getByText("Notificação Registrada")).toBeDefined();
  });

  it("deve exibir o numero do protocolo", async () => {
    const Page = await ConfirmacaoPage(MOCK_PROPS);
    render(Page);
    expect(screen.getByText("NOT-20260728-A3F2")).toBeDefined();
  });

  it("deve exibir o resumo da notificacao", async () => {
    const Page = await ConfirmacaoPage(MOCK_PROPS);
    render(Page);
    expect(screen.getByText("USF Jardim Amélia")).toBeDefined();
    expect(screen.getByText("Queda de paciente")).toBeDefined();
    expect(screen.getByText("Leve")).toBeDefined();
  });

  it("deve exibir instrucoes sobre anonimato", async () => {
    const Page = await ConfirmacaoPage(MOCK_PROPS);
    render(Page);
    expect(
      screen.getByText(/Guarde seu protocolo/)
    ).toBeDefined();
  });

  it("deve conter link para nova notificacao", async () => {
    const Page = await ConfirmacaoPage(MOCK_PROPS);
    render(Page);
    const link = screen.getByText("Nova Notificação");
    expect(link).toBeDefined();
    const href = link.closest("a")?.getAttribute("href");
    expect(href).toBe("/notificar");
  });

  it("deve exibir placeholder quando protocolo nao fornecido", async () => {
    const propsVazias = {
      searchParams: Promise.resolve({}),
    };
    const Page = await ConfirmacaoPage(propsVazias);
    render(Page);
    expect(screen.getByText("---")).toBeDefined();
  });

  it("deve renderizar footer com versao e prefeitura", async () => {
    const Page = await ConfirmacaoPage(MOCK_PROPS);
    render(Page);
    expect(screen.getByText(/NotificaSUS v1.0/)).toBeDefined();
    expect(screen.getByText(/Prefeitura de Pinhais/)).toBeDefined();
  });
});
