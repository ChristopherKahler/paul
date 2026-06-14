---
name: discuss
description: Explore and articulate phase vision before planning
argument-hint: "<phase-number>"
allowed-tools: [Read, Write, AskUserQuestion]
---

<objective>
Facilitate vision discussion for a specific phase and create context handoff.

**When to use:** Before planning a phase, when goals and approach need exploration.
</objective>

<execution_context>
@${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/discuss-phase.md
</execution_context>

<context>
Phase number: $ARGUMENTS (required)

@.paul/PROJECT.md
@.paul/STATE.md
@.paul/ROADMAP.md
</context>

<process>
Follow workflow: @${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/discuss-phase.md
</process>

<success_criteria>
- [ ] CONTEXT.md created in phase directory
- [ ] Goals and approach articulated
- [ ] Ready for /paul:plan command
</success_criteria>
