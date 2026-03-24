<purpose>
Execute an approved PLAN.md by running tasks in order with Execute/Qualify verification per task, structured escalation statuses, and diagnostic failure routing at checkpoints. Records results for UNIFY phase reconciliation.
</purpose>

<when_to_use>
- User has approved a PLAN.md (explicit approval required)
- STATE.md shows loop position at PLAN complete, ready for APPLY
- No unresolved blockers from planning phase
</when_to_use>

<loop_context>
Expected phase: APPLY
Prior phase: PLAN (approval just received)
Next phase: UNIFY (after execution completes)
</loop_context>

<required_reading>
@.paul/STATE.md
@.paul/phases/{phase}/{plan}-PLAN.md
</required_reading>

<references>
@~/.claude/paul-framework/references/checkpoints.md (if plan has checkpoints)
@~/.claude/paul-framework/references/loop-phases.md
@~/.claude/paul-framework/references/quality-principles.md
</references>

<process>

<step name="validate_approval" priority="first">
1. Confirm user has explicitly approved the plan
   - Do NOT assume approval — instead, look for an explicit signal ("approved", "execute", "go ahead"), because executing on assumed approval may implement against flawed assumptions that approval review would have caught
   - If approval unclear: Ask "Plan ready at [path]. Approve execution?" and wait
2. Read STATE.md to verify:
   - Loop position shows PLAN complete
   - Correct phase and plan identified
</step>

<step name="load_plan">
1. Read the PLAN.md file
2. Parse frontmatter:
   - autonomous: determines checkpoint handling
   - files_modified: track what we'll change
   - depends_on: verify dependencies met
3. Extract tasks from <tasks> section
4. Note boundaries from <boundaries> section
5. Load acceptance criteria for qualification reference
</step>

<step name="verify_required_skills" priority="blocking">
**BLOCKING CHECK: Required skills must be loaded before execution.**

1. Check if PLAN.md has a <skills> section
2. If no <skills> section: proceed (no skill requirements)
3. If <skills> section exists:
   a. For each skill marked "required":
      - Check if skill has been invoked in current session
      - If not invoked: add to missing_skills list
   b. If missing_skills is not empty:
      - **BLOCK execution**
      - Display:
        ```
        ════════════════════════════════════════
        ⛔ BLOCKED: Required skills not loaded
        ════════════════════════════════════════

        This plan requires the following skills:

        Missing:
        - /skill-name → Run: /skill-name
        - /skill-name → Run: /skill-name

        Load these skills now, then type "ready" to continue.
        Or type "override" to proceed without (not recommended).
        ════════════════════════════════════════
        ```
      - Wait for user input
      - If "ready": re-check skills, proceed if all loaded
      - If "override":
        - Log deviation to STATE.md Decisions: "Override: Proceeded without required skills [list]"
        - Proceed with warning
   c. If all required skills loaded:
      - Display: "All required skills loaded"
      - Proceed to execute_tasks

**This check runs BEFORE any task execution, ensuring skills are in place.**
</step>

<step name="execute_tasks">
**For each <task> in order, follow the Execute/Qualify (E/Q) loop:**

---

**AUTO TASKS — E/Q Loop:**

**1. EXECUTE**
- Log task start: "Task N: [name]"
- Execute <action> content:
  - Create/modify files specified in <files>
  - Follow specific instructions
  - Respect boundaries — instead of rationalizing "just this once" modifications to protected files, because boundary violations cascade into untraceable changes that break future plans

**2. REPORT STATUS**
Before any verification, honestly report one of:

| Status | When to Use | What Happens Next |
|---|---|---|
| **DONE** | Task completed, no concerns | Standard qualify check |
| **DONE_WITH_CONCERNS** | Completed, but you have doubts about correctness, approach, or completeness | Qualify focuses on flagged concerns first, then full check |
| **NEEDS_CONTEXT** | Can't complete — missing information not in the plan or accessible files | Pause. Surface exactly what's missing. Wait for user |
| **BLOCKED** | Can't complete — structural impediment (permissions, missing dependency, broken environment) | Stop. Report what was attempted, what blocks, what help is needed |

**Rules:**
- NEVER silently produce work you're unsure about — instead report DONE_WITH_CONCERNS with specific doubts, because pretending confidence when uncertain produces work that fails during verification or, worse, in production
- NEEDS_CONTEXT is not failure — it's honest communication that prevents wasted work on wrong assumptions
- BLOCKED must include specifics (what was attempted, what blocks, what help is needed) — instead of a vague "I'm stuck", because specificity enables the user to unblock you efficiently

**3. QUALIFY (runs for DONE and DONE_WITH_CONCERNS only)**

⚠️ **The qualify step exists because your report of your own work is inherently optimistic. Trust the output, not your memory of producing it.**

   a. **Re-read actual output** — instead of trusting what you remember writing, because execution memory is optimistic and may omit details you glossed over
      - Open and read files you just created or modified
      - Check actual state of what was produced

   b. **Run <verify> command fresh** — instead of recalling prior results, because stale verification is not verification
      - Execute the full verify command
      - Read complete output
      - Check exit code

   c. **Compare against spec AND linked AC**
      - Re-read the task's <action> spec line by line
      - Re-read the linked AC (Given/When/Then)
      - Check: does the actual output satisfy BOTH?

   d. **Score the result:**
      - **PASS** — output matches spec and AC. Move to next task.
      - **GAP** — something in the spec or AC is missing from the output
      - **DRIFT** — output does something different than what was specified

   e. **If GAP or DRIFT:**
      - Examine: What specifically doesn't match? Be concrete.
      - Fix the gap
      - Re-qualify (go back to step 3a)
      - Loop max 3 times. If still not PASS after 3 attempts, escalate to user:
        ```
        ════════════════════════════════════════
        QUALIFY: Cannot resolve after 3 attempts
        ════════════════════════════════════════

        Task: [name]
        Issue: [what doesn't match]
        Attempts: 3
        Last result: [GAP/DRIFT — specifics]

        [1] Provide guidance | [2] Skip task (deviation) | [3] Stop execution
        ════════════════════════════════════════
        ```

   f. **If DONE_WITH_CONCERNS:** Qualify focuses on the flagged concerns FIRST. If concerns are validated (real issues), fix before full check. If concerns are unfounded (output is actually correct), note and proceed.

**Before claiming any task is complete, check yourself:**

| If you're thinking... | STOP. Instead... | Because... |
|---|---|---|
| "Should work now" | Run the verify command and read its output | Confidence is not evidence — you must see proof before claiming success |
| "I already checked this" | Check it again, fresh | Memory of checking is not the same as verification — re-read the actual files |
| "It's close enough" | Compare against the AC word by word | "Close" fails acceptance criteria — partial match is a GAP, not a PASS |
| "The test passes" | Also compare against the spec | Tests verify what was tested, not what was specified — they can be incomplete |
| "This is a minor deviation" | Log it explicitly | Minor deviations compound into drift — UNIFY needs accurate records to reconcile |
| "I'm confident it works" | Run it and prove it | Confidence without evidence is the #1 cause of false completion claims |

**4. HANDLE NEEDS_CONTEXT**
- Present what's missing clearly and specifically
- Ask user for the missing information
- When provided, re-execute the task from step 1
- Do NOT guess or fill in gaps with assumptions — instead ask, because wrong assumptions produce work that needs to be thrown away

**5. HANDLE BLOCKED**
- Present clearly: what was attempted, what's blocking, what kind of help is needed
- Offer options:
  ```
  [1] Provide missing context/access
  [2] Skip task (creates deviation)
  [3] Stop execution
  ```
- Wait for user response
- If skip: record as deviation for UNIFY

---

**CHECKPOINT TASKS:**

**If type="checkpoint:human-verify":**
1. Stop execution
2. Present checkpoint clearly:
   ```
   ════════════════════════════════════════
   CHECKPOINT: Human Verification
   ════════════════════════════════════════

   Task [N] of [Total]: [name]

   What was built:
   [what-built content]

   How to verify:
   [how-to-verify content]

   [resume-signal content]
   ════════════════════════════════════════
   ```
3. Wait for user response
4. **On "approved":** continue to next task
5. **On issues reported — DIAGNOSTIC CLASSIFICATION:**

   Do NOT immediately attempt to fix. First, classify the root cause — instead of patching blindly, because the wrong fix layer wastes loops and produces fragile patches:

   ```
   ════════════════════════════════════════
   CHECKPOINT: Issue Detected
   ════════════════════════════════════════

   Before fixing, let's classify the root cause:

   [1] Intent issue — I need to build something different than what was planned
   [2] Spec issue — The plan was missing something or got it wrong
   [3] Code issue — The plan was right, the implementation doesn't match

   This determines how we fix it.
   ════════════════════════════════════════
   ```

   Wait for user selection.

   **Intent (1):** "Let's re-plan this phase with updated intent."
   - Archive current plan: rename with `_superseded` suffix
   - Route to `/paul:plan` for same phase with updated intent
   - Do NOT patch — the spec itself was wrong

   **Spec (2):** "The plan needs updating before we patch code."
   - Identify which ACs or tasks need revision
   - Present the spec-level changes needed
   - Generate targeted fix plan that updates ACs/tasks FIRST, then fixes code
   - This is different from just patching — the plan was wrong, not just the code

   **Code (3):** Standard fix-in-place (existing behavior)
   - The plan was correct, implementation needs fixing
   - Address issues, re-verify
   - Continue execution after fix confirmed

**If type="checkpoint:decision":**
1. Stop execution
2. Present decision with options:
   ```
   ════════════════════════════════════════
   CHECKPOINT: Decision Required
   ════════════════════════════════════════

   Decision: [decision content]
   Context: [context content]

   Options:
   [option-a]: [name] - Pros: [pros] / Cons: [cons]
   [option-b]: [name] - Pros: [pros] / Cons: [cons]

   [resume-signal content]
   ════════════════════════════════════════
   ```
3. Wait for user selection
4. **Record decision to STATE.md:**
   - Open `.paul/STATE.md`
   - Find `### Decisions` under `## Accumulated Context`
   - Add row: `| [date]: [Decision summary] | Phase [N] | [Impact on work] |`
5. Continue with chosen direction

**If type="checkpoint:human-action":**
1. Stop execution
2. Present required action:
   ```
   ════════════════════════════════════════
   CHECKPOINT: Human Action Required
   ════════════════════════════════════════

   Action: [action content]

   Instructions:
   [instructions content]

   After completion, I will verify:
   [verification content]

   [resume-signal content]
   ════════════════════════════════════════
   ```
3. Wait for user confirmation
4. Run verification check
5. Continue if verified, report if failed
</step>

<step name="track_progress">
Throughout execution:

1. Maintain log of:
   - Tasks completed (with status and qualify results)
   - Tasks failed (with reasons and diagnostic classification)
   - Checkpoints resolved (with decisions/approvals)
   - Deviations from plan
   - Concerns flagged via DONE_WITH_CONCERNS (even if resolved)
2. This information feeds into UNIFY phase
</step>

<step name="finalize">
After all tasks attempted:

1. Summarize execution:
   - Tasks completed: N of M
   - Qualify results: PASS/GAP/DRIFT counts
   - Escalation statuses used: list any non-DONE statuses
   - Failures: list any
   - Deviations: list any
2. Update STATE.md:
   - Loop position: PLAN → APPLY → UNIFY
   - Last activity: timestamp and completion status
3. Report with quick continuation prompt:
   ```
   ════════════════════════════════════════
   APPLY COMPLETE
   ════════════════════════════════════════
   [execution summary]

   ---
   Continue to UNIFY?

   [1] Yes, run UNIFY | [2] Pause here
   ```
4. **Accept quick inputs:** "1", "yes", "continue", "go" → run `/paul:unify [plan-path]`
</step>

</process>

<output>
- Modified files as specified in PLAN.md
- Execution log (for UNIFY): task statuses, qualify results, deviations
- STATE.md updated with APPLY complete
</output>

<error_handling>
**Plan not found:**
- Check STATE.md for correct path
- Ask user to confirm plan location

**Boundary violation attempted:**
- Stop immediately — instead of rationalizing the change, because boundary violations create untraceable modifications that break the audit trail
- Report which boundary would be violated
- Do not modify protected files

**Verification command fails:**
- Report the failure with specific output
- Offer retry/skip/stop options
- Do not mark task as complete — instead of "it probably works", because a failed verify is evidence of a problem, not an inconvenience to ignore

**Checkpoint timeout:**
- Remind user checkpoint is waiting
- Do not proceed without response — instead of assuming approval, because unverified work compounds into technical debt
- Offer to save state and continue later
</error_handling>

<anti_patterns>
**Assuming approval:**
Do NOT start APPLY without explicit user approval — instead wait for clear signal, because plans may contain incorrect assumptions that the approval step would catch.

**Skipping verification:**
NEVER skip the verify step — instead run the command and read its output before claiming completion, because "it looks right" is not evidence of correctness.

**Skipping qualify after verify:**
NEVER stop at "verify passed" — instead also compare against the spec and linked AC, because verify commands test what they test, not what was specified. Qualify catches the gap between "tests pass" and "spec satisfied."

**Trusting your own execution report:**
NEVER claim completion based on memory of what you built — instead re-read the actual files and compare to spec, because execution memory is optimistic and omits details.

**Ignoring boundaries:**
If a task would modify a protected file, STOP — instead of rationalizing "it's a small change", because boundary violations cascade into untraceable changes.

**Proceeding past checkpoints:**
Checkpoints are blocking. Do not continue without user response — instead of "I'll note the checkpoint and move on", because unverified work at checkpoints accumulates into larger failures.

**Patching without diagnosing:**
When a checkpoint fails, NEVER start patching immediately — instead classify the failure (intent/spec/code) first, because patching code when the spec is wrong produces fragile fixes that break again.

**Swallowing concerns:**
NEVER report DONE when you have doubts — instead report DONE_WITH_CONCERNS with specific flags, because silently uncertain work produces false completion that fails during verification or in production.
</anti_patterns>
