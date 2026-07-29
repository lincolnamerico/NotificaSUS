# Spec: Epic 3 — Dashboard Avancado & Exportacao

> **Story ID:** EPIC-3
> **Complexity:** SIMPLE
> **Generated:** 2026-07-29T10:00:00-03:00
> **Status:** Draft

---

## 1. Overview

Adicionar graficos estraticados ao dashboard gerencial e funcionalidade de exportacao manual de dados com anonimizacao LGPD, preparando a arquitetura para futuro workflow da Comissao de Seguranca do Paciente.

_Derivado de FR-1, FR-2, FR-3_

### 1.1 Goals

- Permitir visualizacao grafica estraticada dos incidentes por USF, tipo, classificacao e severidade
- Viabilizar exportacao manual de dados (CSV/JSON) com garantia de anonimizacao LGPD
- Estruturar modelo de dados e permissoes para futuro workflow da Comissao de Seguranca do Paciente

### 1.2 Non-Goals

- Exportacao automatica via job agendado (futuro, CON-3)
- Integracao direta com schema NotiVISA (futuro, ASM-2)
- Workflow completo da Comissao de Seguranca do Paciente (futuro, ASM-1)
- Relatorios PDF (escopo separado no PRD original)

---

## 2. Requirements Summary

### 2.1 Functional Requirements

| ID | Description | Priority | Source |
|----|------------|----------|--------|
| FR-1 | Dashboard com graficos estratificados por USF, local especifico, tipo de incidente, classificacao do incidente e severidade do incidente | P0 | requirements.json |
| FR-2 | Exportacao manual de dados em formato CSV/JSON com anonimizacao de dados sensiveis do paciente | P0 | requirements.json |
| FR-3 | Estruturar modelo de dados e permissoes para futuro workflow da Comissao de Seguranca do Paciente (validacao, reclassificacao, confirmacao de severidade) | P1 | requirements.json |

### 2.2 Non-Functional Requirements

| ID | Category | Requirement | Metric |
|----|----------|-------------|--------|
| NFR-1 | usability | Graficos devem exibir indicador de carregamento (loading state / barra de progresso) enquanto sao montados na tela | Loading state visivel em < 500ms apos acionamento |
| NFR-2 | performance | Tempo de resposta para renderizacao dos graficos nao deve exceder 10 segundos, com feedback visual continuo | Grafico renderizado em <= 10s com loading state |
| NFR-3 | security | Dados sensiveis do paciente (Nome, Codigo Winsaude, Data de Nascimento) devem ser anonimizados antes da exportacao | Zero vazamento de PII nos arquivos exportados |

### 2.3 Constraints

| ID | Type | Constraint | Impact |
|----|------|-----------|--------|
| CON-1 | regulatory | LGPD compliance obrigatoria — anonimizacao de dados pessoais do paciente em qualquer exportacao | Middleware de anonimizacao deve ser estendido para cobrir exportacao |
| CON-2 | technical | Stack atual (Next.js App Router, Neon PostgreSQL, Tailwind CSS) deve ser mantida | Bibliotecas de grafico devem ser compativeis com React/Next.js Server Components |
| CON-3 | business | Exportacao inicial sera manual — automacao via job agendado em versao futura | UI de exportacao manual com filtros e confirmacao LGPD |

---

## 3. Technical Approach

### 3.1 Architecture Overview

Construir sobre a arquitetura existente do Epic 2 (dashboard gerencial):

1. **API de Agregacao**: Nova rota `GET /api/gestao/dashboard/graficos` com queries SQL agregadas (COUNT, GROUP BY) para alimentar os graficos
2. **Componentes de Grafico**: Biblioteca React para renderizacao client-side com data fetching via fetch/React Query
3. **API de Exportacao**: Nova rota `GET /api/gestao/exportar/dados` que aplica middleware de anonimizacao (reaproveitando logica existente em `src/lib/middleware/anonimizacao.ts`) antes de gerar CSV/JSON
4. **Modelo de Dados**: Estender schema `notificacao` com campos `classificacao_incidente` e `severidade` (se ainda nao existirem), e preparar tabela `historico_comissao` para workflow futuro

_Derivado de FR-1, FR-2, FR-3, CON-2_

### 3.2 Component Design

| Component | Descricao | Derivated de |
|-----------|-----------|--------------|
| `GraficoBarras` | Grafico de barras para volume por USF | FR-1 |
| `GraficoPizza` | Grafico de pizza para distribuicao por tipo/classificacao | FR-1 |
| `GraficoLinha` | Grafico de linha para volume temporal | FR-1 |
| `FiltrosDashboard` | Componente de filtros combinados (USF, periodo, tipo, severidade) | FR-1 |
| `PainelExportacao` | Modal/painel com selecao de formato, filtros e confirmacao LGPD | FR-2, CON-1 |
| `LoadingSkeleton` | Skeleton/spinner padrao para estados de carregamento | NFR-1 |

_Derivado de FR-1, FR-2, NFR-1_

### 3.3 Data Flow

```
[Gestor] → Login OAuth → Dashboard
  → Filtros (USF, periodo, tipo)
  → GET /api/gestao/dashboard/graficos?usf=X&periodo=Y
  → Neon: SELECT COUNT, GROUP BY usf, tipo, severidade
  → JSON → Componentes Grafico (loading state → render)
  → Usuario visualiza graficos estratificados

[Gestor] → Painel Exportacao
  → Filtros + confirmacao anonimizacao
  → GET /api/gestao/exportar/dados?formato=csv&periodo=Y
  → Middleware anonimizacao (strips nome, winsaude, dt_nasc)
  → Neon: SELECT notificacao WHERE filtros
  → Stream CSV/JSON → Download
```

_Derivado de FR-1, FR-2, NFR-3_

---

## 4. Dependencies

### 4.1 External Dependencies

| Dependency | Version | Purpose | Verified |
|-----------|---------|---------|----------|
| Recharts / Tremor / Nivo | A definir | Biblioteca de graficos React | ⚠️ OQ-1 |
| @tanstack/react-query | ^5.x | Data fetching e cache do dashboard | ⚠️ (ja usado em projetos Next.js, verificar compatibilidade) |

### 4.2 Internal Dependencies

| Module | Purpose |
|--------|---------|
| `src/lib/db/schema.ts` | Estender tabela notificacao com classificacao_incidente e severidade |
| `src/lib/middleware/anonimizacao.ts` | Reaproveitar logica de anonimizacao para exportacao |
| `src/app/gestao/` | Dashboard existente do Epic 2 |
| `src/lib/auth/auth.ts` | Proteger rotas de API de dashboard e exportacao |

---

## 5. Files to Modify/Create

### 5.1 New Files

| File Path | Purpose | Derivated from |
|-----------|---------|----------------|
| `src/app/api/gestao/dashboard/graficos/route.ts` | API de dados agregados para graficos | FR-1 |
| `src/app/api/gestao/exportar/dados/route.ts` | API de exportacao CSV/JSON | FR-2 |
| `src/components/dashboard/grafico-barras.tsx` | Componente de grafico de barras | FR-1 |
| `src/components/dashboard/grafico-pizza.tsx` | Componente de grafico de pizza | FR-1 |
| `src/components/dashboard/grafico-linha.tsx` | Componente de grafico de linha temporal | FR-1 |
| `src/components/dashboard/filtros-dashboard.tsx` | Componente de filtros combinados | FR-1 |
| `src/components/dashboard/painel-exportacao.tsx` | Modal de exportacao com confirmacao LGPD | FR-2 |
| `src/components/ui/loading-skeleton.tsx` | Skeleton padrao para loading states | NFR-1 |
| `src/lib/services/exportacao.ts` | Servico de geracao de CSV/JSON com anonimizacao | FR-2, NFR-3 |
| `src/lib/services/agregacao.ts` | Servico de queries agregadas para graficos | FR-1 |

### 5.2 Modified Files

| File Path | Changes | Risk |
|-----------|---------|------|
| `src/lib/db/schema.ts` | Adicionar campos `classificacao_incidente` e `severidade` a tabela notificacao; criar tabela `historico_comissao` (futuro) | Medium |
| `src/app/gestao/page.tsx` | Integrar componentes de grafico e filtros | Medium |
| `src/lib/middleware/anonimizacao.ts` | Estender para suportar anonimizacao em exportacao (além de persistencia) | Low |
| `src/lib/auth/auth.ts` | Garantir que novas rotas de API estejam protegidas | Low |

---

## 6. Testing Strategy

### 6.1 Unit Tests

| Test | Covers | Priority |
|------|--------|----------|
| Testar anonimizacao de campos sensiveis na exportacao | NFR-3 | P0 |
| Testar queries de agregacao por USF | FR-1 | P0 |
| Testar queries de agregacao por tipo/classificacao | FR-1 | P0 |
| Testar geracao de CSV valido | FR-2 | P0 |
| Testar geracao de JSON valido | FR-2 | P0 |
| Testar loading state dos componentes de grafico | NFR-1 | P1 |
| Testar estados vazios (sem dados no periodo) | EC-1 | P1 |

### 6.2 Integration Tests

| Test | Components | Scenario |
|------|-----------|----------|
| GET /api/gestao/dashboard/graficos retorna dados agregados | API + DB | Filtros validos |
| GET /api/gestao/dashboard/graficos sem auth retorna 401 | API + Auth | Usuario nao autenticado |
| GET /api/gestao/exportar/dados retorna CSV com dados anonimizados | API + DB + Middleware | Exportacao valida |
| GET /api/gestao/exportar/dados sem permissao retorna 403 | API + Auth | Visualizador tenta exportar |

### 6.3 Acceptance Tests (Given-When-Then)

```gherkin
Feature: Dashboard com Graficos

  Scenario: Gestor visualiza graficos estratificados
    Given um gestor autenticado com acesso ao dashboard
    When acessa a pagina de dashboard
    Then ve os graficos de volume por USF, tipo e severidade
    And os graficos exibem loading state enquanto carregam

  Scenario: Gestor filtra dados do dashboard
    Given um gestor autenticado no dashboard
    When seleciona filtro de USF e periodo
    Then os graficos sao atualizados com os dados filtrados

Feature: Exportacao de Dados

  Scenario: Gestor exporta dados com anonimizacao
    Given um gestor autenticado com permissao de exportacao
    When solicita exportacao no formato CSV
    Then o arquivo e gerado sem dados sensiveis do paciente (nome, winsaude, dt_nasc)

  Scenario: Usuario sem permissao tenta exportar
    Given um visualizador autenticado sem permissao de exportacao
    When tenta acessar o botao de exportacao
    Then o botao esta desabilitado com tooltip explicativo
```

---

## 7. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Biblioteca de graficos escolhida nao atende requisitos de performance (NFR-2) | Low | High | Prototipar com 2 opcoes antes de definir; OQ-1 |
| Volume de dados cresce e queries agregadas ficam lentas (ASM-3) | Medium | Medium | Monitorar performance e implementar materialized views se necessario |
| Schema de exportacao NotiVISA futuro requer mudancas significativas (ASM-2) | Medium | Medium | Exportacao inicial em formato generico (CSV/JSON) com mapeamento futuro |

---

## 8. Open Questions

| ID | Question | Blocking | Assigned To |
|----|----------|----------|-------------|
| OQ-1 | Qual biblioteca de graficos utilizar? (Recharts, Tremor, Nivo, Chart.js?) | Yes | @architect |
| OQ-2 | Definir modelo de permissoes RBAC detalhado para acesso a dashboard e exportacao | No | @architect |
| OQ-3 | Quais campos de classificacao_incidente e severidade sao necessarios? Validar com comissao | No | @pm |

---

## 9. Implementation Checklist

- [ ] Estender schema `notificacao` com `classificacao_incidente` e `severidade`
- [ ] Criar tabela `historico_comissao` (preparacao para workflow futuro - FR-3)
- [ ] Criar API `GET /api/gestao/dashboard/graficos` com queries agregadas
- [ ] Implementar servico de agregacao em `src/lib/services/agregacao.ts`
- [ ] Implementar componentes de grafico (barras, pizza, linha)
- [ ] Implementar componente de filtros combinados
- [ ] Integrar graficos na pagina de dashboard existente
- [ ] Implementar loading skeleton states (NFR-1)
- [ ] Implementar estados vazios (EC-1) e erro (EC-2)
- [ ] Estender middleware de anonimizacao para exportacao (NFR-3)
- [ ] Criar servico de exportacao em `src/lib/services/exportacao.ts`
- [ ] Criar API `GET /api/gestao/exportar/dados`
- [ ] Implementar painel de exportacao com confirmacao LGPD
- [ ] Implementar controle de permissoes (visualizador nao exporta - EC-5)
- [ ] Escrever testes unitarios e de integracao
- [ ] Rodar `npm run lint`, `npm run typecheck`, `npm run test`

---

## Metadata

- **Generated by:** @pm via spec-write-spec
- **Inputs:** requirements.json
- **Iteration:** 1
