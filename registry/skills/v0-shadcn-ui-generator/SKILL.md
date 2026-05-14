# v0 Shadcn/UI Generator

## Objetivo

Criar componentes React de alta qualidade usando Tailwind CSS e Shadcn/UI, com foco em dashboards, cards, modais, data tables, grids e formulários premium.

## Quando usar

- Dashboard que precisa de componentes de dados (tabelas, gráficos, cards)
- Formulários complexos com validação
- Modais e dialogs com comportamento avançado
- Grid system ou layout de cards
- Refatorar componentes existentes para Shadcn/UI

## Quando não usar

- Projeto que não usa React/Tailwind
- Landing page simples que não precisa de componentes complexos
- Quando o time usa outra biblioteca de UI (MUI, Ant Design)

## Entradas esperadas

- Tipo de componente necessário
- Dados de exemplo (se aplicável)
- Requisitos de interação
- Requisitos de acessibilidade

## Processo

1. Identificar o tipo de componente (table, form, modal, card, grid)
2. Verificar se Shadcn/UI tem componente base
3. Criar wrapper componentizado com Tailwind
4. Adicionar variantes (sizes, colors, states)
5. Implementar lógica de interação
6. Adicionar loading, empty, error states
7. Validar acessibilidade (teclado, foco, labels)
8. Documentar props e exemplos

## Checklist

- Usa Shadcn/UI como base quando disponível
- Tailwind para estilização customizada
- Props tipadas com TypeScript
- Estados: default, hover, focus, active, disabled, loading, empty, error
- Acessível por teclado
- Labels e descrições para leitores de tela
- Responsivo
- Performance (sem render desnecessário)

## Formato de saída

```tsx
// Componente com:
// - Props interface
// - Variantes
// - Estados
// - Exemplo de uso
```

## Regras de qualidade

- TypeScript estrito, sem `any`
- Tailwind utility-first, sem CSS custom desnecessário
- Shadcn/UI como base, não reimplementar o que já existe
- Sempre exportar tipos das props
- Sempre incluir exemplo de uso

## Não fazer

- Não criar componente sem tipagem
- Não usar CSS inline ou style objects
- Não esquecer estados de loading e erro
- Não criar componente não reutilizável
- Não depender de biblioteca externa não listada
