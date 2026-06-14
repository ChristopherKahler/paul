---
name: progress
description: Smart status with routing - suggests ONE next action
argument-hint: "[context]"
allowed-tools: [Read]
---

<objective>
Show current progress and **route to exactly ONE next action**. Prevents decision fatigue by suggesting a single best path.

**When to use:**
- Mid-session check on progress
- After `/paul:resume` for more context
- When unsure what to do next
- To get a tailored suggestion based on your current focus
</objective>

<execution_context>
</execution_context>

<context>
$ARGUMENTS

@.paul/STATE.md
@.paul/ROADMAP.md
</context>

<process>

<step name="load_state">
Read `.paul/STATE.md` and `.paul/ROADMAP.md`:
- Current phase and total phases
- Current plan (if any)
- Loop position (PLAN/APPLY/UNIFY markers)
- Roadmap progress
- Performance metrics (if tracked)
- Blockers or concerns

Also check `.paul/config.md` (if exists):
- Is `enterprise_plan_audit: enabled: true`?
- If plan is at "created, awaiting approval" stage: check if STATE.md mentions "audited"
- Store `audit_enabled` and `audit_completed` flags for routing
</step>

<step name="calculate_progress">
Determine overall progress:

**Milestone Progress:**
- Phases complete: X of Y
- Current phase progress: Z%

**Current Loop:**
- Position: PLAN/APPLY/UNIFY
- Status: [what's happening]
</step>

<step name="consider_user_context">
**If `[context]` argument provided:**

User has given additional context about their current focus or constraint.
Factor this into routing decision:
- "I need to fix a bug first" → prioritize that over planned work
- "I only have 30 minutes" → suggest smaller scope
- "I want to finish this phase" → stay on current path
- "I'm stuck on X" → suggest debug or research approach

**If no argument:** Use default routing based on state alone.
</step>

<step name="determine_routing">
Based on state (+ user context if provided), determine **ONE** next action:

**Default routing (no user context):**

| Situation | Single Suggestion |
|-----------|-------------------|
| No plan exists | `/paul:plan` |
| Plan awaiting approval (audit enabled, not yet audited) | `/paul:audit [path]` |
| Plan awaiting approval (audit complete or not enabled) | "Approve plan to proceed" |
| Plan approved, not executed | `/paul:apply [path]` |
| Applied, not unified | `/paul:unify [path]` |
| Loop complete, more phases | `/paul:plan` (next phase) |
| Milestone complete | "Create next milestone or ship" |
| Blockers present | "Address blocker: [specific]" |
| Context at DEEP/CRITICAL | `/paul:pause` |

**With user context:** Adjust suggestion to align with stated intent.

**IMPORTANT:** Suggest exactly ONE action. Not multiple options.
</step>

<step name="display_progress">
Show progress with single routing:

```
════════════════════════════════════════
PAUL PROGRESS
════════════════════════════════════════

Milestone: [name] - [X]% complete
├── Phase 1: [name] ████████████ Done
├── Phase 2: [name] ████████░░░░ 70%
├── Phase 3: [name] ░░░░░░░░░░░░ Pending
└── Phase 4: [name] ░░░░░░░░░░░░ Pending

Current Loop: Phase 2, Plan 02-03
┌─────────────────────────────────────┐
│  PLAN ──▶ APPLY ──▶ UNIFY          │
│    ✓        ✓        ○             │
└─────────────────────────────────────┘

────────────────────────────────────────
▶ NEXT: /paul:unify .paul/phases/02-features/02-03-PLAN.md
  Close the loop and update state.
────────────────────────────────────────

Type "yes" to proceed, or provide context for a different suggestion.
```
</step>

<step name="context_advisory">
If context is at DEEP or CRITICAL bracket:

```
⚠️ Context Advisory: Session at [X]% capacity.
   Recommended: /paul:pause before continuing.
```
</step>

</process>

<success_criteria>
- [ ] Overall progress displayed visually
- [ ] Current loop position shown
- [ ] Exactly ONE next action suggested (not multiple)
- [ ] User context considered if provided
- [ ] Context advisory shown if needed
</success_criteria>
