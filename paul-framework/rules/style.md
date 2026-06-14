---
paths:
  - "src/**/*.md"
---

# PAUL Style Rules

Universal conventions for all PAUL framework files.

## Language & Tone

**Imperative voice.** "Execute tasks", "Create file" — not "Execution is performed"

**No filler.** Absent: "Let me", "Just", "Simply", "Basically", "I'd be happy to"

**No sycophancy.** Absent: "Great!", "Awesome!", "Excellent!", "I'd love to help"

**Brevity with substance.** Good: "JWT auth with refresh rotation using jose library" Bad: "Phase complete"

## Temporal Language Ban

Never write: "We changed X to Y", "Previously", "No longer", "Instead of"

Always: Describe current state only.

Exception: SUMMARY.md deviations section, git commits (their purpose IS tracking change)

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `plan-phase.md` |
| Commands | `paul:kebab-case` | `paul:plan` |
| Step names | snake_case | `name="load_project_state"` |
| Bash variables | CAPS_UNDERSCORES | `PHASE_ARG` |
| Type attributes | colon separator | `type="checkpoint:human-verify"` |
| Phase directories | `NN-kebab-name` | `02-rules-layer` |
| Plan files | `NN-NN-PLAN.md` | `02-01-PLAN.md` |

## XML Conventions

XML tags are semantic containers. Use Markdown headers for hierarchy within.

```xml
<!-- DO -->
<objective>
## Goal
Build authentication system

## Purpose
Enable secure user access
</objective>

<!-- DON'T -->
<section name="objective">
  <subsection name="goal">
    <content>Build authentication</content>
  </subsection>
</section>
```

**Semantic tags to use:**
- `<objective>`, `<context>`, `<tasks>`, `<boundaries>`, `<verification>`
- `<acceptance_criteria>`, `<success_criteria>`
- `<task>`, `<action>`, `<verify>`, `<done>`
- `<purpose>`, `<when_to_use>`, `<process>`, `<step>`

**Generic tags to avoid:**
- `<section>`, `<item>`, `<content>`, `<block>`

## @-References

@-references are lazy loading signals — instructions to read at execution time, not pre-loaded content.

```markdown
# Static (always load)
@src/workflows/plan-phase.md
@src/templates/PLAN.md

# Project-relative (dynamic)
@.paul/PROJECT.md
@.paul/STATE.md

# Conditional
@.paul/DISCOVERY.md (if exists)
```

## Loop Terminology

PAUL uses explicit loop phase names:

| Phase | Purpose | Artifacts |
|-------|---------|-----------|
| PLAN | Define work, acceptance criteria | PLAN.md |
| APPLY | Execute approved plan | Code changes, APPLY-LOG |
| UNIFY | Reconcile plan vs actual | SUMMARY.md, STATE.md updates |

Always reference the current loop position when relevant.

## Acceptance Criteria Format

Use Given/When/Then (BDD) in `<acceptance_criteria>` sections:

```gherkin
Given [precondition / initial state]
When [action / trigger]
Then [expected outcome]
```

Each criterion must be independently testable.

## Commit Format

```
{type}({phase}-{plan}): {description}
```

Types: `feat`, `fix`, `test`, `refactor`, `docs`, `chore`

Rules:
- One commit per task when practical
- Stage files individually (never `git add .`)
- Include `Co-Authored-By: Claude` line
