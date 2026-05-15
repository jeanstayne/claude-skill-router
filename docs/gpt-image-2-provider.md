# GPT Image 2 Provider

Provider de geração de imagem via OpenAI (DALL-E).

## Perfil

- **ID:** `gpt-image-2`
- **Fonte:** skills.sh (`gpt-image-2`)
- **Provider:** OpenAI
- **Risco:** `high`
- **Execução automática:** NUNCA permitida

## Melhor para

- Imagens com texto controlado (brand-safe)
- Mockups de produto
- Criativos de anúncio
- Edição iterativa de imagem (image-to-image)
- Hero sections com texto/slogan

## Requisitos

- `OPENAI_API_KEY` configurada como env var
- Confirmação explícita do usuário (`confirm: true`)
- Brief de imagem em `.claude/image-briefs/` antes da execução
- Rede e API externa

## Command preview (dry-run)

```
npx skills run gpt-image-2 --prompt "..." --api-key <OPENAI_API_KEY>
```

API key é sempre mascarada no output.

## Skill relacionada

- **External skill:** `gpt-image-2` (registry/external-skills/gpt-image-2.json)
- **Orchestrator:** `site-image-generation-orchestrator`

## Regras Policy Guard

- `[high] image-generation-never-auto-executes`
- `[high] image-provider-api-keys-never-hardcoded`
- `[high] gpt-image-2-execution-requires-confirm`
- `[medium] image-provider-registry-schema-required`
- `[medium] image-brief-required-before-provider-execution`
