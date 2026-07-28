# Brainstorming Session: NotificaSUS — Sistema de Notificacao de Incidentes em Saude

**Data:** 2026-07-28
**Duracao:** ~30 minutos
**Facilitador:** Atlas (analyst)
**Participantes:** @po (Pax), @architect (Eris), @ux-design-expert (Nova), @dev (Orion), @qa (Vega)
**Goal:** solution
**Output:** prioritized

## Contexto

Solicitacao inicial da Secretaria de Saude de Pinhais/PR para sistema web de registro de incidentes e eventos adversos em seguranca do paciente nas USFs. Acesso via QR Code, anonimato LGPD, compatibilidade NotiVISA, dashboards gerenciais e mobile-first.

Fonte: `solicitacao_inicial.md`

## Ideas Geradas

**Total:** 17

### Por Categoria

#### MVP & Fluxo Core (6 ideias)
- MVP com QR Code + formulario anonimo em 4 semanas (by @po)
- Autopreenchimento da USF por parametro na URL (by @po)
- Toggle anonimo como default (by @po)
- Fluxo de 3 passos maximo (by @ux-design-expert)
- Feedback visual imediato com protocolo anonimo (by @ux-design-expert)
- URL amigavel: `pinhais.pr.gov.br/notificar?usf=slug` (by @dev)

#### Stack & Arquitetura (5 ideias)
- Stack enxuta: Next.js (SSR) + PostgreSQL + Tailwind (by @architect)
- Vercel + Neon (PostgreSQL serverless) para custo zero inicial (remix by @dev)
- Middleware de anonimizacao antes do banco (by @dev)
- Separation of concerns: formulario dashboard (by @architect)
- Subdominio `gestao.pinhais.pr.gov.br` + OAuth Google Workspace (remix by @architect)

#### Integracao NotiVISA (3 ideias)
- API de exportacao NotiVISA em JSON/CSV (by @architect)
- Job semanal que gera lote no formato NotiVISA (remix by @dev)
- PDF Reports com Puppeteer/lib server-side (by @dev)

#### Qualidade & LGPD (2 ideias)
- Testes de conformidade LGPD validando anonimizacao (by @qa)
- Testes de carga 100+ acessos simultaneos por USF (by @qa)

#### Inovacoes Futuras v2 (2 ideias)
- Chatbot de triagem antes do formulario (wild card)
- Notificacao push via WhatsApp (wild card)
- QR Code com token de validade (wild card)
- Painel publico anonimo (wild card)

## Top Recomendacoes

### 1. MVP Core (QR + formulario + toggle + URL + feedback)
**Valor:** 10/10 | **Esforco:** 3/10 | **ROI:** 3.33
**Por que:** Entrega o fluxo essencial de notificacao em 4 semanas
**Proximos passos:** Setup Next.js + Neon, criar rota /notificar, implementar formulario 3-passos

### 2. Middleware de Anonimizacao
**Valor:** 10/10 | **Esforco:** 3/10 | **ROI:** 3.33
**Por que:** Requisito obrigatorio LGPD, sem isso o sistema nao pode ser implantado
**Proximos passos:** Implementar pipeline que stripa IP/user-agent antes da persistencia se toggle anonimo ativo

### 3. Stack Next.js + Vercel + Neon
**Valor:** 9/10 | **Esforco:** 2/10 | **ROI:** 4.50
**Por que:** Custo zero inicial, escalabilidade automatica, zero gerenciamento de servidores
**Proximos passos:** Configurar projeto Next.js, conectar Neon, deploy na Vercel

### 4. Dashboard Gerencial + OAuth Google
**Valor:** 8/10 | **Esforco:** 5/10 | **ROI:** 1.60
**Por que:** Essencial para gestao municipal acompanhar indicadores por USF
**Proximos passos:** Subdominio separado, integracao OAuth Google Workspace, KPIs de incidentes

### 5. Testes LGPD + Carga
**Valor:** 9/10 | **Esforco:** 4/10 | **ROI:** 2.25
**Por que:** Garantia de conformidade legal e performance em pico
**Proximos passos:** Suites de teste automatizadas para anonimizacao e carga

## Key Insights

1. **Anonimato como padrao** simplifica a conformidade LGPD e reduz atrito no cadastro
2. **QR Code perpetuo com parametro USF** elimina necessidade de cadastro do cidadao
3. **Separacao formulario publico dashboard gerencial** e critical para seguranca
4. **Stack serverless (Vercel + Neon)** e ideal para orcamento limitado do setor publico
5. **MVP de 4 semanas** e viavel focando apenas no fluxo de notificacao

## Proximos Passos

1. Handoff para @pm (Morgan) -> Criacao do PRD formal
2. Handoff para @architect (Eris) -> System Design Document
3. Criacao das Stories em docs/stories/
4. Implementacao do MVP

## Metadata

- Ideas Generated: 17
- Categorias Identificadas: 5
- Agentes Participados: 5
- Duracao: ~30 min
- Arquivo fonte: solicitacao_inicial.md
