# Relatório da Fase 4 — Installer Seguro

## Objetivo da fase

Implementar o instalador seguro de skill packs com dry-run, backup automático, validação de workspace boundary e manifesto.

## Arquivos alterados

- `packages/core/src/installer/safeFs.ts` — Operações de fs seguras com validação de workspace boundary
- `packages/core/src/installer/backupProjectFiles.ts` — Backup automático antes de sobrescrever
- `packages/core/src/installer/installSkillPack.ts` — Instalador completo com suporte a dry-run
- `packages/core/src/installer/cleanupUnusedSkills.ts` — Cleanup conservador (MVP sem remoção automática)
- `packages/core/src/installer/generateClaudeMdPatch.ts` — Patch de CLAUDE.md
- `packages/core/tests/installer.test.ts` — 13 testes

## Implementação realizada

### safeFs
- `ensureDir` — Cria diretório com validação de workspace
- `safeWriteFile` — Escreve arquivo com validação de path
- `safeCopyFile` — Copia arquivo com validação
- Validação de segurança: bloqueia escrita fora do projectPath
- Modo dry-run suportado em todas as operações

### backupProjectFiles
- Cria backup em `.claude/backups/backup-<timestamp>/`
- Preserva estrutura de diretórios
- Trata arquivos inexistentes sem erro
- Retorna lista de arquivos backupados e erros

### installSkillPack
- Carrega registry e valida existência do pack
- Backup automático antes de modificações
- Cria estrutura `.claude/skills/`, `.claude/agents/`, `.claude/prompts/`
- Copia skills com SKILL.md + metadata.json
- Copia agents do registry
- Gera manifesto `skill-router.json`
- Modo dry-run: relata operações sem executar

### cleanupUnusedSkills
- Lê manifesto para identificar arquivos gerenciados
- MVP: conservador — não remove nada automaticamente
- Só age quando há manifesto válido

### generateClaudeMdPatch
- Adiciona seção "Active Skills (managed by claude-skill-router)"
- Detecta seção existente para substituição
- Backup antes de modificar

## Testes executados

13 testes do installer:
- safeFs: 5 testes (criação dir, dry-run, escrita, dry-run escrita, segurança workspace boundary)
- backup: 2 testes (backup de arquivo existente, arquivo inexistente)
- installSkillPack: 4 testes (dry-run sem criar arquivos, criação real, pack inexistente, target inexistente)
- cleanup: 2 testes (sem manifesto, sem .claude)

## Resultado dos testes

**72 testes passando** (59 core + 6 CLI + 7 MCP)

## Typecheck

Passando em todos os 4 pacotes.

## Build

Passando em todos os 4 pacotes.

## Policy Guard

Passando — 0 violações.

## Problemas encontrados

1. Path assertion no Windows: `toContain('.claude/backups/')` falhava por usar backslashes. Corrigido para regex `toMatch(/backup-/)`.

## Riscos

- Cleanup é conservador demais no MVP — não remove skills não utilizadas
- Backup é local (mesmo disco) — não protege contra falha de disco

## Pendências

- Cleanup automático de skills removidas do pack
- Restore de backup
- Validação de integridade após instalação

## Status final

**Concluído**
