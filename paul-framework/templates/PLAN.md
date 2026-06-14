# PLAN.md Template

Template for `.paul/phases/{phase-number}-{name}/{phase}-{plan}-PLAN.md` - executable phase plans.

**Naming:** `{phase}-{plan}-PLAN.md` (e.g., `01-02-PLAN.md` for Phase 1, Plan 2)

---

## File Template

```markdown
---
phase: XX-name
plan: NN
plan_type: execute               # execute | tdd | research
wave: N                          # Execution wave (1, 2, 3...). Pre-computed at plan time.
depends_on: []                   # Plan IDs this plan requires (e.g., ["01-01"]).
files_modified: []               # Files this plan modifies.
autonomous: true                 # false if plan has checkpoints requiring user interaction
description: "[Goal one-liner from objective]"
type: Plan                       # index pipeline entity type
about: "[project-name]"
---

<objective>
## Goal
[What this plan accomplishes - specific, measurable]

## Purpose
[Why this matters for the project - connects to PROJECT.md value]

## Output
[What artifacts will be created/modified]
</objective>

<context>
## Project Context
@.paul/PROJECT.md
@.paul/ROADMAP.md
@.paul/STATE.md

## Prior Work (only if genuinely needed)
# Only reference prior SUMMARYs if:
# - This plan imports types/exports from prior plan
# - Prior plan made decision affecting this plan
# - Prior plan's output is direct input to this plan
#
# Do NOT reflexively chain: Plan 02 refs 01, Plan 03 refs 02...

## Source Files
@path/to/relevant/source.ts
</context>

<skills>
## Required Skills (from SPECIAL-FLOWS.md)

<!-- If .paul/SPECIAL-FLOWS.md exists, this section is auto-populated by /paul:plan -->
<!-- If no SPECIAL-FLOWS.md, omit this section or show "No specialized flows configured" -->

| Skill | Priority | When to Invoke | Loaded? |
|-------|----------|----------------|---------|
| /skill-name | required | Before [work type] | ○ |
| /skill-name | optional | For [specific need] | ○ |

**BLOCKING:** Required skills MUST be loaded before APPLY proceeds.
Run each skill command or confirm already loaded.

## Skill Invocation Checklist
- [ ] /skill-1 loaded (run command or confirm)
- [ ] /skill-2 loaded (run command or confirm)

</skills>

<acceptance_criteria>

## AC-1: [Criterion Name]
```gherkin
Given [precondition / system state]
When [user action / trigger]
Then [expected outcome / observable result]
```

## AC-2: [Criterion Name]
```gherkin
Given [precondition]
When [action]
Then [outcome]
```

## AC-3: [Criterion Name]
```gherkin
Given [precondition]
When [action]
Then [outcome]
```

</acceptance_criteria>

<tasks>

<task type="auto">
  <name>Task 1: [Action-oriented name]</name>
  <files>path/to/file.ext, another/file.ext</files>
  <action>
    [Specific implementation instructions]
    - What to do
    - How to do it
    - What to avoid and WHY
  </action>
  <verify>[Command or check to prove it worked]</verify>
  <done>[Measurable acceptance criteria - links to AC-N]</done>
</task>

<task type="auto">
  <name>Task 2: [Action-oriented name]</name>
  <files>path/to/file.ext</files>
  <action>[Specific implementation]</action>
  <verify>[Command or check]</verify>
  <done>[Acceptance criteria]</done>
</task>

<task type="checkpoint:decision" gate="blocking">
  <decision>[What needs deciding]</decision>
  <context>[Why this decision matters now]</context>
  <options>
    <option id="option-a">
      <name>[Option name]</name>
      <pros>[Benefits and advantages]</pros>
      <cons>[Tradeoffs and limitations]</cons>
    </option>
    <option id="option-b">
      <name>[Option name]</name>
      <pros>[Benefits and advantages]</pros>
      <cons>[Tradeoffs and limitations]</cons>
    </option>
  </options>
  <resume-signal>Select: option-a or option-b</resume-signal>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>[What was built that needs verification]</what-built>
  <how-to-verify>
    1. Run: [command to start]
    2. Visit: [URL or location]
    3. Test: [Specific interactions]
    4. Confirm: [Expected behaviors]
  </how-to-verify>
  <resume-signal>Type "approved" to continue, or describe issues to fix</resume-signal>
</task>

</tasks>

<boundaries>

## DO NOT CHANGE
- [Protected file or pattern]
- [Another protected element]

## SCOPE LIMITS
- [What's explicitly out of scope for this plan]
- [Another exclusion]

</boundaries>

<verification>
Before declaring plan complete:
- [ ] [Specific test command]
- [ ] [Build/type check passes]
- [ ] [Behavior verification]
- [ ] All acceptance criteria met
</verification>

<success_criteria>
- All tasks completed
- All verification checks pass
- No errors or warnings introduced
- [Plan-specific criteria]
</success_criteria>

<output>
After completion, create `.paul/phases/XX-name/{phase}-{plan}-SUMMARY.md`
</output>
```

---

## Frontmatter Fields

| Field | Required | Purpose |
|-------|----------|---------|
| `phase` | Yes | Phase identifier (e.g., `01-foundation`) |
| `plan` | Yes | Plan number within phase (e.g., `01`, `02`) |
| `plan_type` | Yes | `execute` for standard, `tdd` for test-driven, `research` for exploration |
| `wave` | Yes | Execution wave number (1, 2, 3...). Pre-computed at plan time. |
| `depends_on` | Yes | Array of plan IDs this plan requires. Empty = parallel candidate. |
| `files_modified` | Yes | Files this plan touches. For conflict detection. |
| `autonomous` | Yes | `true` if no checkpoints, `false` if has checkpoints |

---

## Task Types

| Type | Use For | Behavior |
|------|---------|----------|
| `auto` | Everything AI can do independently | Fully autonomous execution |
| `checkpoint:decision` | Implementation choices requiring human input | Pauses, presents options, waits for selection |
| `checkpoint:human-verify` | Visual/functional verification | Pauses, presents verification steps, waits for approval |
| `checkpoint:human-action` | Truly unavoidable manual steps (rare) | Pauses, describes action, waits for confirmation |

---

## Task Structure Requirements

Every `auto` task MUST have:
- `<name>` - Action-oriented, describes outcome
- `<files>` - Which files created/modified
- `<action>` - Specific implementation (what to do, what to avoid)
- `<verify>` - How to prove it worked (command, check)
- `<done>` - Acceptance criteria (links to AC-N)

**If you can't specify Files + Action + Verify + Done, the task is too vague.**

---

## Acceptance Criteria Format

Use Given/When/Then (BDD) format:

```gherkin
Given [precondition / initial state]
When [action / trigger]
Then [expected outcome]
```

**Guidelines:**
- Each criterion should be independently testable
- Include error states and edge cases
- Avoid implementation details (describe behavior, not code)
- Link tasks to criteria via `<done>AC-N satisfied</done>`

---

## Scope Guidance

**Plan sizing:**
- 2-3 tasks per plan maximum
- ~50% context usage target
- Single concern per plan

**When to split into multiple plans:**
- Different subsystems (auth vs API vs UI)
- More than 3 tasks
- Risk of context overflow
- TDD candidates (separate plans)

**Prefer vertical slices:**
```
PREFER: Plan 01 = User (model + API + UI)
        Plan 02 = Product (model + API + UI)

AVOID:  Plan 01 = All models
        Plan 02 = All APIs
        Plan 03 = All UIs
```

---

## Parallel Execution

**Wave 1 candidates (parallel):**
- `depends_on: []` - No dependencies
- No file conflicts with other Wave 1 plans
- `autonomous: true` - No checkpoints blocking

**Sequential (genuine dependency):**
- `depends_on: ["01-01"]` - Requires prior plan output
- Uses types/exports created by prior plan
- Prior plan makes decision affecting this plan

**Do NOT reflexively chain:** Plan 02 depending on 01 "just because" creates false sequential execution.

---

## Anti-Patterns

**Vague tasks:**
```xml
<!-- BAD -->
<task type="auto">
  <name>Set up authentication</name>
  <action>Add auth to the app</action>
</task>

<!-- GOOD -->
<task type="auto">
  <name>Create login endpoint with JWT</name>
  <files>src/api/auth/login.ts, src/lib/jwt.ts</files>
  <action>
    Create POST /api/auth/login endpoint:
    - Accept { email, password } body
    - Validate against User model with bcrypt compare
    - Return JWT token on success (15min expiry)
    - Return 401 on invalid credentials
    Avoid: Storing plaintext passwords, using weak JWT secrets
  </action>
  <verify>curl -X POST /api/auth/login returns JWT token</verify>
  <done>AC-1 satisfied: User can authenticate with valid credentials</done>
</task>
```

**Reflexive dependencies:**
```yaml
# BAD - chaining just because sequential
depends_on: ["01-01"]  # Plan 02 doesn't actually need 01's output

# GOOD - genuine dependency
depends_on: ["01-01"]  # Plan 02 imports User type from 01-01
```

**Missing boundaries:**
```markdown
<!-- BAD - no protection -->
<tasks>...</tasks>

<!-- GOOD - explicit boundaries -->
<boundaries>
## DO NOT CHANGE
- database/migrations/* (schema locked for this phase)
- src/lib/auth.ts (auth system stable)
</boundaries>
```
