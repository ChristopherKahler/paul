# Milestone Context Template

Template for `.paul/MILESTONE-CONTEXT.md` — temporary handoff from discuss-milestone to create-milestone.

**Purpose:** Persist milestone discussion context across `/clear` boundaries. This is a handoff artifact, not permanent documentation.

---

## File Template

```markdown
# Milestone Context

**Generated:** {{DATE}}
**Status:** Ready for /paul:create-milestone

## Features to Build

[Features identified during discussion — the substance of this milestone]

- **{{FEATURE_1}}**: {{DESCRIPTION}}
- **{{FEATURE_2}}**: {{DESCRIPTION}}
- **{{FEATURE_3}}**: {{DESCRIPTION}}

## Scope

**Suggested name:** v{{VERSION}} {{THEME_NAME}}
**Estimated phases:** {{PHASE_COUNT}}
**Focus:** {{ONE_SENTENCE_THEME}}

## Phase Mapping

[How features map to phases — rough breakdown]

| Phase | Focus | Features |
|-------|-------|----------|
| {{NEXT_PHASE}} | {{FOCUS}} | {{FEATURES}} |
| {{NEXT_PHASE+1}} | {{FOCUS}} | {{FEATURES}} |
| {{NEXT_PHASE+2}} | {{FOCUS}} | {{FEATURES}} |

## Constraints

[Any constraints or boundaries identified during discussion]

- {{CONSTRAINT_1}}
- {{CONSTRAINT_2}}

## Additional Context

[Anything else captured during discussion that informs the milestone]

{{NOTES}}

---

*This file is temporary. It will be deleted after /paul:create-milestone creates the milestone.*
*Do NOT commit this file to version control.*
```

---

## Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    MILESTONE CONTEXT LIFECYCLE                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. /paul:discuss-milestone                                      │
│     └─> Explores features, scope, constraints                    │
│     └─> Creates MILESTONE-CONTEXT.md at end                      │
│                                                                  │
│  2. /clear (safe now)                                            │
│     └─> Context persisted in file                                │
│     └─> Session can be cleared                                   │
│                                                                  │
│  3. /paul:create-milestone                                       │
│     └─> Reads MILESTONE-CONTEXT.md                               │
│     └─> Uses context to populate ROADMAP.md                      │
│     └─> Deletes MILESTONE-CONTEXT.md after success               │
│                                                                  │
│  Result: Clean handoff across session boundaries                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Points

1. **Created by:** `discuss-milestone` command at end of discussion
2. **Consumed by:** `create-milestone` command
3. **Deleted after:** Milestone successfully created
4. **Not committed:** Exclude from version control (temporary artifact)

---

## Content Guidelines

### What to Include

| Section | Include | Purpose |
|---------|---------|---------|
| Features | User-facing capabilities to build | Defines milestone substance |
| Scope | Version number, theme, phase count | Frames the work |
| Phase Mapping | Rough feature-to-phase breakdown | Guides create-milestone |
| Constraints | Technical/business limits | Prevents scope creep |
| Additional Context | Discussion notes, decisions | Preserves conversation |

### What NOT to Include

| Avoid | Why |
|-------|-----|
| Technical implementation details | That comes during phase planning |
| Detailed phase specifications | create-milestone handles that |
| Code architecture decisions | Research phase work |
| Exhaustive task lists | PLAN.md level of detail |

**Key principle:** This captures the *what* and *why*, not the *how*.

---

## Integration with PAUL Workflow

### Before discuss-milestone

```
STATE.md shows: Previous milestone complete
ROADMAP.md shows: Phases complete, next milestone undefined
```

### After discuss-milestone

```
MILESTONE-CONTEXT.md: Created with discussion output
STATE.md: Updated to note milestone discussion complete
```

### After create-milestone

```
MILESTONE-CONTEXT.md: Deleted
ROADMAP.md: Updated with new milestone and phases
STATE.md: Updated with new phase position
```

---

## Example

```markdown
# Milestone Context

**Generated:** 2026-01-29
**Status:** Ready for /paul:create-milestone

## Features to Build

- **Milestone lifecycle commands**: Create, complete, and discuss milestones
- **Roadmap modification commands**: Add and remove phases dynamically
- **Milestone templates**: Entry format, archive format, context handoff

## Scope

**Suggested name:** v0.3 Roadmap & Milestone Management
**Estimated phases:** 3
**Focus:** Complete milestone management tooling for PAUL framework

## Phase Mapping

| Phase | Focus | Features |
|-------|-------|----------|
| 9 | Templates | MILESTONES.md, archive, context templates |
| 10 | Workflows | discuss-milestone, complete-milestone, add-phase |
| 11 | Commands | CLI commands for milestone operations |

## Constraints

- Templates first, then workflows, then commands (dependency order)
- Keep commands simple — complex logic in workflows

## Additional Context

- Discussed need for milestone grouping in ROADMAP.md
- User preference for tabular layouts over bullet lists
- Consider optional SonarQube scan before milestone completion

---

*This file is temporary. It will be deleted after /paul:create-milestone creates the milestone.*
*Do NOT commit this file to version control.*
```
