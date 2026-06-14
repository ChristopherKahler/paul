<context_management>

## Purpose

Strategies for working effectively within context window limits. Context is a finite resource - use it deliberately to maximize productive work per session.

## Context Brackets

PAUL uses context brackets to adapt behavior based on remaining capacity:

| Bracket | Remaining | Mode | Behavior |
|---------|-----------|------|----------|
| FRESH | >70% | LEAN | Minimal injection, trust recent context |
| MODERATE | 40-70% | STANDARD | Reinforce key context, consider plan splits |
| DEEP | 20-40% | CONSERVATIVE | Summarize before new reads, plan handoffs |
| CRITICAL | <20% | PRESERVATION | Finish current task, prepare handoff |

## Strategies by Bracket

### FRESH (>70%)
- Work directly in session
- Load full files when needed
- Multiple parallel operations OK
- Good time for complex multi-step work

### MODERATE (40-70%)
- Re-read key files (PROJECT.md, STATE.md) before decisions
- Consider splitting large remaining work
- Prefer summaries over full prior plan content
- Single-concern plans

### DEEP (20-40%)
- Read SUMMARY.md instead of full PLAN.md
- Defer new complex work to fresh session
- Focus on completing current plan
- Prepare handoff documentation

### CRITICAL (<20%)
- Complete current task only
- Write comprehensive handoff
- No new file reads unless essential
- Update STATE.md with resume context

## Lean Injection Principles

### Load What You Need
```markdown
<!-- GOOD: Targeted loading -->
<context>
@.paul/STATE.md
@src/models/user.ts  (the specific file being modified)
</context>

<!-- BAD: Kitchen sink -->
<context>
@.paul/PROJECT.md
@.paul/ROADMAP.md
@.paul/STATE.md
@.paul/phases/01-foundation/01-01-SUMMARY.md
@.paul/phases/01-foundation/01-02-SUMMARY.md
@src/models/user.ts
@src/models/product.ts
@src/api/routes.ts
</context>
```

### Summary Before Full
When referencing prior work:

```markdown
<!-- GOOD: Reference summary -->
@.paul/phases/01-foundation/01-01-SUMMARY.md

<!-- AVOID: Full plan + summary -->
@.paul/phases/01-foundation/01-01-PLAN.md
@.paul/phases/01-foundation/01-01-SUMMARY.md
```

Summaries capture what was built. Plans capture what was intended. After completion, the summary is more useful.

### Progressive Detail
Start with high-level, drill down only when needed:

1. Read STATE.md (current position)
2. Read relevant SUMMARY.md (what was built)
3. Read specific source files (implementation details)

Don't load implementation details until you need them.

## Plan Sizing for Context

### Target: ~50% Context Usage Per Plan
A plan should use roughly half the available context:
- Leaves room for execution output
- Allows error recovery
- Supports verification steps

### Single Concern Per Plan
```
GOOD: "Create User model and API endpoints"
BAD: "Create User model, Product model, Order model, and all API endpoints"
```

### 2-3 Tasks Maximum
More tasks = more context per plan. Split large phases into multiple plans.

## Avoiding Reflexive Chaining

**Anti-pattern: Reflexive chain**
```yaml
# Plan 01-01
depends_on: []

# Plan 01-02
depends_on: ["01-01"]  # Does 02 actually need 01's output?

# Plan 01-03
depends_on: ["01-02"]  # Does 03 actually need 02's output?
```

This creates false sequential execution and unnecessary context loading.

**Pattern: Genuine dependencies only**
```yaml
# Plan 01-01: Create User model
depends_on: []

# Plan 01-02: Create Product model
depends_on: []  # Independent! Can parallelize.

# Plan 01-03: Create Order model (references User and Product)
depends_on: ["01-01", "01-02"]  # Genuine: imports types from both
```

## Session Handoffs

When context is exhausted or work spans sessions, PAUL provides explicit handoff support.

### Two Levels of Continuity

| Level | File | When to Use |
|-------|------|-------------|
| Light | STATE.md Session Continuity | Quick breaks, same-day resume |
| Full | HANDOFF-{date}.md | Context limits, next-day resume, zero-context sessions |

### STATE.md Session Continuity Section
Always updated. Minimal but sufficient for quick resume:

```markdown
## Session Continuity

Last session: 2026-01-28 11:15
Stopped at: Phase 3, Plan 01, Task 2 complete
Next action: Create context-management.md reference
Resume file: .paul/phases/03-references-layer/03-01-PLAN.md
Resume context:
- Task 1 complete (checkpoints.md, plan-format.md created)
- Task 2 in progress
- 55% context remaining
```

### HANDOFF.md Document
For zero-context sessions or complex multi-session work. Created by `/paul:pause`:

- Self-contained entry point (assumes no prior context)
- What was accomplished this session
- What's in progress
- Key decisions made
- Current blockers
- Exact next action
- Loop position (PLAN/APPLY/UNIFY markers)

**When to use HANDOFF vs STATE.md alone:**
- **STATE.md only:** Quick break, returning soon, context might persist
- **HANDOFF + STATE.md:** End of day, context limits, sharing with fresh session

### Session Commands

| Command | Purpose |
|---------|---------|
| `/paul:pause` | Create HANDOFF, update STATE, prepare for break |
| `/paul:resume` | Restore context from HANDOFF/STATE, suggest next action |
| `/paul:progress` | Mid-session check, suggests ONE next action |

## Anti-Patterns

**Loading everything "just in case":**
```markdown
<context>
@everything/that/might/be/relevant.md
</context>
```
Why bad: Wastes context on unused content.

**Ignoring bracket transitions:**
```
At 35% context: "Let me start this new complex task"
```
Why bad: May not have room to complete. Start fresh.

**No handoff preparation:**
```
At 15% context: Continue working without noting state
```
Why bad: Next session loses context. Always prepare resume.

## Context Budget Heuristics

| Activity | Typical Cost |
|----------|--------------|
| PLAN.md template | ~3-5k tokens |
| Read source file | ~1-3k tokens |
| Task execution | ~5-15k tokens |
| Verification output | ~2-5k tokens |
| SUMMARY.md write | ~2-3k tokens |

Plan your work with these estimates in mind.

</context_management>
