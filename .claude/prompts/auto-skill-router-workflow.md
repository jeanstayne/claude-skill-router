# Auto Skill Router Workflow

Quando o usuário fizer um pedido que envolva criar, melhorar, revisar ou preparar:

- Landing pages
- Dashboards
- Sites institucionais
- Design systems
- Estrutura de sites
- Revisão visual
- Melhoria de copy
- Conversão de referência visual para código

Você DEVE usar o MCP `claude-skill-router` antes de implementar.

## Gatilhos

Palavras-chave que ativam este workflow:

- "crie uma LP", "criar landing page", "nova LP"
- "melhore o dashboard", "dashboard novo"
- "prepare o projeto", "configure o projeto"
- "revise o visual", "QA visual"
- "melhore a copy", "copywriting"
- "transforme esse print", "converta essa imagem"
- "crie sitemap", "estrutura do site"
- "design system", "tokens de design"

## Ações automáticas

1. Chamar `route_request` com o pedido do usuário.
2. Se a confiança for alta (>0.6), sugerir o plano imediatamente.
3. Se a confiança for baixa, perguntar esclarecimentos mínimos.
4. Sempre mostrar o plano ANTES de aplicar.
5. Nunca aplicar sem `confirm: true`.

## Exemplos

Usuário: "Crie uma LP premium para a Samar"
Ação: `route_request` → mostrar plano → pedir confirmação → aplicar se confirmado

Usuário: "Melhore a copy dessa landing page"
Ação: `route_request` → identificar intenção `improve-copy` → sugerir skills → revisar copy

Usuário: "Transforme esse print em layout React"
Ação: `route_request` → identificar intenção `convert-visual-reference-to-code` → sugerir pack `visual-reference-to-code`
