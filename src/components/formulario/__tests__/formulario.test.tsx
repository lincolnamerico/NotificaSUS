// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormularioNotificacao } from "../formulario-notificacao";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

async function avancarPasso1(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByText("Queda de paciente"));
  await user.click(screen.getByText("Próximo"));
}

async function avancarPasso2(user: ReturnType<typeof userEvent.setup>) {
  await avancarPasso1(user);
  const textarea = screen.getByLabelText(/O que aconteceu/);
  await user.type(textarea, "Paciente sofreu queda no corredor");
  await user.click(screen.getByText("Próximo"));
}

describe("FormularioNotificacao", () => {
  it("renderiza indicador de progresso no passo 1", () => {
    render(<FormularioNotificacao />);
    expect(screen.getByText("Passo 1 de 3")).toBeDefined();
  });

  it("exibe categorias de incidente no passo 1", () => {
    render(<FormularioNotificacao />);
    expect(screen.getByText("Queda de paciente")).toBeDefined();
    expect(screen.getByText("Erro de medicação")).toBeDefined();
    expect(screen.getByText("IRAS")).toBeDefined();
  });

  it("botao proximo fica desabilitado sem selecao", () => {
    render(<FormularioNotificacao />);
    const btn = screen.getByText("Próximo") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it("avanca para passo 2 apos selecionar categoria", async () => {
    const user = userEvent.setup();
    render(<FormularioNotificacao />);

    await user.click(screen.getByText("Queda de paciente"));
    await user.click(screen.getByText("Próximo"));

    expect(screen.getByText("Passo 2 de 3")).toBeDefined();
    expect(screen.getByText("O que aconteceu?")).toBeDefined();
  });

  it("volta do passo 2 para passo 1", async () => {
    const user = userEvent.setup();
    render(<FormularioNotificacao />);

    await avancarPasso1(user);
    await user.click(screen.getByText("Voltar"));

    expect(screen.getByText("Passo 1 de 3")).toBeDefined();
  });

  it("botao proximo bloqueado no passo 2 sem descricao", async () => {
    const user = userEvent.setup();
    render(<FormularioNotificacao />);

    await avancarPasso1(user);

    const btn = screen.getByText("Próximo") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it("avanca para passo 3 apos preencher descricao", async () => {
    const user = userEvent.setup();
    render(<FormularioNotificacao />);

    await avancarPasso2(user);

    expect(screen.getByText("Passo 3 de 3")).toBeDefined();
    expect(screen.getByText("Revise os dados")).toBeDefined();
  });

  it("exibe resumo dos dados no passo 3", async () => {
    const user = userEvent.setup();
    render(<FormularioNotificacao />);

    await avancarPasso2(user);

    expect(screen.getByText("Paciente sofreu queda no corredor")).toBeDefined();
  });

  it("botao enviar bloqueado sem consentimento LGPD", async () => {
    const user = userEvent.setup();
    render(<FormularioNotificacao />);

    await avancarPasso2(user);

    const btn = screen.getByText("Enviar") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it("dados persistem ao voltar do passo 2 para passo 1", async () => {
    const user = userEvent.setup();
    render(<FormularioNotificacao />);

    await avancarPasso1(user);
    await user.click(screen.getByText("Voltar"));

    expect(screen.getByText("Passo 1 de 3")).toBeDefined();
    await user.click(screen.getByText("Próximo"));
    expect(screen.getByText("Passo 2 de 3")).toBeDefined();
  });
});
