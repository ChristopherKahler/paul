---
name: audit
description: Run enterprise-grade architectural audit on current plan
argument-hint: "[plan-path]"
allowed-tools: [Read, Write, Edit, Glob, AskUserQuestion]
---

<objective>
Run a senior principal engineer + compliance review audit on the current PLAN.md.
Automatically applies must-have and strongly-recommended findings to the plan.
Produces an AUDIT.md report in the same phase directory.

**When to use:** After PLAN phase complete, before APPLY.
**Optional:** Only runs when explicitly invoked or suggested by `enterprise_plan_audit` config.
**Who audits:** Claude performs the audit assuming the role of senior principal engineer + compliance reviewer.
</objective>

<execution_context>
@${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/audit-plan.md
</execution_context>

<context>
Plan path: $ARGUMENTS

@.paul/STATE.md
@.paul/config.md
</context>

<process>
**Follow workflow: @${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/audit-plan.md**

The workflow implements:
1. Validate preconditions (PLAN exists, loop at PLAN complete)
2. Load and parse the PLAN.md
3. Execute enterprise audit (6-section structured review)
4. Classify findings (must-have, strongly-recommended, can-safely-defer)
5. Auto-apply must-have and strongly-recommended findings to PLAN.md
6. Create AUDIT.md report in phase directory
7. Update STATE.md with audit completion
8. Present summary and route to APPLY
</process>

<success_criteria>
- [ ] PLAN.md audited against enterprise standards
- [ ] Must-have and strongly-recommended findings applied to PLAN.md
- [ ] AUDIT.md report created in phase directory
- [ ] STATE.md updated to reflect audit completion
- [ ] User presented with next action (run APPLY)
</success_criteria>

<anti_patterns>
- Don't invent requirements not implied by the plan
- Don't assume "future phases" will fix gaps
- Don't say "this is fine for v1" unless justified
- Don't optimize for politeness over correctness
- Don't skip applying findings - the whole point is automatic remediation
</anti_patterns>
