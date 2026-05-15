# Site Image Generation Orchestrator

## Objetivo

Orquestrar a criação de briefs, prompts e planos de geração de imagem para LPs, sites institucionais e marketing sites usando providers externos opcionais (GPT Image 2, Nano Banana). **Nunca executa geração automaticamente.**

## Quando usar

Quando o usuário pedir:

- "crie uma imagem hero para a LP"
- "background da hero section"
- "banner visual"
- "imagem agro"
- "imagem realista para o site"
- "gerar imagem com GPT Image 2"
- "gerar imagem com Nano Banana"
- "brief de imagem"
- "prompts de imagem"
- "plano de imagem"

## Providers suportados

| Provider | Melhor para | Risco |
|----------|-------------|-------|
| `gpt-image-2` | Imagens brand-safe, mockups, ads, imagem com texto | HIGH |
| `nano-banana` | Hero fotorealista, paisagens, cenas agro | HIGH |

## Como escolher provider

- `nano-banana` → hero fotorealista, cenas agro, paisagens, lifestyle, cinematográfico
- `gpt-image-2` → mockup, ad, banner com texto, imagem com logo, edição iterativa

## Fluxo obrigatório

1. Chamar `route_request` para detectar intents.
2. Chamar `plan_image_generation` com `dryRun: true`.
3. Mostrar brief e prompts.
4. Se o usuário pedir para executar, avisar que provider externo requer confirmação explícita e credenciais configuradas.
5. Se o usuário gerar a imagem manualmente e salvar no projeto, atualizar a LP para usar o arquivo local.

## Brief de imagem

O brief deve conter:

- objective, scene, composition, environment, lighting
- colorMood, style, mustInclude, mustAvoid
- negativePrompt, aspectRatios

Para Destaque Agro, usar brief específico com direção de campo de soja, oeste da Bahia, golden hour.

## Prompt por formato

Gerar prompts para:

- `hero-desktop` — 16:9
- `hero-mobile` — 9:16
- `card-background` — 4:3
- `social-stories` — 9:16
- `ad-square` — 1:1

## Regras de segurança

- **Nunca** executar geração automaticamente.
- **Nunca** chamar provider sem credencial configurada.
- **Nunca** expor API keys em comandos preview.
- **Sempre** usar `dryRun: true` como padrão.
- **Sempre** exigir `confirm: true` para execução externa.
- **Sempre** mostrar warnings para providers high-risk.

## Como aplicar em LP

1. Gerar o plano de imagem.
2. Se o arquivo existir em `public/images/<brand>/`, referenciar diretamente.
3. Se não existir, manter o fallback atual (SVG, gradiente ou placeholder).
4. Atualizar os componentes da LP para usar os novos assets.

## Não fazer

- Não gerar imagem sem confirmação.
- Não substituir SVGs existentes se não houver imagem melhor.
- Não inserir texto/logotipo na imagem se for background.
- Não usar mesma imagem como background em todas as seções.
- Não fazer upload para serviços externos.

## Exemplo Destaque Agro

```bash
skill-router image-plan \
  --project . \
  --request "hero agro premium para Destaque Agro no oeste da Bahia" \
  --provider nano-banana \
  --purpose hero \
  --dry-run
```
