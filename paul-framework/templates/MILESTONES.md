# MILESTONES.md Template

Template for `.paul/MILESTONES.md` — the project's milestone log.

**Purpose:** Track completed milestones with key accomplishments, stats, and links to next work.

---

## File Template

```markdown
# Project Milestones: [Project Name]

[Entries in reverse chronological order - newest first]

## v[X.Y] [Name] (Shipped: YYYY-MM-DD)

**Delivered:** [One sentence describing what shipped]

**Phases completed:** [X-Y] ([Z] plans total)

**Key accomplishments:**
- [Major achievement 1]
- [Major achievement 2]
- [Major achievement 3]
- [Major achievement 4]

**Stats:**
| Metric | Value |
|--------|-------|
| Files modified | [X] |
| Lines of code | [Y] |
| Phases | [N] |
| Plans completed | [M] |
| Duration | [D] days |

**Git range:** `feat(XX-XX)` → `feat(YY-YY)`

**What's next:** [Brief description of next milestone, or link to ROADMAP.md]

---
```

---

## Section Specifications

### Header
**Format:** `## v[X.Y] [Name] (Shipped: YYYY-MM-DD)`
**Example:** `## v0.2 Session Continuity (Shipped: 2026-01-28)`

### Delivered
**Purpose:** One-sentence summary of what shipped.
**Keep it:** User-focused, outcome-oriented.

### Phases completed
**Format:** `[Start]-[End] ([N] plans total)`
**Example:** `5-7 (4 plans total)` or `8.5-8.7 (3 plans total)` for decimal phases

### Key accomplishments
**Count:** 3-5 major achievements.
**Focus:** User-visible features, technical capabilities, quality improvements.
**Avoid:** Implementation details, internal refactors (unless significant).

### Stats
**Purpose:** Quantify the work for historical reference.
**Collect via:**
- Files: `git diff --stat feat(XX-XX)..feat(YY-YY) | tail -1`
- LOC: Count primary language (varies by project)
- Phases/Plans: Count from ROADMAP.md
- Duration: Days from first commit to ship

### Git range
**Purpose:** Reproducible reference to milestone commits.
**Format:** First commit → last commit of milestone.

### What's next
**Purpose:** Link to future work.
**Options:**
- Next milestone goal: "v0.3 Roadmap & Milestone Management"
- Reference: "See [ROADMAP.md](ROADMAP.md) for planned work"
- End state: "Project complete" or "Maintenance mode"

---

## Guidelines

### When to create milestones

**DO create for:**
- Initial MVP shipped (v1.0)
- Major version releases (v2.0, v3.0)
- Significant feature milestones (v1.1, v1.2)
- Before archiving planning (capture what was shipped)

**DON'T create for:**
- Individual phase completions (normal workflow)
- Work in progress (wait until shipped)
- Minor bug fixes that don't constitute a release

### Ordering

Entries are **reverse chronological** — newest milestone at top.

### Decimal phases

Include decimal phases in the range when relevant:
- "Phases completed: 8-8.7 (5 plans total)" — includes 8, 8.5, 8.6, 8.7

---

## Example

```markdown
# Project Milestones: PAUL Framework

## v0.2 Session Continuity (Shipped: 2026-01-28)

**Delivered:** Pause/resume workflow with handoff files and enhanced STATE.md session tracking

**Phases completed:** 7-8.7 (5 plans total)

**Key accomplishments:**
- Handoff file generation for session breaks
- STATE.md Session Continuity section
- SonarQube integration (optional)
- Codebase CLAUDE.md improvements

**Stats:**
| Metric | Value |
|--------|-------|
| Files modified | 12 |
| Lines of code | 850 |
| Phases | 4 (7, 8.5, 8.6, 8.7) |
| Plans completed | 5 |
| Duration | 2 days |

**Git range:** `feat(07-01)` → `feat(08.7-01)`

**What's next:** v0.3 Roadmap & Milestone Management — milestone lifecycle commands

---

## v0.1 Core Loop (Shipped: 2026-01-27)

**Delivered:** PAUL framework foundation with Plan-Apply-Unify loop

**Phases completed:** 1-6 (4 plans total)

**Key accomplishments:**
- PLAN.md, STATE.md, PROJECT.md, SUMMARY.md templates
- ROADMAP.md with phase structure
- CARL PAUL domain with 11 rules

**Stats:**
| Metric | Value |
|--------|-------|
| Files modified | 18 |
| Lines of code | 1,200 |
| Phases | 6 |
| Plans completed | 4 |
| Duration | 1 day |

**Git range:** `feat(01-01)` → `feat(06-01)`

**What's next:** v0.2 Session Continuity — pause/resume workflow
```
