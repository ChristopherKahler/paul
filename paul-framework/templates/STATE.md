# STATE.md Template

Template for `.paul/STATE.md` — the project's living memory.

**Purpose:** Single source of truth for current position, accumulated context, and session continuity.

---

## File Template

```markdown
---
description: "[Project name] — current position and accumulated context"
type: ProjectState
about: "[project-name]"
---

# Project State

## Project Reference

See: .paul/PROJECT.md (updated [YYYY-MM-DD])

**Core value:** [One-liner from PROJECT.md - the ONE thing that matters]
**Current focus:** [Current milestone and phase name]

## Current Position

Milestone: [Name] ([version])
Phase: [X] of [Y] ([Phase Name])
Plan: [A] of [B] in current phase
Status: [Ready to plan | Planning | Approved | Applying | Unifying | Complete | Blocked]
Last activity: [YYYY-MM-DD HH:MM] — [What happened]

Progress:
- Milestone: [░░░░░░░░░░] 0%
- Phase: [░░░░░░░░░░] 0%

## Loop Position

Current loop state:
```
PLAN ──▶ APPLY ──▶ UNIFY
  ◉        ○        ○     [Planning]
  ✓        ◉        ○     [Applying]
  ✓        ✓        ◉     [Unifying]
  ✓        ✓        ✓     [Complete - ready for next PLAN]
```

## Performance Metrics

**Velocity:**
- Total plans completed: [N]
- Average duration: [X] min
- Total execution time: [X.X] hours

**By Phase:**

| Phase | Plans | Total Time | Avg/Plan |
|-------|-------|------------|----------|
| 01-[name] | 0/0 | - | - |

**Recent Trend:**
- Last 5 plans: [durations]
- Trend: [Improving | Stable | Degrading]

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions logged via decision-logger. Recent decisions affecting current work:

| Decision | Phase | Impact |
|----------|-------|--------|
| [Decision summary] | [Phase X] | [Ongoing effect] |

### Deferred Issues

Issues logged but not yet addressed:

| Issue | Origin | Effort | Revisit |
|-------|--------|--------|---------|
| [Brief description] | [Phase X] | [S/M/L] | [When to reconsider] |

### Blockers/Concerns

Active blockers affecting progress:

| Blocker | Impact | Resolution Path |
|---------|--------|-----------------|
| [Description] | [What's blocked] | [How to resolve] |

## Boundaries (Active)

Protected elements for current phase:

- [Protected file/pattern from current PLAN.md]
- [Another protected element]

## Session Continuity

Last session: [YYYY-MM-DD HH:MM]
Stopped at: [Description of last completed action]
Next action: [What to do when resuming]
Resume context: [Key information needed to continue]

---
*STATE.md — Updated after every significant action*
*Size target: <100 lines (digest, not archive)*
```

---

## Section Specifications

### Project Reference
**Purpose:** Pointer to PROJECT.md for full context.
**Contains:**
- Core value (one-liner from PROJECT.md)
- Current focus (milestone + phase)
- Last update date (triggers re-read if stale)

**Update:** When PROJECT.md changes or milestone shifts.

### Current Position
**Purpose:** Where we are right now.
**Contains:**
- Milestone name and version
- Phase X of Y with name
- Plan A of B within phase
- Status (planning/applying/unifying/complete/blocked)
- Last activity timestamp and description
- Visual progress bars

**Update:** After every phase/plan state change.

### Loop Position
**Purpose:** Visual indicator of PAUL loop state.
**States:**
- Planning: PLAN active, APPLY/UNIFY pending
- Applying: PLAN complete, APPLY active, UNIFY pending
- Unifying: PLAN/APPLY complete, UNIFY active
- Complete: Full loop done, ready for next PLAN

**Update:** At each loop phase transition.

### Performance Metrics
**Purpose:** Track velocity for patterns and estimation.
**Contains:**
- Aggregate stats (total plans, average duration)
- Per-phase breakdown
- Recent trend analysis

**Update:** After each plan completion.

### Accumulated Context
**Purpose:** Digest of decisions, issues, blockers.

**Decisions:** Recent decisions affecting current work. Full log in decision-logger or PROJECT.md.

**Deferred Issues:** Items logged but not addressed. Include effort estimate and revisit trigger.

**Blockers:** Active obstacles requiring resolution.

**Update:** After UNIFY phase reconciliation.

### Boundaries (Active)
**Purpose:** Quick reference to current phase protections.
**Contains:** Protected files/patterns from active PLAN.md.

**Update:** When entering new PLAN phase.

### Session Continuity
**Purpose:** Enable instant session resumption.
**Contains:**
- Last session timestamp
- What was completed
- What to do next
- Key context needed

**Update:** At end of each session or significant pause.

---

## Size Constraint

**Target:** Under 100 lines.

STATE.md is a DIGEST, not an archive. If sections grow too large:
- Keep only 3-5 recent decisions (full log elsewhere)
- Reference issue tracker instead of listing all issues
- Keep only active blockers, remove resolved
- Summarize instead of detail

**Goal:** "Read once, know where we are" — if too long, that fails.

---

## Lifecycle

**Creation:** After ROADMAP.md created (during project init)
- Reference PROJECT.md (extract core value)
- Initialize empty sections
- Set position to "Phase 1 ready to plan"

**Reading:** First step of EVERY workflow
- Load before planning, applying, or unifying
- Provides instant context restoration

**Writing:** After every significant action
- After PLAN approval: Update status to "Approved"
- After APPLY completion: Update position, log duration
- After UNIFY: Update decisions, issues, blockers
- After session end: Update continuity section
