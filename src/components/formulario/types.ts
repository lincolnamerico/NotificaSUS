export interface FormularioData {
  usfId: string;
  tipoIncidente: string;
  descricao: string;
  grauDano: "leve" | "moderado" | "grave" | "obito";
  acoesTomadas: string;
  anonimo: boolean;
  consentimentoLGPD: boolean;
}

export const CATEGORIAS_INCIDENTE = [
  { id: "queda-paciente", label: "Queda de paciente", icone: "⬇" },
  { id: "erro-medicacao", label: "Erro de medicação", icone: "💊" },
  { id: "iras", label: "IRAS", icone: "🦠" },
  { id: "falha-equipamento", label: "Falha de equipamento", icone: "⚙" },
  { id: "violencia-agressao", label: "Violência/agressão", icone: "⚠" },
  { id: "outro", label: "Outro", icone: "📝" },
] as const;

export const GRAUS_DANO = [
  { id: "leve", label: "Leve", descricao: "Sem consequências significativas" },
  { id: "moderado", label: "Moderado", descricao: "Requer observação ou intervenção mínima" },
  { id: "grave", label: "Grave", descricao: "Consequências sérias, requer intervenção" },
  { id: "obito", label: "Óbito", descricao: "Resultou em falecimento" },
] as const;

export const DADOS_INICIAIS: FormularioData = {
  usfId: "",
  tipoIncidente: "",
  descricao: "",
  grauDano: "leve",
  acoesTomadas: "",
  anonimo: true,
  consentimentoLGPD: false,
};
