<loop_phases>

## Purpose

Explain the semantics of PAUL's three loop phases: PLAN, APPLY, UNIFY. Every unit of work follows this loop. Skipping phases breaks traceability and increases risk.

## The Loop

```
    ┌─────────────────────────────────────────┐
    │                                         │
    ▼                                         │
  PLAN ────────► APPLY ────────► UNIFY ───────┘
    │              │               │
    │              │               │
 Define work   Execute work   Reconcile
 Get approval  Verify tasks   Update state
```

## PLAN Phase

**Purpose:** Define what will be built, how it will be verified, and what's out of scope.

**Artifacts Created:**
- `{phase}-{plan}-PLAN.md` in `.paul/phases/{phase-name}/`

**Activities:**
1. Analyze requirements and context
2. Define objective (Goal, Purpose, Output)
3. Write acceptance criteria (Given/When/Then)
4. Break down into tasks with Files, Action, Verify, Done
5. Set boundaries (DO NOT CHANGE, SCOPE LIMITS)
6. Define verification checklist
7. **Wait for approval before proceeding**

**Entry Condition:**
- Prior plan completed (UNIFY done) OR first plan
- ROADMAP indicates this phase is next

**Exit Condition:**
- PLAN.md created with all required sections
- User has approved the plan
- STATE.md updated to show "ready for APPLY"

**Loop Position:**
```
PLAN ──▶ APPLY ──▶ UNIFY
  ✓        ○        ○     [PLAN complete, awaiting APPLY]
```

## APPLY Phase

**Purpose:** Execute the approved plan by completing tasks in order, verifying each.

**Artifacts Created:**
- Code/files specified in PLAN.md
- APPLY-LOG (optional, for complex plans)

**Activities:**
1. Read PLAN.md to load task definitions
2. For each auto task, follow the Execute/Qualify (E/Q) loop:
   - **Execute** the action
   - **Report status** (DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED)
   - **Qualify** against spec and linked AC (re-read output, run verify fresh, compare)
   - Score: PASS / GAP / DRIFT — loop on gaps until resolved
3. Stop at checkpoints, wait for human
4. On checkpoint failure: classify root cause (intent/spec/code) before fixing
5. Track deviations from plan

### Task Execution Statuses

After executing each task, report one of four statuses before qualification:

| Status | Meaning | What Happens Next |
|---|---|---|
| **DONE** | Task completed, no concerns | Standard qualify check against spec + AC |
| **DONE_WITH_CONCERNS** | Completed but have doubts | Qualify focuses on flagged concerns first, then full check |
| **NEEDS_CONTEXT** | Can't complete — missing information | Pause execution. Surface what's missing. Wait for user input |
| **BLOCKED** | Can't complete — structural impediment | Stop. Report what was attempted, what's blocking, what help is needed |

**Rules:**
- NEVER silently produce work you're unsure about — instead report DONE_WITH_CONCERNS, because pretending confidence when you have doubts produces work that fails during verification or in production
- NEEDS_CONTEXT is not failure — it's honest communication that prevents wasted work on wrong assumptions
- BLOCKED must include specifics — instead of a vague "I'm stuck", because specificity enables the user to unblock you efficiently

### Execute/Qualify (E/Q) Loop

Every auto task follows the E/Q loop:

```
EXECUTE → REPORT STATUS → QUALIFY → (fix gaps) → NEXT TASK
```

The Qualify step independently verifies output against the spec — instead of trusting execution memory, because the implementer's report of their own work is inherently optimistic. Qualify re-reads the actual files, runs verify commands fresh, and compares line-by-line against the task spec and linked AC.

Qualify scores each task: **PASS** (matches spec), **GAP** (missing something), or **DRIFT** (built something different). GAP and DRIFT trigger a fix-and-requalify loop (max 3 attempts before escalating to user).

### Diagnostic Failure Routing

When a checkpoint:human-verify fails, classify before fixing:
- **Intent issue** → re-plan the phase with updated intent
- **Spec issue** → fix the plan (ACs/tasks) before patching code
- **Code issue** → standard fix-in-place

This prevents the anti-pattern of patching code when the plan itself was wrong.

**Entry Condition:**
- PLAN.md exists and is approved
- STATE.md shows loop position at PLAN complete

**Exit Condition:**
- All tasks completed with PASS qualify status (or blocked with documentation)
- All checkpoint verifications resolved
- Ready for reconciliation

**Loop Position:**
```
PLAN ──▶ APPLY ──▶ UNIFY
  ✓        ✓        ○     [APPLY complete, ready for UNIFY]
```

## UNIFY Phase

**Purpose:** Reconcile what was planned vs. what was built. Close the loop.

**Artifacts Created:**
- `{phase}-{plan}-SUMMARY.md` in `.paul/phases/{phase-name}/`
- Updated `STATE.md`
- Updated `ROADMAP.md` (if phase complete)

**Activities:**
1. Compare PLAN.md tasks to actual execution
2. Document what was built (files, lines)
3. Record acceptance criteria results (PASS/FAIL)
4. Note any deviations and why
5. Update STATE.md:
   - Loop position
   - Progress percentages
   - Session continuity
6. Update ROADMAP.md if phase is complete

**Entry Condition:**
- APPLY phase complete (all tasks done or documented blockers)

**Exit Condition:**
- SUMMARY.md created with results
- STATE.md updated with new position
- Loop closed, ready for next PLAN

**Loop Position:**
```
PLAN ──▶ APPLY ──▶ UNIFY
  ✓        ✓        ✓     [Loop complete, ready for next PLAN]
```

## Loop Invariants

**Never Skip PLAN:**
```
# BAD
"Let me just quickly implement this without a plan"

# GOOD
"Let me create a PLAN.md first, even for small work"
```
Why: No plan = no acceptance criteria = no way to verify completion.

**Never Execute Without Approval:**
```
# BAD
"I've written the plan, now executing..."

# GOOD
"Plan created. Ready to execute when you approve."
```
Why: Plans may have incorrect assumptions. Approval catches issues early.

**Always Close With UNIFY:**
```
# BAD
"Tasks done. Moving to next phase."

# GOOD
"Tasks done. Creating SUMMARY.md and updating STATE.md."
```
Why: No UNIFY = no record of what was built = lost traceability.

## Phase Transitions

### PLAN → APPLY
Trigger: User approves plan (explicit signal)

Validation:
- [ ] PLAN.md has all required sections
- [ ] Acceptance criteria are testable
- [ ] Tasks have Files, Action, Verify, Done
- [ ] Boundaries are clear

### APPLY → UNIFY
Trigger: All tasks complete OR blockers documented

Validation:
- [ ] Each task verification passed (or blocker recorded)
- [ ] No skipped tasks
- [ ] Deviations noted

### UNIFY → PLAN (next)
Trigger: SUMMARY.md created, STATE.md updated

Validation:
- [ ] SUMMARY.md has AC results
- [ ] STATE.md reflects new position
- [ ] ROADMAP.md updated if phase complete

## Visual Loop Position Format

STATE.md displays loop position visually:

```markdown
## Loop Position

Current loop state:
```
PLAN ──▶ APPLY ──▶ UNIFY
  ✓        ○        ○     [Description of current state]
```
```

Symbols:
- `✓` = Phase complete
- `○` = Phase pending
- `►` = Currently in this phase (optional)

## Anti-Patterns

**Partial loops:**
```
PLAN → APPLY → (skip UNIFY) → PLAN
```
Why bad: No record of what was built. Can't track progress.

**Implicit approval:**
```
"I assume the plan is approved and will proceed"
```
Why bad: May execute on flawed assumptions. Always wait for explicit approval.

**UNIFY debt:**
```
"I'll write the SUMMARY later"
```
Why bad: Context degrades. Write SUMMARY immediately after APPLY.

</loop_phases>
