# Skill Router Autopilot

## Instalação local no projeto

Copiar para:

```txt
.claude/skills/skill-router-autopilot/SKILL.md
```

## Uso

Depois de instalada, peça normalmente:

```txt
Crie uma LP premium para Samar.
```

O Claude deve chamar o MCP `route_request` antes de implementar.

## Segurança

A skill sempre exige dry-run antes de mutação.
