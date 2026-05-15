# Policy Guard — claude-skill-router

Políticas de auditoria local para garantir segurança e qualidade.

## Regras

### [high] no-direct-fs-outside-workspace
Nenhuma operação de escrita pode ocorrer fora do diretório alvo definido.

### [high] no-secret-hardcode
Nenhum token, API key ou secret pode ser hardcoded no código fonte.

### [high] no-remote-script-execution
Nenhum script remoto pode ser executado automaticamente sem aprovação explícita.

### [high] no-unreviewed-external-skill-install
Nenhuma skill externa pode ser instalada sem auditoria prévia.

### [medium] require-dry-run-for-project-mutations
Toda mutação em projeto alvo deve ter modo dry-run e confirmação explícita.

### [medium] require-report-after-phase
Toda fase de implementação deve gerar relatório.

### [medium] separate-core-cli-mcp-vscode
Manter separação clara entre core, CLI, MCP e VS Code Extension.

### [medium] no-unused-skill-pack-copy
Não copiar skills não recomendadas para o projeto alvo.

### [low] require-tests-for-new-tools
Toda nova tool ou módulo deve ter cobertura de testes.

### [high] autopilot-install-requires-confirm
A instalação do autopilot (scope=project) requer `confirm: true` para escrita real. Dry-run não pode alterar disco.

### [high] global-autopilot-install-requires-explicit-confirm
A instalação do autopilot com scope=global requer confirmação explícita adicional, pois afeta `~/.claude/skills/`.

### [medium] autopilot-skill-must-require-route-request-first
A skill autopilot deve instruir a chamar `route_request` como primeiro passo, antes de qualquer outro tool MCP.

### [medium] autopilot-skill-must-require-dry-run-before-apply
A skill autopilot deve exigir `dryRun: true` antes de qualquer `prepare_project_for_request` com `dryRun: false`.

### [medium] claude-md-autopilot-block-must-use-managed-markers
O snippet de CLAUDE.md gerado pelo autopilot deve usar markers `<!-- SKILL_ROUTER_AUTOPILOT_START -->` e `<!-- SKILL_ROUTER_AUTOPILOT_END -->`.

### [medium] autopilot-must-not-call-external-engines
A skill autopilot não deve instruir chamada automática a engines externas (Lovable, Stitch, v0, Framer, Relume, Figma, Webflow, etc.).

### [low] autopilot-cli-json-output-valid
O CLI `install-autopilot` deve produzir JSON válido com `--json`.

### [high] external-skills-never-auto-install
Nenhuma skill externa do marketplace pode ser instalada automaticamente. Toda instalação requer `confirm: true` e revisão humana.

### [high] external-skills-never-auto-execute
Nenhuma skill externa (especialmente de imagem/geração) pode ser executada automaticamente. Skills que requerem CLI/login externo devem sempre retornar `requiresConfirm: true`.

### [high] image-generation-requires-confirm
Skills de geração de imagem (`gpt-image-2`, `ai-image-generation`) NUNCA podem executar geração automaticamente. Apenas brief/prompt pode ser gerado sem confirmação.

### [high] high-risk-external-skills-require-warning
Toda skill externa com `riskLevel: high` deve incluir warning explícito na recomendação.

### [medium] external-skill-registry-schema-required
Toda skill do registry externo deve passar validação Zod do `ExternalSkillSchema` antes de ser carregada.

### [medium] external-skills-risk-level-required
Toda skill externa deve ter `riskLevel` definido ('low', 'medium' ou 'high'). Skills sem risk level não podem ser carregadas.

### [medium] marketplace-adapters-must-not-clone-full-external-content
Adapters locais (`marketplace-*-director`) devem ser adaptações originais, não clones integrais do conteúdo das skills externas.

### [medium] autopilot-must-route-image-copy-marketing-intents
O autopilot deve detectar intents de imagem, copy, marketing, SEO, CRO, ads e social, e rotear para as tools correspondentes.

### [low] external-skills-cli-json-valid
O CLI `external-skills list` e `external-skills recommend` devem produzir JSON válido com `--json`.

### [high] lovable-pipeline-design-md-backup-before-write
O pipeline deve fazer backup do DESIGN.md existente antes de sobrescrever. Nunca sobrescrever sem backup.

### [high] lovable-pipeline-dry-run-is-default
O pipeline deve sempre executar com `dryRun: true` como padrão. Escrita real só com `confirm: true` e `dryRun: false`.

### [high] lovable-pipeline-no-external-api
O pipeline NUNCA deve fazer chamadas de API externa, download de templates, ou geração de imagens. Todo processamento é local e heurístico.

### [medium] lovable-pipeline-brand-template-local-only
Templates de marca devem ser carregados exclusivamente do registry local (`registry/brand-templates/`). Nenhum template externo pode ser baixado ou referenciado.

### [medium] lovable-pipeline-design-md-confirm-required
A escrita de DESIGN.md requer `confirm: true`. Dry-run pode gerar o conteúdo mas nunca escreve em disco.

### [medium] lovable-pipeline-visual-qa-before-delivery
O Visual QA Plan deve ser gerado como parte do pipeline e executado antes da entrega final do design.

### [medium] lovable-pipeline-component-plan-before-implementation
O Component-First Plan deve preceder a implementação dos componentes. Não implementar componentes sem plano prévio.

### [medium] lovable-pipeline-outputs-must-pass-zod
Todos os outputs do pipeline (ProductMarketingContext, VisualDirection, BrandTemplate, DesignMd, ComponentFirstPlan, VisualQaPlan, IterationReport) devem passar validação Zod.

### [low] lovable-pipeline-never-auto-execute-without-route-request
O pipeline não deve ser executado automaticamente sem que o autopilot tenha chamado `route_request` primeiro.

### [high] design-system-enforcer-no-external-api
O Design System Enforcer NUNCA deve fazer chamadas de API externa. Toda análise de design system é local e heurística.

### [high] seo-by-default-meta-tags-required
SEO by Default deve sempre gerar `<title>` (max 60 chars) e `<meta name="description">` (max 160 chars). Estas tags são obrigatórias em toda página.

### [medium] design-system-tokens-before-components
Design tokens semânticos (CSS custom properties) devem ser definidos antes das variantes de componente. O pipeline deve gerar tokens primeiro, variantes depois.

### [medium] seo-jsonld-organization-required
JSON-LD Organization é sempre recomendado como bloco mínimo. Nenhum plano de SEO deve ser gerado sem pelo menos o bloco Organization.

### [medium] sandbox-template-local-only
Templates de sandbox devem ser carregados exclusivamente do registry local (`registry/sandbox-templates/`). Nenhum template externo pode ser baixado ou referenciado.

### [medium] runtime-feedback-no-browser-auto
Runtime Feedback NUNCA deve abrir navegador ou executar preview automaticamente. Apenas processa dados de console/network fornecidos pelo usuário.

### [medium] preview-qa-viewport-matrix-required
Preview QA Loop deve verificar pelo menos 3 viewports prioritários: mobile (390px), tablet (768px), desktop (1440px).

### [medium] preview-qa-high-priority-first
Regressões visuais com severidade `high` devem ser corrigidas antes de `medium` e `low`. O plano de iteração deve priorizar high.

### [low] phase-16-modules-tested
Todo módulo novo da Phase 16 (Design System Enforcer, SEO by Default, Runtime Feedback, Preview QA Loop, Sandbox Template Registry) deve ter cobertura de testes.
