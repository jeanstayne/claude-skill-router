# SEO & CRO Workflow

Fluxo para auditoria de SEO e CRO usando skills externas especializadas.

## Fluxo

```
Pedido do usuário → route_request → recommend_external_skills → generate_cro_seo_audit_plan → Checklist acionável
```

## MCP Tools

### `generate_cro_seo_audit_plan`

Gera checklist priorizado de CRO e SEO. Exemplo:

```json
{
  "projectPath": "./meu-projeto",
  "userRequest": "LP de captação de leads"
}
```

Retorna:

```json
{
  "plan": {
    "cro": [
      { "category": "Headline & Above Fold", "action": "Verificar se headline comunica valor em < 3 segundos", "priority": "high" },
      { "category": "CTA", "action": "Garantir que CTA principal está visível sem scroll e tem cor contrastante", "priority": "high" },
      { "category": "Form", "action": "Reduzir campos ao mínimo essencial para conversão inicial", "priority": "high" },
      { "category": "Social Proof", "action": "Adicionar depoimentos, cases, números ou logos de clientes", "priority": "high" },
      { "category": "Mobile", "action": "Verificar layout mobile — CTAs acessíveis, texto legível sem zoom", "priority": "medium" },
      { "category": "Load Speed", "action": "Otimizar imagens e verificar tempo de carregamento < 3s", "priority": "medium" },
      { "category": "Trust Signals", "action": "Adicionar garantias, selos, política de privacidade", "priority": "medium" },
      { "category": "Objections", "action": "Mapear objeções e respondê-las na página", "priority": "low" }
    ],
    "seo": [
      { "category": "Title Tag", "action": "Otimizar title tag com keyword principal — 50-60 caracteres", "priority": "high" },
      { "category": "Meta Description", "action": "Criar meta description persuasiva com CTA — 150-160 caracteres", "priority": "high" },
      { "category": "H1", "action": "Garantir H1 único, descritivo e com keyword principal", "priority": "high" },
      { "category": "Images", "action": "Adicionar alt text descritivo em todas as imagens", "priority": "medium" },
      { "category": "URL", "action": "Verificar URLs amigáveis e com keywords", "priority": "medium" },
      { "category": "Content", "action": "Garantir conteúdo mínimo de 300 palavras com keywords relevantes", "priority": "medium" },
      { "category": "Internal Links", "action": "Adicionar links internos para páginas relacionadas", "priority": "low" },
      { "category": "Mobile", "action": "Verificar mobile-friendliness no Google Search Console", "priority": "low" }
    ],
    "schema": [
      { "type": "Organization", "priority": "high" },
      { "type": "LocalBusiness (se aplicável)", "priority": "medium" },
      { "type": "FAQ (se houver FAQ na página)", "priority": "medium" },
      { "type": "BreadcrumbList", "priority": "low" }
    ]
  },
  "recommendedExternalSkills": ["page-cro", "seo-audit", "schema-markup"],
  "requiresExternalExecution": false
}
```

## CLI

```bash
skill-router cro-seo-plan --project ./meu-projeto --request "LP de conversão" --json
```

## Skills externas recomendadas

| Skill | Função |
|---|---|
| `page-cro` | Auditoria CRO completa da página |
| `form-cro` | Otimização de formulários |
| `popup-cro` | Otimização de popups e modais |
| `seo-audit` | Auditoria SEO completa (on-page, technical, content) |
| `schema-markup` | Schema JSON-LD para rich results |
| `content-strategy` | Estratégia de conteúdo para SEO |
| `programmatic-seo` | SEO programático para escala |
| `audit-website` | Auditoria completa do site (performance, a11y, SEO) |

## Prioridades

- **high**: Impacto direto na conversão/ranqueamento — corrija primeiro
- **medium**: Melhoria significativa — planeje no curto prazo
- **low**: Refinamento — backlog de otimização contínua
