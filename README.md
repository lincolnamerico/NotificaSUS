<p align="center">
  <img src="https://img.shields.io/badge/NotificaSUS-v1.0.0-1a3a5c?style=for-the-badge" alt="NotificaSUS v1.0.0" />
  <img src="https://img.shields.io/badge/Next.js-16-blue?style=for-the-badge" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge" alt="TypeScript 5.x" />
  <img src="https://img.shields.io/badge/LGPD-Compliant-00a86b?style=for-the-badge" alt="LGPD Compliant" />
</p>

# NotificaSUS

Sistema de Notificação de Incidentes relacionados à Segurança do Paciente em Unidades de Saúde da APS — Prefeitura de Pinhais, PR.

Plataforma mobile-first para registro anônimo de incidentes em unidades de saúde via QR Code, com dashboard administrativo para gestão e relatórios. Totalmente aderente à LGPD.

## Funcionalidades

- **Formulário público** (`/notificar`) — Registro anônimo de incidentes em 3 passos com autopreenchimento via `?usf=slug`
- **Categorias NotiVISA** — Queda de paciente, erro de medicação, IRAS, falha de equipamento, violência/agressão, outros
- **Protocolo único** — Formato `NOT-YYYYMMDD-XXXX` com hash curto e retry em colisão
- **LGPD First** — Modo anônimo ativado por padrão, consentimento obrigatório, IP/headers identificáveis descartados
- **QR Code** — Cadastro por unidade de saúde com autopreenchimento automático
- **Dashboard** (em desenvolvimento) — Gestão de notificações, relatórios e administração

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript 5.x |
| Estilo | Tailwind CSS 4.x |
| ORM | Drizzle ORM 0.45.x |
| Banco | Neon PostgreSQL |
| Autenticação | NextAuth v5 (Google OAuth) |
| Testes | Vitest 4.x |

## Começando

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais (DATABASE_URL, AUTH_SECRET, etc.)

# Executar migrações
npm run db:push

# Iniciar dev server
npm run dev
```

### Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm test` | Vitest (testes unitários e de integração) |

## Estrutura

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth route handler
│   │   ├── notificar/           # POST /api/notificar
│   │   └── usf/                 # GET /api/usf
│   ├── notificar/
│   │   ├── page.tsx             # Formulário público
│   │   └── confirmacao/         # Tela de protocolo
│   ├── gestao/                  # Dashboard (em desenvolvimento)
│   └── layout.tsx
├── components/
│   ├── formulario/              # Formulário 3 passos
│   └── ui/                      # Componentes compartilhados
├── lib/
│   ├── auth/                    # NextAuth config
│   ├── db/                      # Schema Drizzle + conexão
│   └── middleware/              # Anonimização LGPD
└── utils/                       # Gerador de protocolo
```

## Subdomínio Gestão

Em produção, o dashboard gerencial opera em subdomínio separado (`gestao.pinhais.pr.gov.br`) para isolar a área administrativa do formulário público.

### Configuração de DNS

1. Adicione um registro CNAME em `gestao.pinhais.pr.gov.br` apontando para `cname.vercel-dns.com`
2. No Vercel, adicione o domínio `gestao.pinhais.pr.gov.br` ao projeto
3. Configure a variável de ambiente:
   - `GESTAO_URL=https://gestao.pinhais.pr.gov.br`
   - `NEXT_PUBLIC_GESTAO_URL=https://gestao.pinhais.pr.gov.br`

### Comportamento em Desenvolvimento

Em dev local (`localhost`), `/gestao/*` funciona normalmente sem subdomínio.
Os redirects condicionais e `assetPrefix` só são ativados em produção.

### Cookies

O cookie de sessão NextAuth usa `domain: .pinhais.pr.gov.br` para funcionar
entre o domínio principal e o subdomínio de gestão.

## API

### `GET /api/usf`
Retorna lista de Unidades de Saúde ativas.

### `POST /api/notificar`
Cria uma notificação anônima.

```json
{
  "usfId": "uuid",
  "tipoIncidente": "queda-paciente",
  "descricao": "Relato do incidente",
  "grauDano": "leve|moderado|grave|obito",
  "acoesTomadas": "(opcional)",
  "anonimo": true
}
```

Resposta:
```json
{
  "protocolo": "NOT-20260728-A3F2",
  "success": true,
  "anonimo": true
}
```

## Licença

MIT — Prefeitura Municipal de Pinhais, Paraná.
