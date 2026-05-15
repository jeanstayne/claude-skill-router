# Nano Banana Provider

Provider de geração de imagem via Gemini (Google).

## Perfil

- **ID:** `nano-banana`
- **Fonte:** skills.sh (`ai-image-generation`)
- **Provider:** Google (Gemini)
- **Risco:** `high`
- **Execução automática:** NUNCA permitida

## Melhor para

- Imagens fotorealistas de paisagem
- Hero sections de agro/natureza
- Cenas cinematográficas com golden hour
- Backgrounds naturais sem texto
- Fotografia editorial de campo

## Requisitos

- `GEMINI_API_KEY` configurada como env var
- Confirmação explícita do usuário (`confirm: true`)
- Brief de imagem em `.claude/image-briefs/` antes da execução
- Rede e API externa

## Command preview (dry-run)

```
npx skills run ai-image-generation --prompt "..." --api-key <GEMINI_API_KEY>
```

API key é sempre mascarada no output.

## Skill relacionada

- **External skill:** `ai-image-generation` (registry/external-skills/ai-image-generation.json)
- **Orchestrator:** `site-image-generation-orchestrator`

## Regras Policy Guard

- `[high] image-generation-never-auto-executes`
- `[high] image-provider-api-keys-never-hardcoded`
- `[high] nano-banana-execution-requires-confirm`
- `[medium] image-provider-registry-schema-required`
- `[medium] image-brief-required-before-provider-execution`
