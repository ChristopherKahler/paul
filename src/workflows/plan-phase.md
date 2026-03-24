<purpose>
Create an executable PLAN.md for the current or specified phase. Detects work size to route between quick-fix (compressed) and standard (full) ceremony, validates plan coherence against project context, and defines objective, acceptance criteria, tasks, boundaries, and verification — everything needed for APPLY phase execution.
</purpose>

<when_to_use>
- Starting a new phase (ROADMAP shows next phase ready)
- Previous plan completed (loop closed with UNIFY)
- First plan in a project (after init-project)
- Resuming work that needs a new plan
</when_to_use>

<loop_context>
Expected phase: PLAN
Prior phase: UNIFY (previous plan complete) or none (first plan)
Next phase: APPLY (after plan approval)
</loop_context>

<required_reading>
@.paul/STATE.md
@.paul/ROADMAP.md
@.paul/PROJECT.md
@.paul/phases/{prior-phase}/{plan}-SUMMARY.md (if exists and relevant)
</required_reading>

<references>
@~/.claude/paul-framework/references/plan-format.md
@~/.claude/paul-framework/references/checkpoints.md (if plan will have checkpoints)
@~/.claude/paul-framework/templates/PLAN.md
</references>

<process>

<step name="validate_preconditions" priority="first">
1. Read STATE.md to confirm:
   - Loop position is ready for PLAN (prior UNIFY complete or first plan)
   - No blockers preventing planning
2. If STATE.md shows mid-loop (APPLY or UNIFY incomplete):
   - Warn user: "Previous loop not closed. Complete UNIFY first or reset."
   - Do not proceed until resolved
</step>

<step name="identify_phase">
1. Read ROADMAP.md to determine:
   - Which phase is next (first incomplete phase)
   - Phase scope and goals
   - Dependencies on prior phases
2. If multiple phases available, ask user which to plan
3. Confirm phase selection before proceeding
</step>

<step name="classify_scope">
**Detect work size and route to appropriate ceremony level — instead of applying full ceremony to every change, because a one-line fix doesn't need boundaries sections and verification checklists.**

Analyze the user's request and phase scope:

**Quick-fix signals** (all three must be true):
- User's request fits in one sentence
- Touches 1-2 files
- No architectural implications (no new patterns, no dependency changes, no structural decisions)

**Complex signals** (any one triggers):
- 6+ tasks estimated
- Multiple subsystems affected
- Architectural decisions needed
- Phase description in ROADMAP mentions multiple concerns

**Standard:** Everything else (default track).

**Confirm routing with user:**
```
This looks like a [quick-fix / standard / complex] scope.

[quick-fix]: Compressed plan — objective + 1 task + 1 AC. Still loops through apply and unify.
[standard]: Full plan with boundaries, multiple ACs, verification checklist.
[complex]: Full plan + recommend splitting into multiple plans if >3 tasks.

Proceed with [detected track]? Or override to a different track?
```

Wait for response. Store as `plan_track`.
</step>

<step name="analyze_scope">
1. Review phase goals from ROADMAP.md
2. Estimate number of tasks needed:
   - **Quick-fix:** 1 task only
   - **Standard:** Target 2-3 tasks per plan — instead of larger plans, because quality degrades past 50% context usage
   - **Complex:** If >3 tasks, actively suggest splitting into multiple plans
3. Identify files that will be modified
4. **If standard or complex:** Determine if checkpoints are needed:
   - Visual verification required? → checkpoint:human-verify
   - Architecture decision needed? → checkpoint:decision
   - Unavoidable manual action? → checkpoint:human-action (rare)
5. Set autonomous flag: true if no checkpoints (quick-fix is always autonomous)
</step>

<step name="load_context">
1. Read PROJECT.md for:
   - Core requirements and constraints
   - Value proposition (what matters)
2. If prior phase exists, read its SUMMARY.md for:
   - What was built
   - Decisions made
   - Any deferred issues
3. Read source files relevant to this phase's work
4. Do NOT reflexively chain all prior summaries — instead only load what's genuinely needed for THIS plan, because unnecessary context loading wastes tokens and dilutes focus
</step>

<step name="check_specialized_flows">
**Check for SPECIAL-FLOWS.md and populate skills section.**

**Skip this step for quick-fix plans** — compressed format doesn't include skills section.

1. Check if `.paul/SPECIAL-FLOWS.md` exists
2. If exists:
   - Read SPECIAL-FLOWS.md
   - Extract skills marked as "required" for the work type being planned
   - Match against phase/plan work being done
   - Prepare <skills> section content for PLAN.md
3. If not exists:
   - Add comment: "No SPECIAL-FLOWS.md - skills section omitted"
   - Skip skills section in PLAN (or include minimal placeholder)
4. Display reminder if required skills found:
   ```
   ════════════════════════════════════════
   REQUIRED SKILLS for this plan:
   ════════════════════════════════════════
   - /skill-1 (work type: X)
   - /skill-2 (work type: Y)

   These must be loaded before /paul:apply will proceed.
   ════════════════════════════════════════
   ```

**Note:** The skills section is populated from SPECIAL-FLOWS.md during plan creation.
Required skills will BLOCK apply-phase until confirmed loaded.
</step>

<step name="create_plan">
**Generate PLAN.md — format adapts based on `plan_track`.**

1. Create phase directory: `.paul/phases/{NN}-{phase-name}/`

**If `plan_track = quick-fix`:**

Generate compressed PLAN.md:
```markdown
---
phase: NN-name
plan: NN
type: execute
autonomous: true
---

<objective>
## Goal
[Single sentence: what this fixes/changes]
</objective>

<context>
@.paul/PROJECT.md
@relevant/source/file
</context>

<acceptance_criteria>
## AC-1: [Criterion]
Given [precondition]
When [action]
Then [expected outcome]
</acceptance_criteria>

<tasks>
<task type="auto">
  <name>[Action-oriented name]</name>
  <files>[file paths]</files>
  <action>[Specific instructions]</action>
  <verify>[How to prove it worked]</verify>
  <done>AC-1 satisfied: [condition]</done>
</task>
</tasks>

<output>
After completion, create compressed SUMMARY.md
</output>
```

No boundaries, no verification checklist, no success_criteria, no skills section.
Still a valid PLAN.md that APPLY can execute and UNIFY can reconcile.

**If `plan_track = standard` or `complex`:**

Generate full PLAN.md following template structure:

   **Frontmatter:**
   - phase: NN-name
   - plan: 01 (or next number if multiple plans in phase)
   - type: execute (or tdd/research)
   - wave: 1 (adjust if dependencies exist)
   - depends_on: [] (or prior plan IDs if genuine dependency)
   - files_modified: [list all files]
   - autonomous: true/false

   **Sections:**
   - <objective>: Goal, Purpose, Output
   - <context>: @-references to project files and source
   - <acceptance_criteria>: Given/When/Then for each criterion
   - <tasks>: Task definitions with files, action, verify, done
   - <boundaries>: DO NOT CHANGE, SCOPE LIMITS
   - <verification>: Overall completion checks
   - <success_criteria>: Measurable completion
   - <output>: SUMMARY.md location

3. Ensure every task has:
   - Clear files list
   - Specific action (not vague)
   - Verification command/check
   - Done criteria linking to AC-N
</step>

<step name="validate_plan">
**If quick-fix:** Validate AC is testable and task has files + action + verify + done. Skip section completeness check.

**If standard/complex:**
1. Check all sections present
2. Verify acceptance criteria are testable
3. Confirm tasks are specific enough (files + action + verify + done)
4. Ensure boundaries protect completed work
5. Validate checkpoint placement (if any):
   - After automated work completes
   - Before dependent decisions
   - Not too frequent (avoid checkpoint fatigue)
</step>

<step name="coherence_check">
**Lightweight coherence validation — runs automatically for ALL plan tracks, surfaces only when issues found.**

This is NOT the enterprise audit — it's a quick validation pass that runs in seconds, adding friction only when contradictions exist.

1. **PROJECT.md alignment:**
   - Read PROJECT.md constraints section
   - Does the plan contradict any stated constraint?
   - Example: PROJECT.md says "no external dependencies" but plan adds a package

2. **Accumulated decisions:**
   - Read STATE.md `### Decisions` table
   - Does the plan conflict with any recorded decision?
   - Example: Decision says "use JWT auth" but plan implements session auth

3. **Recent file overlap:**
   - Check last 2-3 SUMMARY files in the current or prior phase
   - Does the plan modify files that were changed recently without acknowledging it?
   - Example: Plan modifies auth.ts which was rewritten last phase
   - **Note:** Overlap isn't always bad — just flag it so the user is aware

4. **ROADMAP scope match:**
   - Read the phase description in ROADMAP.md
   - Does the plan's scope match what the phase is supposed to deliver?
   - Example: Phase says "UI components" but plan does database migrations

**If issues found:**
```
⚠️ Coherence check found [N] items:
  1. [specific issue with file/section reference]
  2. [specific issue with file/section reference]

Review these before approving, or type "acknowledged" to proceed.
```

Wait for user response if issues found.

**If no issues:** Silent pass. No output. Zero friction.
</step>

<step name="check_audit_config">
**Check if enterprise plan audit is enabled for this project.**

1. Check if `.paul/config.md` exists
2. If exists, read and check for `enterprise_plan_audit:` section with `enabled: true`
3. Store `audit_enabled` flag (true/false) for use in update_state prompt
4. If config missing or section missing: `audit_enabled = false`

This flag determines whether the post-plan routing suggests audit before APPLY.
</step>

<step name="update_state" priority="required">
**This step is REQUIRED. Do not skip.**

1. **Update STATE.md** with exact content:

   ```markdown
   ## Current Position

   Milestone: v0.1 [Milestone Name]
   Phase: [N] of [total] ([Phase Name]) — Planning
   Plan: [NN-PP] created, awaiting approval
   Status: PLAN created, ready for APPLY
   Last activity: [timestamp] — Created [plan-path]

   Progress:
   - Milestone: [░░░░░░░░░░] X%
   - Phase [N]: [░░░░░░░░░░] 0%

   ## Loop Position

   Current loop state:
   ```
   PLAN ──▶ APPLY ──▶ UNIFY
     ✓        ○        ○     [Plan created, awaiting approval]
   ```

   ## Session Continuity

   Last session: [timestamp]
   Stopped at: Plan [NN-PP] created
   Next action: Review and approve plan, then run /paul:apply [plan-path]
   Resume file: [plan-path]
   ```

2. **Update ROADMAP.md** milestone status:
   - If first plan of milestone: Change "Not started" → "In progress"
   - Update phase status: "Not started" → "Planning"

3. **Report with quick continuation prompt:**

   **If `audit_enabled` is true:**
   ```
   ════════════════════════════════════════
   PLAN CREATED [quick-fix / standard / complex]
   ════════════════════════════════════════

   Plan: [plan-path]
   Phase: [N] — [Phase Name]

   [plan summary - key tasks, checkpoints]

   Enterprise plan audit is enabled for this project.

   ---
   Next step?

   [1] Run AUDIT (recommended) | [2] Skip audit, run APPLY | [3] Questions first | [4] Pause here
   ```
   Accept quick inputs: "1", "audit" → run `/paul:audit [plan-path]`
   Accept quick inputs: "2", "skip", "apply" → run `/paul:apply [plan-path]`

   **If `audit_enabled` is false (default):**
   ```
   ════════════════════════════════════════
   PLAN CREATED [quick-fix / standard / complex]
   ════════════════════════════════════════

   Plan: [plan-path]
   Phase: [N] — [Phase Name]

   [plan summary - key tasks, checkpoints]

   ---
   Continue to APPLY?

   [1] Approved, run APPLY | [2] Questions first | [3] Pause here
   ```
   Accept quick inputs: "1", "approved", "yes", "go" → run `/paul:apply [plan-path]`
</step>

</process>

<output>
PLAN.md at `.paul/phases/{NN}-{phase-name}/{NN}-{plan}-PLAN.md`

Example: `.paul/phases/04-workflows-layer/04-01-PLAN.md`
</output>

<error_handling>
**STATE.md missing:**
- Offer to create from ROADMAP.md inference
- Or ask user to run init-project first

**ROADMAP.md missing:**
- Cannot plan without roadmap
- Ask user to create ROADMAP.md or run init-project

**Phase dependencies not met:**
- Warn user which prior phases must complete first — instead of silently proceeding, because building on incomplete foundations produces plans that can't execute
- Do not create plan until dependencies satisfied
</error_handling>
