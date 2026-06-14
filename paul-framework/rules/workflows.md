---
paths:
  - "src/workflows/**/*.md"
---

# Workflow Rules

Rules for editing files in `src/workflows/`.

## No Frontmatter

Workflows don't use YAML frontmatter. Content starts immediately with semantic XML.

## Required Sections

Every workflow MUST have:

1. `<purpose>` — What this workflow accomplishes (1-2 sentences)
2. `<when_to_use>` — Decision criteria for invoking this workflow
3. `<process>` — Container for execution steps

## Optional Sections

- `<required_reading>` — Files to read before starting
- `<loop_context>` — Current PLAN/APPLY/UNIFY phase awareness
- `<references>` — @-references to load conceptual docs when relevant

## Step Elements

When using `<step>` elements within `<process>`:

```xml
<step name="load_project_state" priority="first">
  Read .paul/STATE.md to determine current position.
  Verify loop phase matches expected phase for this workflow.
</step>

<step name="execute_tasks">
  For each task in PLAN.md:
  1. Execute task action
  2. Run task verification
  3. Record result
</step>
```

- `name` attribute: snake_case (e.g., `name="load_project_state"`)
- `priority` attribute: Optional ("first", "second") for ordering hints
- Content: Imperative instructions, can include numbered steps

## Loop Phase Awareness

Workflows should be aware of their position in the PAUL loop:

```xml
<loop_context>
Expected phase: PLAN
Prior phase: UNIFY (previous plan) or none (first plan)
Next phase: APPLY (after plan approval)
</loop_context>
```

This helps workflows validate they're being invoked at the right time.

## Conditional Logic

For mode-dependent behavior:

```xml
<if autonomous="true">
  Execute all tasks without checkpoints.
</if>

<if autonomous="false">
  Pause at each checkpoint:human-verify task.
</if>
```

Conditions reference PLAN.md frontmatter or config values.

## Key Principle

Workflows contain detailed execution logic. Commands are thin wrappers that delegate to workflows.

A workflow can be long and detailed. It answers "how to do it" comprehensively.

## Example Workflow Structure

```markdown
<purpose>
Execute an approved PLAN by running tasks in order, verifying each, and recording results.
</purpose>

<when_to_use>
- User has approved a PLAN.md
- STATE.md shows loop position at PLAN (ready for APPLY)
- No blocking checkpoints remain unresolved
</when_to_use>

<required_reading>
@.paul/STATE.md
@.paul/phases/{phase}/{plan}-PLAN.md
</required_reading>

<loop_context>
Expected phase: APPLY
Prior phase: PLAN (approval just received)
Next phase: UNIFY (after execution completes)
</loop_context>

<process>

<step name="validate_preconditions" priority="first">
  1. Read STATE.md, confirm loop position
  2. Read PLAN.md, confirm autonomous flag
  3. If autonomous=false and checkpoints exist, warn user
</step>

<step name="execute_tasks">
  For each <task> in PLAN.md <tasks> section:
  1. Log task start
  2. Execute <action> content
  3. Run <verify> command
  4. If verify passes, record in APPLY-LOG
  5. If verify fails, stop and report
</step>

<step name="finalize">
  1. Update STATE.md loop position to UNIFY
  2. Report completion status
</step>

</process>
```
