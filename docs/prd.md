# NotificaSUS Product Requirements Document (PRD)

**Versao:** 1.1
**Data:** 2026-07-29
**Autor:** @pm (Morgan)
**Status:** Active (v1.0 deployed)

## 1. Goals and Background Context

### Goals
1. Permitir que cidadaos notifiquem incidentes em saude via QR Code nas USFs de Pinhais/PR em menos de 2 minutos
2. Garantir conformidade total com a LGPD atraves de registro anonimo por padrao
3. Viabilizar exportacao futura dos dados para o sistema NotiVISA (ANVISA)
4. Dar a gestao municipal visibilidade dos incidentes por USF via dashboard
5. Manter custo de infraestrutura proximo a zero para a prefeitura

### Background Context
A Secretaria de Saude de Pinhais/PR precisa de um sistema web para registro de incidentes e eventos adversos relacionados a seguranca do paciente. Atualmente nao ha canal digital padronizado — cidadaos e servidores nao tem meios simples de reportar ocorrencias. A solucao proposta usa QR Codes impressos fixados nas recepcoes das USFs, direcionando a um formulario mobile-first. O sistema prioriza o anonimato (LGPD), mapeamento futuro com o NotiVISA e dashboards gerenciais para tomada de decisao.

### Deployment
- **URL:** https://notificasus.vercel.app
- **Plataforma:** Vercel (gegpo/notificasus)
- **Banco:** Neon PostgreSQL (conta lincolnamerico@gmail.com)
- **Auth Google:** Client ID configurado (lincolnamerico@gmail.com)
- **Repo:** https://github.com/lincolnamerico/NotificaSUS

### Environment Variables (Vercel Production)
| Variavel | Origem |
|----------|--------|
| DATABASE_URL | Neon PostgreSQL |
| AUTH_SECRET | Gerado via `npx auth secret` |
| AUTH_GOOGLE_ID | Google Cloud Console |
| AUTH_GOOGLE_SECRET | Google Cloud Console |

### Change Log
| Data | Versao | Descricao | Autor |
|------|--------|-----------|-------|
| 2026-07-28 | 1.0 | Versao inicial do PRD | @pm (Morgan) |
| 2026-07-29 | 1.1 | Todas as Epics 1-3 completas; deploy Vercel + Neon + Google OAuth configurados; docs atualizadas | @dev |

## 2. Requirements

### Functional

| ID | Descricao | Status |
|----|-----------|--------|
| FR1 | QR Code estatico redireciona para formulario com autopreenchimento da USF via parametro na URL (`?usf=slug`) | ✅ |
| FR2 | Toggle "Registro Anonimo" — quando ativado, nenhum dado de identificacao (IP, e-mail, nome, telefone) e persistido | ✅ |
| FR3 | Fluxo de notificacao em 3 passos: (1) Tipo de incidente, (2) Descricao e gravidade, (3) Confirmacao com protocolo | ✅ |
| FR4 | Feedback visual imediato com numero de protocolo anonimo apos submissao | ✅ |
| FR5 | Dashboard gerencial com visao por USF, KPIs de incidentes, gravidade, volume temporal, graficos estratificados | ✅ |
| FR6 | Exportacao de dados no formato CSV/JSON com anonimizacao LGPD e RBAC | ✅ |
| FR7 | Relatorios mensais automaticos em PDF enviados por e-mail a gestao | ⏳ Pendente |
| FR8 | Autenticacao via OAuth Google Workspace da prefeitura para acesso ao dashboard | ✅ |
| FR9 | Job semanal para gerar lote de exportacao NotiVISA | ⏳ Pendente |

### Non-Functional

| ID | Descricao | Status |
|----|-----------|--------|
| NFR1 | Interface mobile-first, responsiva e acessiveis (WCAG 2.1 AA) | ✅ |
| NFR2 | Tempo maximo de preenchimento do formulario < 2 minutos | ✅ |
| NFR3 | Zero armazenamento de dados pessoais quando modo anonimo ativo — middleware stripa IP/user-agent antes do banco | ✅ |
| NFR4 | Suporte a 100+ acessos simultaneos por USF sem degradacao | ⏳ Pendente (testes k6) |
| NFR5 | URL permanente sob dominio oficial da prefeitura (`pinhais.pr.gov.br/notificar`) — proibido encurtadores de terceiros | ⏳ Pendente DNS |
| NFR6 | Stack: Next.js (SSR) + PostgreSQL serverless (Vercel + Neon) + Tailwind CSS | ✅ |
| NFR7 | Testes automatizados de conformidade LGPD validando anonimizacao | ✅ |
| NFR8 | Testes de carga para validar performance em pico | ⏳ Pendente |

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
- Dominio `pinhais.pr.gov.br/notificar` com redirecionamento via servicos oficiais da prefeitura ⏳
- QR Code estatico impresso permanentemente nas recepcoes ⏳
- Middleware de anonimizacao executado antes de qualquer persistencia ✅
- Dashboard em subdominio separado (`gestao.pinhais.pr.gov.br`) com RBAC ✅ configurado, ⏳ DNS pendente

### Vercel Environment (deployed 2026-07-29)
- Projeto: `gegpo/notificasus`
- URL: https://notificasus.vercel.app
- GitHub: https://github.com/lincolnamerico/NotificaSUS (conectado)
- Env Vars configuradas: DATABASE_URL, AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET
- Conta Vercel: lincolnamerico@gmail.com
- Next.js 16.2.12 (Turbopack build)

## 5. Epics

### Epic 1: Fundacao & Infraestrutura (v1.0) ✅ COMPLETE
Setup inicial do projeto Next.js + Neon + Vercel, rota `/notificar` com autopreenchimento USF, middleware de anonimizacao, formulario publico de 3 passos e toggle anonimo.

**Stories:**
1.1 ✅ Setup Inicial do Projeto
1.2 ✅ Rota de Notificacao com Autopreenchimento
1.3 ✅ Middleware de Anonimizacao
1.4 ✅ Formulario de Notificacao (3 Passos)
1.5 ✅ Confirmacao com Protocolo

### Epic 2: Dashboard & Gestao (v1.0) ✅ COMPLETE
Dashboard gerencial com OAuth Google, visao por USF, KPIs de incidentes, graficos de gravidade e volume temporal, graficos estratificados com Recharts.

**Stories:**
2.1 ✅ Autenticacao OAuth Google
2.2 ✅ Dashboard com KPIs por USF
2.3 ✅ Subdominio Segregado (gestao.pinhais.pr.gov.br)

### Epic 3: Dashboard Avancado & Exportacao (v1.0) ✅ COMPLETE
Schema de dados estendido com campos de classificacao/severidade, servico de agregacao para graficos estratificados, API de exportacao CSV/JSON com anonimizacao LGPD, componentes Recharts com loading/empty states, painel de exportacao com confirmacao LGPD, RBAC para exportacao.

**Stories:**
3.0 ✅ Dashboard Avancado & Exportacao (implementado como unica story)

### Epic 4: Integracao NotiVISA & Relatorios (v1.1, futuro)
API de exportacao CSV/JSON (ja implementado no Epic 3), job semanal de exportacao compativel com schema ANVISA, geracao automatica de relatorios mensais em PDF.

**Stories (pendentes):**
4.1 Job Semanal de Exportacao Automatica
4.2 Relatorios Mensais em PDF
4.3 Integracao Direta com schema NotiVISA

### Epic 5: Inovacoes Futuras (v2.0+)
Painel publico anonimo, chatbot de triagem, notificacao WhatsApp, QR Code com token, workflow Comissao de Seguranca do Paciente.

## 6. Environment Setup (2026-07-29)

### Contas Criadas
| Servico | Email | Uso |
|---------|-------|-----|
| Vercel | lincolnamerico@gmail.com | Deploy e hosting |
| Neon PostgreSQL | lincolnamerico@gmail.com | Banco de dados serverless |
| Google Cloud Console | lincolnamerico@gmail.com | OAuth 2.0 para login |

### Variaveis de Ambiente (Vercel Production)
```
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
AUTH_SECRET=<gerado via npx auth secret>
AUTH_GOOGLE_ID=<Google OAuth Client ID>
AUTH_GOOGLE_SECRET=<Google OAuth Client Secret>
```

### Arquivo .env.local (desenvolvimento local)
Presente em `C:\Users\lincoln.rodrigues\Desktop\antigravity\NotificaSUS\.env.local` com as mesmas variaveis.

## 7. Current Status & Next Steps

### Deployed
- **URL:** https://notificasus.vercel.app
- **Formulario Publico:** https://notificasus.vercel.app/notificar
- **Login Gestao:** https://notificasus.vercel.app/gestao/login
- **Dashboard:** https://notificasus.vercel.app/gestao/dashboard

### Bloqueado
- Login com Google OAuth exige email `@pinhais.pr.gov.br` (dominio da prefeitura)
- Dominio oficial da prefeitura (`pinhais.pr.gov.br/notificar`) depende da Secretaria de Saude
- Vercel CLI nao autenticado para preview/development environments (apenas production)

### Proximos Passos
1. **Job Semanal de Exportacao** — Cron via Vercel ou GitHub Actions para exportacao periodica
2. **Relatorios PDF** — Geracao server-side de relatorios mensais
3. **Integracao NotiVISA** — Mapeamento do schema ANVISA para exportacao direta
4. **Workflow Comissao de Seguranca do Paciente** — Validacao, reclassificacao, confirmacao de severidade
5. **Testes de Carga (k6)** — 100+ acessos simultaneos
6. **E2E (Playwright)** — Fluxo completo QR Code → formulario → confirmacao
7. **Deploy em dominio oficial** — Apos configuracao DNS da prefeitura
