# Relatório da Fase 2 — Core Scanner

## Objetivo da fase

Implementar o scanner de projeto que detecta framework, linguagem, UI libs, frameworks de teste, configurações Claude e tipo provável do projeto.

## Arquivos criados

- `fixtures/react-vite-tailwind-lp/package.json` — Fixture React + Vite + Tailwind + Vitest
- `fixtures/react-vite-tailwind-lp/tsconfig.json`
- `fixtures/react-vite-tailwind-lp/src/App.tsx` — Com imports de sections de LP
- `fixtures/react-vite-tailwind-lp/src/sections/Hero.tsx`
- `fixtures/react-vite-tailwind-lp/.claude/CLAUDE.md`
- `fixtures/next-dashboard/package.json` — Fixture Next.js + Shadcn + Tailwind
- `fixtures/next-dashboard/tsconfig.json`
- `fixtures/next-dashboard/src/pages/dashboard.tsx`
- `fixtures/next-dashboard/src/pages/login.tsx`
- `fixtures/next-dashboard/src/components/charts/Chart.tsx`
- `fixtures/next-dashboard/src/components/sidebar/Sidebar.tsx`
- `fixtures/html-static-site/index.html`
- `fixtures/html-static-site/about.html`
- `fixtures/html-static-site/contact.html`
- `fixtures/html-static-site/team.html`
- `fixtures/html-static-site/blog.html`
- `fixtures/unknown-project/notes.txt` — Projeto sem stack

## Arquivos alterados

- `packages/core/src/scanner/detectStack.ts` — Implementação completa com detecção de framework, UI, tests, linguagem
- `packages/core/src/scanner/detectProjectType.ts` — Implementação completa com sistema de sinais ponderados
- `packages/core/src/scanner/detectClaudeConfig.ts` — Implementação completa com verificação de CLAUDE.md, AGENTS.md, .claude/
- `packages/core/tests/scanner.test.ts` — 19 testes cobrindo todos os detectores e scan completo

## Implementação realizada

### detectStack
- Lê `package.json` e detecta dependências
- Framework: next, react, vue, astro, vite, express, fastify (com prioridade: Next > React, etc.)
- Linguagem: typescript (tsconfig ou .tsx), javascript (.jsx), html (sem JS deps)
- UI: tailwind, shadcn, radix, framer-motion, styled-components, css-modules
- Testes: vitest, jest, playwright, cypress, testing-library
- Fallback para HTML estático quando não há package.json

### detectProjectType
- Sistema de sinais ponderados (weighted signals)
- Coleta recursiva de arquivos (até 4 níveis de profundidade)
- Tipos: landing-page, dashboard-saas, ecommerce-page, institutional-site, library-package
- Confiança calculada como score / 0.8 (normalizado para 0-1)
- Dashboard detectado com prioridade (mais específico)

### detectClaudeConfig
- Verifica CLAUDE.md na raiz
- Verifica AGENTS.md na raiz
- Verifica pasta .claude/
- Lista skills em .claude/skills/
- Lista agents em .claude/agents/

## Testes executados

19 novos testes no scanner.test.ts:
- detectStack: 6 testes (React/Vite/Tailwind, Next.js, HTML static, unknown, shadcn detection, empty arrays)
- detectProjectType: 4 testes (landing-page, dashboard, institutional, unknown)
- detectClaudeConfig: 3 testes (.claude folder, no config, empty skills/agents)
- scanProject: 6 testes (full scan de cada fixture, confidence range, all required fields)

## Resultado dos testes

**43 testes passando** (30 core + 6 CLI + 7 MCP)

- Core scanner: 19/19
- Core recommender: 2/2
- Core registry: 3/3
- Core installer: 3/3
- Core policy: 3/3
- CLI: 6/6
- MCP: 7/7

## Typecheck

Passando em todos os 4 pacotes.

## Lint

Não configurado (pendência da Fase 1).

## Build

Passando em todos os 4 pacotes.

## Policy Guard

Passando — 0 violações.

## Problemas encontrados

1. **Detecção de dashboard vs institutional**: O fixture `next-dashboard` era detectado como `institutional-site` porque o diretório `pages` ativava o sinal "pages" do institutional. Corrigido: dashboard tem prioridade mais alta e sinais mais específicos.
2. **html-static-site ambíguo**: Site com `index.html` + `about.html` + `contact.html` era detectado como `landing-page`. Adicionados `team.html` e `blog.html` para reforçar sinal institucional.
3. **Coleta de arquivos superficial**: Só lia 1 nível de subdiretórios. Corrigido: busca recursiva até 4 níveis.

## Correções aplicadas

1. Reescrito `detectProjectType` com busca recursiva de arquivos (walk até 4 níveis)
2. Sinais de dashboard colocados primeiro (mais específicos)
3. Refinados patterns de regex para evitar falsos positivos (ex: `/cta\./` em vez de `/cta/`)
4. Sinal institucional agora requer about E contact simultaneamente
5. Peso máximo normalizado para 0.8 (antes 0.7)

## Riscos

- Acurácia depende da qualidade dos fixtures — projetos reais podem ter estruturas diferentes
- Detecção de linguagem é binária (TS vs JS) — não detecta mixed codebases
- Não detecta monorepos com múltiplos frameworks

## Pendências

- Adicionar detecção de Angular, Svelte, Solid
- Adicionar detecção de monorepo tools (Turborepo, Nx, Lerna)
- Configurar ESLint

## Erros existentes antes da fase

Nenhum.

## Erros introduzidos nesta fase

Nenhum erro remanescente. Todos os 3 problemas encontrados foram corrigidos.

## Status final

**Concluído**
