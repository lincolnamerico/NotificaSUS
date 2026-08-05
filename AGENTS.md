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
  - `gestao/` — Dashboard gerencial (login, dashboard, layout)
  - `api/notificar/` — POST /api/notificar
  - `api/usf/` — GET /api/usf
  - `api/gestao/dashboard/` — KPIs + gráficos
  - `api/gestao/exportar/dados/` — CSV/JSON export com LGPD
  - `api/auth/[...nextauth]/` — NextAuth v5 route handler
- `src/lib/db/` — Drizzle schema (`schema.ts`) + Neon connection (`index.ts`)
- `src/lib/auth/auth.ts` — NextAuth v5 config (Google OAuth). Proteção de `/gestao/*` NO `authorized()` callback + checagem `auth()` nas rotas (NÃO existe `middleware.ts`)
- `src/app/gestao/(protected)/layout.tsx` — Redirect `/gestao/*` → `/gestao/login` quando não autenticado
- Autorização por papel (`usuario.papel`: admin/gestor/visualizador) é verificada dentro das rotas de API — ex. `/api/gestao/exportar/dados` retorna 403 para `visualizador`; usuários precisam existir na tabela `usuario` (via `npm run seed`)
- `src/lib/middleware/` — LGPD anonymization (`anonimizacao.ts`)
- `src/lib/services/` — Agregação (`agregacao.ts`) + Exportação (`exportacao.ts`)
- `src/components/formulario/` — 3-step form (tipo, descricao, revisao)
- `src/components/ui/` — Shared UI (consentimento-lgpd, loading-skeleton)
- `src/utils/` — Protocolo generator (`protocolo.ts`, format `NOT-YYYYMMDD-XXXX`)
- `src/seed.ts` — Seed de USFs/usuários (`npm run seed`)
- `docs/stories/` — Numbered stories (e.g. `1.4-formulario-notificacao-3-passos.md`)
- `docs/qa/gates/` — QA gate YAMLs
- `drizzle/` — Generated migrations
- `drizzle.config.ts` — Drizzle kit config (dialect: postgresql, schema: `./src/lib/db/schema.ts`)

### Test layout
Tests are colocated in `__tests__/` next to source files. 11 test files total.

**Key test file locations:**
- `src/lib/middleware/__tests__/anonimizacao.test.ts` — LGPD middleware
- `src/lib/db/__tests__/usf.test.ts` — USF queries
- `src/lib/services/__tests__/agregacao.test.ts` — Aggregation service
- `src/lib/services/__tests__/exportacao.test.ts` — Export service
- `src/app/api/notificar/__tests__/route.test.ts` — POST /api/notificar
- `src/app/api/usf/__tests__/route.test.ts` — GET /api/usf
- `src/components/formulario/__tests__/formulario.test.tsx` — Form UX

### DB driver split
- **Runtime (serverless):** `@neondatabase/serverless` + `drizzle-orm/neon-http`
- **CLI (drizzle-kit):** `pg` driver for local migrations/push
- Connection: `src/lib/db/index.ts` exports `db` from `drizzle(sql, { schema })`
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
| `npm run seed` | Popula USFs + usuários (`npx dotenv-cli -e .env.local`) |
| `npx drizzle-kit push` | Aplica schema ao Neon PostgreSQL (dev rápido) |
| `npx drizzle-kit generate` | Gera migracoes a partir do schema |
| `npx drizzle-kit migrate` | Aplica migracoes pendentes |

### Vitest caveats
- Test env defaults to `node` (`vitest.config.ts`). Component tests use `// @vitest-environment jsdom` pragma.
- Tests colocated in `__tests__/` — vitest config includes `src/**/*.test.{ts,tsx}`
- Path alias `@/` maps to `./src/*` (configured in both `tsconfig.json` and `vitest.config.ts`)

### Database workflow
- **Schema first:** Edit `src/lib/db/schema.ts` → run `npx drizzle-kit generate` → run `npx drizzle-kit migrate`
- For rapid prototyping during dev: `npx drizzle-kit push` (no migration file created)
- Existing migration: `drizzle/0000_abandoned_betty_ross.sql`

Copy `.env.example` to `.env.local` and fill before running the project.
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
