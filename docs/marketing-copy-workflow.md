# Marketing Copy Workflow

Fluxo para gerar variantes de copy (headlines, CTAs, subheadlines) com skills externas de copywriting.

## Fluxo

```
Pedido do usuário → route_request → recommend_external_skills → generate_copy_variants → Usuário adapta ao brand voice
```

## MCP Tools

### `generate_copy_variants`

Gera variantes de headline, CTA, subheadline e ângulos de mensagem. Exemplo:

```json
{
  "projectPath": "./meu-projeto",
  "userRequest": "LP de vendas para consultoria agrícola",
  "variantCount": 5
}
```

Retorna:

```json
{
  "headlines": [
    "Transforme seu negócio com inteligência e estratégia",
    "Resultados reais, entregues com método e tecnologia",
    "..."
  ],
  "subheadlines": [
    "Metodologia validada por centenas de clientes em todo o Brasil.",
    "..."
  ],
  "ctas": [
    "Fale com um especialista",
    "Quero acelerar meu crescimento",
    "..."
  ],
  "angles": [
    "Economia de tempo e recursos com processos otimizados",
    "Crescimento sustentável baseado em dados",
    "..."
  ],
  "recommendedExternalSkills": ["copywriting", "marketing-psychology", "page-cro"],
  "requiresExternalExecution": false
}
```

## CLI

```bash
skill-router copy-variants --project ./meu-projeto --request "LP de vendas" --variant-count 5 --json
```

## Skills externas recomendadas

| Skill | Função |
|---|---|
| `copywriting` | Copywriting de conversão para headlines, CTAs, landing pages |
| `marketing-psychology` | Gatilhos éticos de psicologia para persuasão |
| `page-cro` | Otimização de conversão da página |
| `product-marketing-context` | Contexto de produto e posicionamento |

## Ângulos de copy

O tool gera 5 ângulos estratégicos:

1. **Economia de tempo/recursos** — Processos otimizados
2. **Crescimento sustentável** — Baseado em dados
3. **Parceria estratégica** — Especialistas do setor
4. **Tecnologia de ponta** — Aplicada ao negócio
5. **Resultados comprovados** — Múltiplos segmentos

## Boas práticas

- Adapte as variantes ao brand voice e tom da marca
- Teste headlines com o público-alvo
- Use `marketing-psychology` para gatilhos éticos
- Combine com `page-cro` para otimizar a página completa
