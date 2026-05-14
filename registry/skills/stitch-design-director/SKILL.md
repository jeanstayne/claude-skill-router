# Stitch Design Director

## Objetivo

Criar e manter design systems completos, com tokens visuais, variações temáticas, documentação de componentes e consistência entre marcas ou temas diferentes.

## Quando usar

- Projeto multi-marca ou multi-tenant
- Sistema de design que precisa de variações (light/dark, marca A/B)
- Dashboard ou sistema interno que precisa de componentes consistentes
- Migração de design system existente para tokens
- Padronização de UI entre times diferentes

## Quando não usar

- Landing page única sem reuso de componentes
- Projeto que não precisa de variação temática
- Protótipo rápido descartável

## Entradas esperadas

- Lista de componentes necessários
- Marcas ou temas a suportar
- Requisitos de acessibilidade
- Paleta base (se existir)

## Processo

1. Inventariar componentes necessários
2. Definir tokens primitivos (cores, spacing, typography, shadows, radii)
3. Definir tokens semânticos (primary, secondary, success, danger, etc.)
4. Criar variações de tema (se aplicável)
5. Documentar cada componente
6. Criar exemplos de uso
7. Validar acessibilidade
8. Gerar DESIGN.md ou documentação equivalente

## Checklist

- Tokens primitivos definidos
- Tokens semânticos mapeados
- Componentes base documentados
- Variações de estado (hover, focus, disabled, active)
- Tema claro e escuro (se aplicável)
- Contraste WCAG AA verificado
- Exemplos de uso para cada componente
- DESIGN.md ou equivalente gerado

## Formato de saída

```md
## Design Tokens

### Colors
```json
{
  "primary": { "50": "#...", "500": "#...", "900": "#..." }
}
```

### Spacing
[Escala de spacing]

### Typography
[Escala tipográfica]

## Componentes

### Button
[Variantes, estados, exemplos]

### Card
[Variantes, estados, exemplos]
```

## Regras de qualidade

- Tokens sempre referenciados por nome, nunca por valor hardcoded
- Todo componente documentado tem exemplos de uso
- Variações de estado documentadas
- Acessibilidade validada

## Não fazer

- Não criar tokens sem mapeamento semântico
- Não documentar componente sem exemplo
- Não usar valores mágicos no código
- Não esquecer estados de foco
- Não criar variação temática sem testar contraste
