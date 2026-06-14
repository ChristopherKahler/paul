# ROADMAP.md Template

Template for `.paul/ROADMAP.md` — the project's phase structure.

**Purpose:** Define milestones and phases. Provides structure, not detailed tasks.

---

## Milestone Status Legend

| Emoji | Status | Meaning |
|-------|--------|---------|
| ✅ | Shipped | Milestone complete and archived |
| 🚧 | In Progress | Active development |
| 📋 | Planned | Defined but not started |

---

## File Template (Initial v1.0)

```markdown
---
description: "[Project name] — milestone and phase structure"
type: Roadmap
about: "[project-name]"
---

# Roadmap: [Project Name]

## Overview

[One paragraph describing the journey from start to finish]

## Current Milestone

**[Milestone Name]** ([version])
Status: [Not started | In progress | Complete]
Phases: [X] of [Y] complete

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with [INSERTED])

Phases execute in numeric order: 1 → 2 → 2.1 → 2.2 → 3 → 3.1 → 4

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 1 | [Name] | [N] | Not started | - |
| 2 | [Name] | [N] | Not started | - |
| 3 | [Name] | [N] | Not started | - |
| 4 | [Name] | [N] | Not started | - |

## Phase Details

### Phase 1: [Name]

**Goal:** [What this phase delivers - specific outcome]
**Depends on:** Nothing (first phase)
**Research:** [Unlikely | Likely] ([reason])

**Scope:**
- [Deliverable 1]
- [Deliverable 2]
- [Deliverable 3]

**Plans:**
- [ ] 01-01: [Brief description]
- [ ] 01-02: [Brief description]
- [ ] 01-03: [Brief description]

### Phase 2: [Name]

**Goal:** [What this phase delivers]
**Depends on:** Phase 1 ([specific dependency])
**Research:** [Unlikely | Likely] ([reason])
**Research topics:** [If Likely - what needs investigating]

**Scope:**
- [Deliverable 1]
- [Deliverable 2]

**Plans:**
- [ ] 02-01: [Brief description]
- [ ] 02-02: [Brief description]

### Phase 2.1: [Name] [INSERTED]

**Goal:** [Urgent work inserted between phases]
**Depends on:** Phase 2
**Reason:** [Why this was inserted]

**Plans:**
- [ ] 02.1-01: [Description]

### Phase 3: [Name]

**Goal:** [What this phase delivers]
**Depends on:** Phase 2 ([specific dependency])
**Research:** [Unlikely | Likely]

**Scope:**
- [Deliverable 1]
- [Deliverable 2]

**Plans:**
- [ ] 03-01: [Brief description]
- [ ] 03-02: [Brief description]

### Phase 4: [Name]

**Goal:** [What this phase delivers]
**Depends on:** Phase 3
**Research:** Unlikely (internal patterns)

**Scope:**
- [Deliverable 1]

**Plans:**
- [ ] 04-01: [Brief description]

---
*Roadmap created: [YYYY-MM-DD]*
*Last updated: [YYYY-MM-DD]*
```

---

## File Template (After v1.0 Ships)

After completing first milestone, reorganize with milestone groupings:

```markdown
# Roadmap: [Project Name]

## Milestones

| Version | Name | Phases | Status | Completed |
|---------|------|--------|--------|-----------|
| v1.0 | MVP | 1-4 | ✅ Shipped | YYYY-MM-DD |
| v1.1 | [Name] | 5-6 | 🚧 In Progress | - |
| v2.0 | [Name] | 7-10 | 📋 Planned | - |

## 🚧 Active Milestone: v1.1 [Name]

**Goal:** [What v1.1 delivers]
**Status:** Phase [X] of [Y]
**Progress:** [██████░░░░] 60%

### Phase 5: [Name]

**Goal:** [What this phase delivers]
**Depends on:** Phase 4

**Plans:**
- [x] 05-01: [Completed plan]
- [ ] 05-02: [In progress or pending]

### Phase 6: [Name]

**Goal:** [What this phase delivers]
**Depends on:** Phase 5

**Plans:**
- [ ] 06-01: [Brief description]

## 📋 Planned Milestone: v2.0 [Name]

**Goal:** [What v2.0 delivers]
**Prerequisite:** v1.1 complete
**Estimated phases:** [N]

[Phase outlines without detailed plans — detail added when milestone begins]

| Phase | Focus | Research |
|-------|-------|----------|
| 7 | [Focus] | Unlikely |
| 8 | [Focus] | Likely |
| 9 | [Focus] | Unlikely |
| 10 | [Focus] | Unlikely |

## ✅ Completed Milestones

<details>
<summary>v1.0 MVP (Phases 1-4) — Shipped YYYY-MM-DD</summary>

### Phase 1: [Name]
**Goal:** [What was delivered]
**Plans:** 3 complete

- [x] 01-01: [Description]
- [x] 01-02: [Description]
- [x] 01-03: [Description]

### Phase 2: [Name]
**Goal:** [What was delivered]
**Plans:** 2 complete

- [x] 02-01: [Description]
- [x] 02-02: [Description]

### Phase 3: [Name]
**Goal:** [What was delivered]
**Plans:** 1 complete

- [x] 03-01: [Description]

### Phase 4: [Name]
**Goal:** [What was delivered]
**Plans:** 1 complete

- [x] 04-01: [Description]

**Milestone archive:** See [milestones/v1.0-mvp.md](milestones/v1.0-mvp.md)

</details>

---
*Last updated: [YYYY-MM-DD]*
```

---

## Section Specifications

### Overview
**Purpose:** High-level journey description.
**Length:** One paragraph.
**Update:** When project direction changes significantly.

### Current Milestone
**Purpose:** Quick reference to active milestone.
**Contains:** Name, version, status, phase progress.
**Update:** After each phase completion.

### Phases Table
**Purpose:** At-a-glance view of all phases.
**Contains:** Phase number, name, plan count, status, completion date.
**Update:** After each plan/phase completion.

### Phase Details
**Purpose:** Detailed breakdown of each phase.
**Contains:**
- **Goal:** Specific deliverable outcome
- **Depends on:** Phase dependencies with reason
- **Research:** Likely/Unlikely with justification
- **Scope:** Bullet list of deliverables
- **Plans:** Checklist with brief descriptions

**Update:** During planning; status after completion.

---

## Phase Numbering

**Integer phases (1, 2, 3):** Planned work from roadmap creation.

**Decimal phases (2.1, 2.2):** Urgent insertions.
- Insert between consecutive integers
- Mark with [INSERTED] tag
- Include reason for insertion
- Filesystem sorts correctly: 2 < 2.1 < 2.2 < 3

**Validation for decimal insertion:**
- Integer X must exist and be complete
- Integer X+1 must exist in roadmap
- Decimal X.Y must not already exist
- Y >= 1

---

## Depth Configuration

Phase count depends on project depth:

| Depth | Typical Phases | Plans/Phase |
|-------|----------------|-------------|
| Quick | 3-5 | 1-3 |
| Standard | 5-8 | 3-5 |
| Comprehensive | 8-12 | 5-10 |

**Key principle:** Derive phases from actual work. Depth determines compression tolerance, not a target to hit.

---

## Research Flags

- **Unlikely:** Internal patterns, CRUD operations, established conventions
- **Likely:** External APIs, new libraries, architectural decisions

When `Research: Likely`:
- Include `Research topics:` field
- Consider research phase before implementation
- Discovery may be required during planning

---

## Status Values

| Status | Meaning |
|--------|---------|
| Not started | Phase hasn't begun |
| In progress | Actively working |
| Complete | All plans done (add date) |
| Deferred | Pushed to later (add reason) |

---

## Milestone Sections

### Active Milestone
**Purpose:** Currently executing milestone with full phase details.
**Contains:**
- Goal and status summary
- Progress bar visualization
- All phases with plan checklists
- Research flags where applicable

### Planned Milestone
**Purpose:** Defined but not started milestone.
**Contains:**
- Goal and prerequisites
- Phase table (focus areas, research likelihood)
- NOT detailed plans (added when milestone begins)

### Completed Milestones
**Purpose:** Historical record in collapsible sections.
**Contains:**
- Summary header with ship date
- Phase details (collapsed by default)
- Link to full milestone archive

**Key principle:** Completed work should not consume visual space — collapse it.
