# Campaign & Launch Workflow

Fluxo para planejamento de campanhas de marketing e lançamentos usando skills externas.

## Fluxo

```
Pedido do usuário → route_request → recommend_external_skills → generate_marketing_plan → Plano estratégico
```

## MCP Tools

### `generate_marketing_plan`

Gera plano completo de campanha/lançamento. Exemplo:

```json
{
  "projectPath": "./meu-projeto",
  "userRequest": "lançamento de produto SaaS para agronegócio"
}
```

Retorna:

```json
{
  "plan": {
    "offer": "Proposta de valor principal do produto/serviço",
    "audience": "Definir público-alvo: setor, cargo, dores, desejos, canais",
    "channels": ["Landing Page", "Meta Ads", "Google Ads", "LinkedIn", "Email"],
    "ads": [
      { "channel": "Meta Ads", "headline": "...", "visualBrief": "..." },
      { "channel": "Google Ads", "headline": "...", "visualBrief": "..." },
      { "channel": "LinkedIn", "headline": "...", "visualBrief": "..." }
    ],
    "social": [
      { "platform": "Instagram", "contentIdea": "Reels bastidores", "format": "Reels 9:16" },
      { "platform": "Instagram", "contentIdea": "Carrossel educativo", "format": "Carousel" },
      { "platform": "LinkedIn", "contentIdea": "Post de autoridade", "format": "Text + Image" }
    ],
    "email": [
      { "type": "Welcome", "subject": "Bem-vindo(a)...", "goal": "Boas-vindas" },
      { "type": "Nurture", "subject": "Como [X] resolveu [Y]", "goal": "Prova social" },
      { "type": "Offer", "subject": "Está pronto para...?", "goal": "Conversão" }
    ],
    "launch": {
      "phases": [
        "Pré-lançamento: teaser (7 dias)",
        "Lançamento: campanhas ativas (14 dias)",
        "Pós-lançamento: nurture (30 dias)"
      ],
      "timeline": "8 semanas"
    },
    "assets": [
      "Landing page otimizada",
      "3 criativos para Meta Ads",
      "2 criativos para Google Ads",
      "5 posts para Instagram",
      "3 artigos/posts para LinkedIn",
      "Sequência de 4 emails",
      "1 lead magnet"
    ]
  },
  "recommendedExternalSkills": ["launch-strategy", "ad-creative", "social-content", "email-sequence", "marketing-ideas"],
  "requiresExternalExecution": false
}
```

## CLI

```bash
skill-router marketing-plan --project ./meu-projeto --request "lançamento de produto" --json
```

## Skills externas recomendadas

| Skill | Função |
|---|---|
| `launch-strategy` | Estratégia completa de lançamento |
| `ad-creative` | Criativos para anúncios (headlines, visuais, ângulos) |
| `paid-ads` | Estrutura de campanhas pagas |
| `social-content` | Conteúdo para redes sociais |
| `email-sequence` | Sequências de email (welcome, nurture, onboarding) |
| `marketing-ideas` | Ideias criativas para campanhas |
| `competitor-alternatives` | Análise competitiva |

## Timeline típica

| Fase | Duração | Atividades |
|---|---|---|
| Pré-lançamento | 7 dias | Teaser, expectativa, lista de espera |
| Lançamento | 14 dias | Campanhas ativas, anúncios, PR |
| Pós-lançamento | 30 dias | Follow-up, retargeting, nurture |

## Assets necessários

- Landing page otimizada para conversão
- Criativos visuais para cada canal de anúncio
- Conteúdo social (posts, Reels, stories)
- Sequência de emails (4+ emails)
- Lead magnet (e-book, checklist ou webinar)

## Integração com outras skills

- Use `copy-variants` para headlines e CTAs dos anúncios
- Use `image-brief` para briefs visuais dos criativos
- Use `cro-seo-plan` para otimizar a landing page da campanha
