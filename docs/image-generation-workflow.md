# Image Generation Workflow

Fluxo seguro para gerar briefs e prompts de imagem **sem** executar geração automaticamente.

## Princípio fundamental

> O claude-skill-router **nunca** gera imagens. Ele gera **briefs e prompts** que o usuário usa em ferramentas externas (DALL-E, Midjourney, Stable Diffusion, etc.).

## Fluxo

```
Pedido do usuário → route_request → recommend_external_skills → generate_image_brief → Usuário revisa → Usuário gera manualmente
```

## MCP Tools

### `recommend_external_skills`

Recomenda skills externas relevantes para imagem. Exemplo:

```json
{
  "projectPath": "./meu-projeto",
  "userRequest": "gere imagens para o hero da LP"
}
```

Retorna: `gpt-image-2`, `ai-image-generation`, `canvas-design` com avisos.

### `generate_image_brief`

Gera brief/prompt de imagem estruturado. Exemplo:

```json
{
  "projectPath": "./meu-projeto",
  "userRequest": "hero da landing page",
  "brand": "Samar Agronegócio"
}
```

Retorna:

```json
{
  "brief": {
    "objective": "Imagem principal para hero section de Samar Agronegócio",
    "scene": "Cena profissional representando o produto/serviço...",
    "composition": "Enquadramento wide (16:9)...",
    "style": "Premium, iluminação natural...",
    "prompt": "Professional hero image for Samar Agronegócio...",
    "negativePrompt": "low quality, blurry, watermark...",
    "formats": ["16:9 (hero desktop)", "9:16 (stories/mobile hero)", "1:1 (social feed)"]
  },
  "requiresExternalExecution": true,
  "requiresConfirm": true,
  "warnings": [
    "Skills de geração de imagem requerem CLI/login externo.",
    "Este brief é apenas referência."
  ]
}
```

## CLI

```bash
skill-router image-brief --project ./meu-projeto --request "hero da LP" --brand "Samar"
```

## Formato do brief

| Campo | Descrição |
|---|---|
| objective | Objetivo da imagem (hero, banner, social) |
| scene | Descrição da cena e contexto |
| composition | Enquadramento, proporção, espaço para copy |
| style | Estilo visual (premium, natural, corporativo) |
| prompt | Prompt pronto para gerador de imagem |
| negativePrompt | O que evitar na geração |
| formats | Formatos recomendados por canal |

## Regras de segurança (Policy Guard)

- `image-generation-requires-confirm` (high): Nunca executar geração sem confirmação
- `external-skills-never-auto-execute` (high): Skills de imagem nunca rodam automaticamente
- `external-skills-never-auto-install` (high): Skills de imagem nunca são instaladas automaticamente
