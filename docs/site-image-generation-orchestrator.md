# Site Image Generation Orchestrator

Skill que orquestra o fluxo de geração de imagem para sites e landing pages.

## Objetivo

Gerar briefs, prompts e planos de imagem para LPs/sites usando providers externos opcionais (GPT Image 2, Nano Banana).

**Importante:** Esta skill NUNCA executa geração de imagem. Ela apenas prepara briefs e prompts para o usuário revisar e executar manualmente.

## Fluxo

```
1. route_request (detecta intent de imagem)
2. plan_image_generation (dry-run)
3. Mostra brief ao usuário
4. Usuário aprova e confirma
5. Usuário executa provider externo manualmente
```

## Triggers (Autopilot)

A skill é ativada pelo autopilot quando detecta intents como:
- "imagem hero", "background hero", "banner"
- "visual da LP", "imagem agro", "imagem realista"
- "gerar imagem com nano banana", "gerar imagem com gpt image 2"

## Providers suportados

| Provider | Melhor para |
|----------|-------------|
| Nano Banana | Fotorealista, paisagem, campo, golden hour |
| GPT Image 2 | Mockups, ads, imagens com texto |

## Estrutura do brief

Cada brief inclui:
- **objective** — Objetivo da imagem
- **brand** — Nome da marca
- **scene** — Descrição da cena
- **composition** — Regras de composição
- **style** — Estilo visual
- **mustInclude** — Elementos obrigatórios
- **mustAvoid** — Elementos proibidos
- **negativePrompt** — Prompt negativo

## Exemplo: Destaque Agro

```
objective: Criar imagem hero premium para landing page de consultoria agro
scene: Campo de soja no oeste da Bahia durante golden hour
mustInclude: [lavoura, horizonte limpo, espaço negativo no terço esquerdo]
mustAvoid: [céu azul, pessoas, máquinas, construções]
```

## Segurança

- `autoExecuteAllowed: false` — sempre
- `dryRunDefault: true` — sempre
- `requiresConfirm: true` — sempre
- API keys via env vars, nunca hardcoded
