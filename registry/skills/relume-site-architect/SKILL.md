# Relume Site Architect

## Objetivo

Planejar a arquitetura completa de sites e landing pages antes da implementação: sitemap, wireframe textual, ordem de seções e fluxo de informação. Garantir que cada página tenha propósito claro e estrutura lógica.

## Quando usar

- Início de projeto (antes de qualquer código)
- Refatoração de site mal estruturado
- Quando o escopo do site não está claro
- Múltiplas páginas ou fluxos complexos
- Antes de briefings com cliente

## Quando não usar

- Landing page única e simples já bem definida
- Pequena alteração em site existente
- Quando wireframe já foi aprovado

## Entradas esperadas

- Objetivo do site
- Público-alvo
- Páginas necessárias
- Conteúdo disponível
- Funcionalidades esperadas

## Processo

1. Definir objetivo principal do site
2. Mapear jornadas de usuário
3. Criar sitemap (páginas e hierarquia)
4. Para cada página, listar seções em ordem
5. Para cada seção, descrever:
   - Propósito
   - Conteúdo principal
   - CTA ou ação esperada
   - Tipo de componente visual
6. Validar fluxo entre páginas
7. Revisar com stakeholders

## Checklist

- Sitemap completo com hierarquia
- Cada página tem objetivo definido
- Seções em ordem lógica de conversão/navegação
- Cada seção tem propósito único
- CTAs mapeados por página
- Fluxo de navegação claro
- Conteúdo necessário identificado
- Sem páginas ou seções desnecessárias

## Formato de saída

```md
## Sitemap
```
home
├── sobre
├── produtos
│   ├── produto-a
│   └── produto-b
├── blog
│   └── artigo
└── contato
```

## Página: Home
### Objetivo: [converter / apresentar / educar]

### Seções:
1. **Hero**
   - Propósito: Apresentar proposta de valor
   - Conteúdo: Headline, subheadline, CTA principal
   - Visual: Imagem full-width ou ilustração

2. **Benefícios**
   - Propósito: Mostrar diferenciais
   - Conteúdo: 3-6 cards com ícone + título + descrição
   - Visual: Grid de cards com ícones

[...]
```

## Regras de qualidade

- Cada página tem no máximo 1 objetivo principal
- Seções seguem ordem lógica (awareness → consideration → decision)
- Nenhuma seção existe "porque sim"
- Sitemap reflete necessidades reais do usuário
- Wireframe é textual mas preciso o suficiente para implementar

## Não fazer

- Não criar páginas sem objetivo claro
- Não colocar CTA em toda seção (fadiga de decisão)
- Não criar sitemap profundo demais (>3 níveis)
- Não planejar sem pensar em mobile
- Não pular etapa de planejamento e ir direto para código
