---
name: add-phase
description: Add a new phase to current milestone
argument-hint: "[phase-name]"
allowed-tools: [Read, Write, Edit, Bash]
---

<objective>
Add a new phase to the current milestone's roadmap.

**When to use:** Scope expansion during milestone, adding planned work.
</objective>

<execution_context>
@${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/roadmap-management.md
</execution_context>

<context>
$ARGUMENTS

@.paul/PROJECT.md
@.paul/STATE.md
@.paul/ROADMAP.md
</context>

<process>
Follow workflow: @${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/roadmap-management.md

Execute: **add-phase** operation
</process>

<success_criteria>
- [ ] Phase added to ROADMAP.md
- [ ] Phase directory created
- [ ] STATE.md updated with new phase
</success_criteria>
