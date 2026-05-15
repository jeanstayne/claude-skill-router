# External Skills Registry (Marketplace)

O registry externo é um catálogo curado de 34 skills de marketplace que complementam as skills locais do claude-skill-router. Skills externas são **apenas referências** — nunca são instaladas ou executadas automaticamente.

## Arquitetura de segurança

```
Registry → Recomendação → Dry-Run → Confirmação explícita → Instalação manual
```

### Regras críticas

1. **Nunca auto-instalar**: Toda instalação requer `confirm: true` e revisão humana
2. **Nunca auto-executar**: Skills de imagem/geração requerem confirmação explícita
3. **Dry-run primeiro**: Preview antes de qualquer operação real
4. **Risk level obrigatório**: Toda skill tem `riskLevel` (low/medium/high)
5. **Adapters locais**: Adaptações originais, não clones das skills externas

## Categorias

| Categoria | Skills | Count |
|---|---|---|
| Design/UI/Visual | frontend-design, canvas-design, theme-factory, web-design-guidelines, ui-ux-pro-max, high-end-visual-design, design-taste-frontend, redesign-existing-projects, stitch-design-taste, extract-design-system, tailwind-design-system | 11 |
| Stitch/Design Gen | enhance-prompt, stitch-loop | 2 |
| Image/Visual Asset | ai-image-generation, gpt-image-2 | 2 |
| Copy/Marketing/CRO | product-marketing-context, copywriting, page-cro, marketing-psychology, form-cro, popup-cro, pricing-strategy | 7 |
| SEO/Content/Growth | seo-audit, schema-markup, content-strategy, programmatic-seo, competitor-alternatives, marketing-ideas, launch-strategy | 7 |
| Ads | ad-creative, paid-ads | 2 |
| Social/Email | social-content, email-sequence | 2 |
| Audit | audit-website | 1 |

## Schema

Cada skill externa é definida em `registry/external-skills/<id>.json`:

```json
{
  "id": "copywriting",
  "name": "Copywriting",
  "source": "skills.sh",
  "repository": "https://github.com/coreyhaines31/marketingskills",
  "skillPath": "copywriting",
  "installCommand": "npx skills add https://github.com/coreyhaines31/marketingskills --skill copywriting",
  "category": "marketing",
  "subcategories": ["copywriting", "headlines", "cta"],
  "bestFor": ["improve-headlines", "improve-marketing-copy"],
  "riskLevel": "low",
  "requiresExternalCli": false,
  "requiresLogin": false,
  "requiresNetwork": false,
  "autoInstallAllowed": false,
  "autoExecuteAllowed": false,
  "useAsReference": true
}
```

## Uso

```bash
# Listar skills externas
skill-router external-skills-list --category marketing --json

# Recomendar skills para um pedido
skill-router external-skills-recommend --request "melhore as headlines" --json

# Via MCP
route_request → recommend_external_skills → list_external_skills
```

## Skills de risco alto

Skills com `riskLevel: high` incluem warnings automáticos:

- `gpt-image-2` — Requer CLI + API key OpenAI
- `ai-image-generation` — Requer inference.sh login
- `audit-website` — Faz chamadas de rede

**Nunca execute estas skills automaticamente.**
