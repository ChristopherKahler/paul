---
name: status
description: "[DEPRECATED] Use /paul:progress instead"
argument-hint:
allowed-tools: [Read]
---

> **⚠️ DEPRECATED:** This command is deprecated. Use `/paul:progress` instead.
>
> `/paul:progress` provides the same information plus:
> - Visual milestone progress
> - Smarter routing with single next-action suggestion
> - Optional context argument for tailored suggestions

<objective>
Display current loop position (PLAN/APPLY/UNIFY) and phase progress.

**When to use:** Use `/paul:progress` instead for better routing.
</objective>

<execution_context>
</execution_context>

<context>
@.paul/STATE.md
@.paul/ROADMAP.md
</context>

<process>

<step name="read_state">
Read STATE.md and extract:
- Current milestone
- Current phase (X of Y)
- Current plan status
- Loop position (PLAN/APPLY/UNIFY)
- Last activity
</step>

<step name="display_status">
Display formatted status:

```
PAUL Status
════════════════════════════════════════

Milestone: [name]
Phase: [X of Y] ([phase name])
Plan: [status]

Loop Position:
┌─────────────────────────────────────┐
│  PLAN ──▶ APPLY ──▶ UNIFY          │
│   [✓/○]    [✓/○]    [✓/○]          │
└─────────────────────────────────────┘

Last: [timestamp] — [activity]
Next: [recommended action]

════════════════════════════════════════
```
</step>

<step name="suggest_next">
Based on loop position, suggest next action:
- If PLAN needed: "Run /paul:plan to create plan"
- If PLAN ready: "Approve plan, then run /paul:apply"
- If APPLY complete: "Run /paul:unify to close loop"
- If UNIFY complete: "Loop closed. Ready for next phase."
</step>

</process>

<success_criteria>
- [ ] Loop position displayed clearly
- [ ] Phase progress shown
- [ ] Next action suggested
</success_criteria>
