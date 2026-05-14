# Design Engines — Claude Skill Router

## O que são design engines

Design engines são ferramentas externas de design e prototipação que servem como **referência estratégica** de qualidade visual, estrutura de componentes e direção estética.

O Skill Router **não executa** essas engines. Ele apenas as sugere como referência com base no tipo de projeto detectado.

## Como o Skill Router usa design engines

1. O scanner detecta o tipo de projeto (landing page, dashboard, etc.)
2. O recommender seleciona o pack mais adequado
3. O pack pode incluir `suggestedDesignEngines` — engines recomendadas para aquele tipo de projeto
4. O CLI e o MCP exibem essas sugestões como referência
5. O usuário decide se quer usar a engine como inspiração

**Importante**: Nenhuma engine externa é executada automaticamente. Não há chamadas de API, downloads ou integrações.

## Engines registradas

### Lovable
- **Melhor para**: Landing pages, SaaS apps, sites de marketing
- **Quando usar**: Quando o projeto precisa de experiência visual premium com estrutura de produto bem resolvida
- **Como usar**: Use como referência de composição, ritmo visual e qualidade de UI

### Google Stitch
- **Melhor para**: Design systems, multi-marca, bibliotecas de componentes
- **Quando usar**: Quando o projeto precisa de tokens visuais, variações temáticas e consistência
- **Como usar**: Referência para criação de DESIGN.md e tokens

### v0 (Vercel)
- **Melhor para**: Componentes Shadcn/UI, dashboards, prototipação rápida
- **Quando usar**: Quando o projeto usa React + Tailwind + Shadcn/UI
- **Como usar**: Referência de código e padrão de componente

### Framer
- **Melhor para**: Sites de marketing, landing pages, layouts editoriais
- **Quando usar**: Quando o projeto precisa de estética editorial e storytelling visual
- **Como usar**: Referência para hero, animações e ritmo de página

### Relume
- **Melhor para**: Sitemap, wireframe, arquitetura de informação
- **Quando usar**: Na fase de planejamento, antes da implementação
- **Como usar**: Metodologia de planejamento estruturado

### Figma (via MCP)
- **Melhor para**: Design-to-code, implementação fiel
- **Quando usar**: Quando existe design Figma aprovado
- **Como usar**: Em paralelo com Figma MCP server, se disponível

### Webflow
- **Melhor para**: Sites CMS-driven, editáveis pelo cliente
- **Quando usar**: Quando o site precisa de CMS e edição visual
- **Como usar**: Referência de estrutura CMS e responsividade

### Magic Patterns
- **Melhor para**: Inspiração de UI, galeria de componentes
- **Quando usar**: Quando precisa de inspiração rápida para seções
- **Como usar**: Referência visual de padrões

### Builder Visual Copilot
- **Melhor para**: Conversão Figma-to-code, prototipação
- **Quando usar**: Para acelerar conversão de design para código
- **Como usar**: Acelerador inicial, sempre com revisão humana

### Uizard
- **Melhor para**: Wireframe-to-UI, prototipação rápida
- **Quando usar**: Nos estágios iniciais de design
- **Como usar**: Referência de prototipação a partir de wireframes

## Criando uma nova design engine

Adicione um arquivo JSON em `registry/design-engines/`:

```json
{
  "id": "minha-engine",
  "name": "Minha Engine",
  "category": "design-engine",
  "bestFor": ["landing-page", "prototyping"],
  "integrationType": ["manual-reference"],
  "recommendedFor": ["landing-page"],
  "riskLevel": "low",
  "useWhen": "Quando o projeto precisa de...",
  "doNotUseWhen": "Quando...",
  "notes": "Notas sobre uso."
}
```

Depois, referencie a engine em um pack:

```json
{
  "id": "meu-pack",
  "suggestedDesignEngines": ["minha-engine"]
}
```

## Criando um pack baseado em engine

1. Identifique a engine de referência
2. Crie skills que capturem a metodologia da engine
3. Crie um pack que combine as skills com a engine sugerida
4. Registre a engine em `design-engines/`
5. Referencie no pack com `suggestedDesignEngines`
