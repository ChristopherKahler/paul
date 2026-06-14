---
name: resume
description: Restore context from handoff and continue work
argument-hint: "[optional: handoff path, e.g., '.paul/HANDOFF-phase10-audit.md']"
allowed-tools: [Read, Glob, Bash]
---

<objective>
Restore PAUL context after a session break, determine current position, and suggest exactly ONE next action.

**When to use:** Starting a new session on an existing PAUL project.

**Handoff lifecycle:** Detects handoffs, presents content, archives after work proceeds.
</objective>

<execution_context>
@${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/resume-project.md
</execution_context>

<context>
$ARGUMENTS (optional handoff path)

@.paul/STATE.md
</context>

<process>
**Follow workflow: @${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/resume-project.md**

The workflow implements:
1. Verify .paul/ exists
2. Detect handoff files (use $ARGUMENTS if provided, else find most recent)
3. Load STATE.md
4. Present handoff content if detected
5. Reconcile handoff vs STATE.md
6. Determine exactly ONE next action based on loop position
7. Display resume status with single routing
8. After work proceeds: archive/delete consumed handoff

**Key behavior:** Suggest exactly ONE next action, not multiple options.

**Handoff pattern:** `.paul/HANDOFF-{context}.md` (e.g., `HANDOFF-phase10-audit.md`)
</process>

<success_criteria>
- [ ] Context restored from STATE.md and/or handoff
- [ ] Loop position correctly identified
- [ ] Exactly ONE next action suggested (not multiple options)
- [ ] User can proceed or redirect with context
</success_criteria>
