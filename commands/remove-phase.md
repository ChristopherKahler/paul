---
name: remove-phase
description: Remove a future (not started) phase
argument-hint: "<phase-number-or-name>"
allowed-tools: [Read, Write, Edit, Bash]
---

<objective>
Remove a future phase from the roadmap and clean up its directory.

**When to use:** Scope reduction, removing phases that haven't started.
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

Execute: **remove-phase** operation
</process>

<success_criteria>
- [ ] Phase removed from ROADMAP.md
- [ ] Phase directory cleaned up (if empty)
- [ ] Subsequent phases renumbered
- [ ] STATE.md updated
</success_criteria>
