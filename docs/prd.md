# NotificaSUS Product Requirements Document (PRD)

**Versao:** 1.0
**Data:** 2026-07-28
**Autor:** @pm (Morgan)
**Status:** Draft

## 1. Goals and Background Context

### Goals
1. Permitir que cidadaos notifiquem incidentes em saude via QR Code nas USFs de Pinhais/PR em menos de 2 minutos
2. Garantir conformidade total com a LGPD atraves de registro anonimo por padrao
3. Viabilizar exportacao futura dos dados para o sistema NotiVISA (ANVISA)
4. Dar a gestao municipal visibilidade dos incidentes por USF via dashboard
5. Manter custo de infraestrutura proximo a zero para a prefeitura

### Background Context
A Secretaria de Saude de Pinhais/PR precisa de um sistema web para registro de incidentes e eventos adversos relacionados a seguranca do paciente. Atualmente nao ha canal digital padronizado — cidadaos e servidores nao tem meios simples de reportar ocorrencias. A solucao proposta usa QR Codes impressos fixados nas recepcoes das USFs, direcionando a um formulario mobile-first. O sistema prioriza o anonimato (LGPD), mapeamento futuro com o NotiVISA e dashboards gerenciais para tomada de decisao.

### Change Log
| Data | Versao | Descricao | Autor |
|------|--------|-----------|-------|
| 2026-07-28 | 1.0 | Versao inicial do PRD | @pm (Morgan) |

## 2. Requirements

### Functional

| ID | Descricao |
|----|-----------|
| FR1 | QR Code estatico redireciona para formulario com autopreenchimento da USF via parametro na URL (`?usf=slug`) |
| FR2 | Toggle "Registro Anonimo" — quando ativado, nenhum dado de identificacao (IP, e-mail, nome, telefone) e persistido |
| FR3 | Fluxo de notificacao em 3 passos: (1) Tipo de incidente, (2) Descricao e gravidade, (3) Confirmacao com protocolo |
| FR4 | Feedback visual imediato com numero de protocolo anonimo apos submissao |
| FR5 | Dashboard gerencial com visao por USF, KPIs de incidentes, gravidade e volume temporal |
| FR6 | Exportacao de dados no formato CSV/JSON compativel com schema NotiVISA |
| FR7 | Relatorios mensais automaticos em PDF enviados por e-mail a gestao |
| FR8 | Autenticacao via OAuth Google Workspace da prefeitura para acesso ao dashboard |
| FR9 | Job semanal para gerar lote de exportacao NotiVISA |

### Non-Functional

| ID | Descricao |
|----|-----------|
| NFR1 | Interface mobile-first, responsiva e acessiveis (WCAG 2.1 AA) |
| NFR2 | Tempo maximo de preenchimento do formulario < 2 minutos |
| NFR3 | Zero armazenamento de dados pessoais quando modo anonimo ativo — middleware stripa IP/user-agent antes do banco |
| NFR4 | Suporte a 100+ acessos simultaneos por USF sem degradacao |
| NFR5 | URL permanente sob dominio oficial da prefeitura (`pinhais.pr.gov.br/notificar`) — proibido encurtadores de terceiros |
| NFR6 | Stack: Next.js (SSR) + PostgreSQL serverless (Vercel + Neon) + Tailwind CSS |
| NFR7 | Testes automatizados de conformidade LGPD validando anonimizacao |
| NFR8 | Testes de carga para validar performance em pico |

## 3. User Interface Design Goals

### Overall UX Vision
Interface limpa, objetiva e acolhedora — o cidadao pode estar relatando um incidente serio. Design que transmite confianca e seriedade publica. Prioridade maxima para tempo de carregamento e clareza das informacoes.

### Key Interaction Paradigms
1. Leitura do QR Code → Cidadao aponta camera e e levado diretamente ao formulario
2. Autopreenchimento → USF e data/hora sao preenchidos automaticamente via URL
3. Toggle anonimo → Botao visivel e claro no topo do formulario ("Modo Anonimo" ativado por padrao)
4. Confirmacao → Animacao de sucesso + numero de protocolo para o cidadao anotar

### Core Screens and Views
1. **Formulario de Notificacao** — Pagina principal com o formulario de 3 passos
2. **Pagina de Confirmacao** — Protocolo gerado + resumo da notificacao
3. **Dashboard Gerencial** — Visao geral com KPIs, graficos por USF
4. **Relatorios** — Listagem de relatorios gerados com opcao de download PDF/XLSX

### Accessibility
WCAG 2.1 AA — Contraste alto, fontes grandes, suporte a leitores de tela, navegacao por teclado.

### Branding
Padrao visual do municipio de Pinhais/PR — cores institucionais, brasao da prefeitura no cabecalho.

### Target Platform
Web Responsive — otimizado para celulares (acesso via QR Code nas recepcoes) e funcional em desktop para gestao.

## 4. Technical Assumptions

### Repository Structure: Monorepo
Unico repositorio contendo formulario publico, dashboard gerencial e scripts de exportacao.

### Service Architecture: Serverless
- **Frontend/API:** Next.js (SSR) hospedado na Vercel
- **Banco:** PostgreSQL serverless (Neon)
- **Auth:** OAuth Google Workspace via NextAuth
- **PDF Reports:** Geracao server-side
- **Job semanal:** Cron via Vercel ou GitHub Actions

### Testing Requirements
- Testes unitarios + integracao para API e middleware
- Suite especifica de conformidade LGPD (validar que IP nao vaza)
- Testes de carga (100+ usuarios simultaneos)

### Additional Technical Assumptions
- Dominio `pinhais.pr.gov.br/notificar` com redirecionamento via servicos oficiais da prefeitura
- QR Code estatico impresso permanentemente nas recepcoes
- Middleware de anonimizacao executado antes de qualquer persistencia
- Dashboard em subdominio separado (`gestao.pinhais.pr.gov.br`) com RBAC

## 5. Epics

### Epic 1: Fundacao & Infraestrutura (v1.0)
Setup inicial do projeto Next.js + Neon + Vercel, rota `/notificar` com autopreenchimento USF, middleware de anonimizacao, formulario publico de 3 passos e toggle anonimo.

**Stories:**
1.1 Setup Inicial do Projeto
1.2 Rota de Notificacao com Autopreenchimento
1.3 Middleware de Anonimizacao
1.4 Formulario de Notificacao (3 Passos)
1.5 Confirmacao com Protocolo

### Epic 2: Dashboard & Gestao (v1.0)
Dashboard gerencial com OAuth Google, visao por USF, KPIs de incidentes, graficos de gravidade e volume temporal.

**Stories:**
2.1 Autenticacao OAuth Google
2.2 Dashboard com KPIs por USF
2.3 Subdominio Segregado (gestao.pinhais.pr.gov.br)

### Epic 3: Integracao NotiVISA & Relatorios (v1.1)
API de exportacao CSV/JSON, job semanal de exportacao compativel com schema ANVISA, geracao automatica de relatorios mensais em PDF.

**Stories:**
3.1 API de Exportacao CSV/JSON
3.2 Job Semanal de Exportacao Automatica
3.3 Relatorios Mensais em PDF

### Epic 4: Inovacoes Futuras (v2.0+)
Painel publico anonimo, chatbot de triagem, notificacao WhatsApp, QR Code com token.

## 6. Next Steps

1. **@architect (Eris)** — Criar System Design Document e arquitetura detalhada
2. **@ux-design-expert (Nova)** — Especificar UI/UX detalhada
3. **@sm (River)** — Criar stories formais em `docs/stories/`
4. **@dev (Orion)** — Iniciar implementacao das stories
