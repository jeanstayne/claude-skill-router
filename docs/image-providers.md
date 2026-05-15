# Image Providers Registry

Registry de providers de geração de imagem suportados pelo claude-skill-router.

## Providers disponíveis

| ID | Nome | Melhor para | Risco |
|----|------|-------------|-------|
| `gpt-image-2` | GPT Image 2 | Mockups, ads, imagens com texto | high |
| `nano-banana` | Nano Banana | Paisagens, hero fotorealista, agro | high |

## Estrutura de um provider

```json
{
  "id": "gpt-image-2",
  "name": "GPT Image 2",
  "category": "image-generation",
  "provider": "openai",
  "bestFor": ["brand-safe website visuals", "hero section images", "ad creatives"],
  "supports": {
    "textToImage": true,
    "imageToImage": true,
    "multiReference": true,
    "transparentBackground": false
  },
  "requiresExternalExecution": true,
  "requiresNetwork": true,
  "requiresApiKey": true,
  "envVars": ["OPENAI_API_KEY"],
  "autoExecuteAllowed": false,
  "dryRunDefault": true,
  "riskLevel": "high"
}
```

## Regras de segurança

1. Nenhum provider pode ter `autoExecuteAllowed: true`
2. Todo provider requer `dryRunDefault: true`
3. API keys devem vir exclusivamente de env vars
4. Nenhum hardcode de credenciais no código fonte

## Localização

```
registry/image-providers/gpt-image-2.json
registry/image-providers/nano-banana.json
```

## MCP Tools relacionadas

- `list_image_providers` — Lista todos os providers
- `recommend_image_provider` — Recomenda melhor provider para um request
- `generate_image_brief_v2` — Gera brief detalhado
- `generate_image_prompts` — Gera prompts específicos por provider
- `plan_image_generation` — Plano completo (brief + prompts + command preview)

## CLI Commands

```bash
skill-router image-providers --json
skill-router image-provider-recommend --request "..." --purpose hero
skill-router image-brief-v2 --request "..." --brand "Destaque Agro" --provider nano-banana
skill-router image-prompts --request "..." --provider nano-banana
skill-router image-plan --project . --request "..." --provider gpt-image-2 --dry-run
```
