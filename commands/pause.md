---
name: pause
description: Create handoff file and prepare for session break
argument-hint: [reason]
allowed-tools: [Read, Write, Bash, AskUserQuestion]
---

<objective>
Create a HANDOFF.md file capturing current context and update STATE.md for session continuity.

**When to use:** Before ending a session, switching context, or when context limit is approaching.
</objective>

<execution_context>
@${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/pause-work.md
</execution_context>

<context>
$ARGUMENTS

@.paul/STATE.md
@.paul/PROJECT.md
</context>

<process>
**Follow the pause-work workflow** from `@${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/pause-work.md`.

The workflow handles:
1. Detecting current position
2. Gathering session context (ask user if needed)
3. Creating HANDOFF-{date}.md with populated content
4. Updating STATE.md session continuity
5. Optional WIP commit
6. Confirmation display

If `[reason]` argument provided, include it in handoff status.
</process>

<success_criteria>
- [ ] HANDOFF.md created with complete context (no placeholders)
- [ ] STATE.md updated with session continuity
- [ ] Next action is clear and actionable
- [ ] Resume instructions provided
</success_criteria>
