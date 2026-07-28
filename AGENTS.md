# AGENTS.md - NotificaSUS

<!-- AIOX-MANAGED-START: core -->
## Core Rules

1. Read `docs/prd.md` and `docs/architecture.md` before coding
2. Work from stories in `docs/stories/` — each has acceptance criteria and checklists
3. Update story checkboxes ([ ] -> [x]) and File List as you go
4. Never invent requirements outside existing PRD/architecture/stories
5. LGPD compliance is not optional: anonimização middleware runs before DB writes
6. Siga a Constitution em `.aiox-core/constitution.md`
7. Priorize CLI First -> Observability Second -> UI Third
<!-- AIOX-MANAGED-END: core -->

<!-- AIOX-MANAGED-START: quality -->
## Quality Gates (run in this order)

- `npm run lint`
- `npm run typecheck`
- `npm run test` (or `npm run test:watch` for watch mode)
- Update story checklist and File List before concluding
<!-- AIOX-MANAGED-END: quality -->

<!-- AIOX-MANAGED-START: codebase -->
## Project Map

- `src/app/` — Next.js App Router pages + API routes
  - `notificar/` — Formulário público (page + confirmacao/)
  - `gestao/` — Dashboard gerencial (empty, WIP)
  - `api/notificar/` — POST /api/notificar
  - `api/usf/` — GET /api/usf
  - `api/auth/[...nextauth]/` — NextAuth v5 route handler
- `src/lib/db/` — Drizzle schema (`schema.ts`) + connection (`index.ts`, Neon PostgreSQL)
- `src/lib/auth/` — NextAuth v5 config (Google OAuth, only @pinhais.pr.gov.br)
- `src/lib/middleware/` — LGPD anonymization (`anonimizacao.ts`)
- `src/components/formulario/` — 3-step form (tipo, descricao, revisao)
- `src/components/ui/` — Shared UI (consentimento-lgpd)
- `src/utils/` — Protocolo generator (`protocolo.ts`, format `NOT-YYYYMMDD-XXXX`)
- `docs/stories/` — Numbered stories (e.g. `1.4-formulario-notificacao-3-passos.md`)
- `docs/qa/gates/` — QA gate YAMLs
- `drizzle/` — Generated migrations
- `drizzle.config.ts` — Drizzle kit config (schema: `./src/lib/db/schema.ts`)
<!-- AIOX-MANAGED-END: codebase -->

<!-- AIOX-MANAGED-START: commands -->
## Commands

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (Next.js) |
| `npm run build` | Build de producao |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest (modo run) |
| `npm run test:watch` | Vitest (modo watch) |
| `npx drizzle-kit push` | Aplica schema ao Neon PostgreSQL |
| `npx drizzle-kit generate` | Gera migracoes a partir do schema |

Copy `.env.example` to `.env.local` and fill before running the project.

DB schema lives at `src/lib/db/schema.ts`. Path alias `@/` maps to `./src/*`.
<!-- AIOX-MANAGED-END: commands -->

<!-- AIOX-MANAGED-START: shortcuts -->
## Agent Shortcuts

Interprete os atalhos abaixo carregando o arquivo correspondente em `.aiox-core/development/agents/` (fallback: `.codex/agents/`):

- `@architect`, `/architect` -> `.aiox-core/development/agents/architect.md`
- `@dev`, `/dev` -> `.aiox-core/development/agents/dev.md`
- `@qa`, `/qa` -> `.aiox-core/development/agents/qa.md`
- `@pm`, `/pm` -> `.aiox-core/development/agents/pm.md`
- `@po`, `/po` -> `.aiox-core/development/agents/po.md`
- `@sm`, `/sm` -> `.aiox-core/development/agents/sm.md`
- `@analyst`, `/analyst` -> `.aiox-core/development/agents/analyst.md`
- `@devops`, `/devops` -> `.aiox-core/development/agents/devops.md`
- `@data-engineer`, `/data-engineer` -> `.aiox-core/development/agents/data-engineer.md`
- `@ux-design-expert`, `/ux-design-expert` -> `.aiox-core/development/agents/ux-design-expert.md`
- `@squad-creator`, `/squad-creator` -> `.aiox-core/development/agents/squad-creator.md`
- `@aiox-master`, `/aiox-master` -> `.aiox-core/development/agents/aiox-master.md`
<!-- AIOX-MANAGED-END: shortcuts -->
