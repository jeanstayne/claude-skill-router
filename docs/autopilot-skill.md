# Skill Router Autopilot

## O que é

O Skill Router Autopilot é uma skill que orienta o Claude Code a ativar automaticamente o `claude-skill-router` quando detecta pedidos relacionados a landing pages, sites, dashboards, UI, design system, revisão visual ou copy de conversão.

## Quando usar

- Criar landing page ou LP
- Melhorar landing page existente
- Criar site institucional
- Criar ou melhorar dashboard
- Criar sistema SaaS com interface
- Criar ou melhorar UI
- Criar design system
- Melhorar visual de página
- Transformar print em layout
- Revisar qualidade visual
- Melhorar copy de página
- Criar sitemap ou wireframe

## Instalação no projeto

```bash
skill-router install-autopilot --project ./meu-projeto --dry-run
skill-router install-autopilot --project ./meu-projeto --confirm
```

## Instalação com CLAUDE.md

```bash
skill-router install-autopilot --project ./meu-projeto --with-claude-md --dry-run
skill-router install-autopilot --project ./meu-projeto --with-claude-md --confirm
```

## Instalação global

```bash
skill-router install-autopilot --scope global --dry-run
skill-router install-autopilot --scope global --confirm
```

## Uso no chat

Depois de instalada, peça normalmente:

```txt
Crie uma LP premium para Samar com visual Lovable.
```

## Fluxo esperado

1. Claude ativa a skill.
2. Claude chama `route_request`.
3. Claude chama `prepare_project_for_request` em dry-run.
4. Claude mostra plano.
5. Usuário confirma.
6. Claude aplica pack.
7. Claude implementa.

## Segurança

- Dry-run por padrão.
- Confirm obrigatório para mutação.
- Engines externas apenas sugeridas, nunca chamadas automaticamente.
