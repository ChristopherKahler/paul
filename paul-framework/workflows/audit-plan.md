<purpose>
Perform an enterprise-grade architectural audit on an approved PLAN.md. Assume the role of a senior principal engineer + compliance reviewer. Identify gaps, classify findings by severity, auto-apply must-have and strongly-recommended fixes to the plan, and produce a persistent audit report.
</purpose>

<when_to_use>
- After PLAN phase when `enterprise_plan_audit: enabled: true` in config.md
- When `/paul:audit` is explicitly invoked by the user
- Before APPLY phase to strengthen plan quality for commercial/enterprise software
</when_to_use>

<loop_context>
Expected phase: Between PLAN and APPLY (sub-step of PLAN)
Prior phase: PLAN (plan created, awaiting approval)
Next phase: APPLY (after audit and approval)
</loop_context>

<required_reading>
@.paul/STATE.md
@.paul/config.md
@.paul/phases/{phase}/{plan}-PLAN.md
</required_reading>

<process>

<step name="validate_preconditions" priority="first">
1. Read STATE.md to confirm:
   - Loop position shows PLAN complete (checkmark on PLAN)
   - A plan path exists (from $ARGUMENTS or infer from STATE.md "Resume file" field)
2. If no plan found:
   - Error: "No plan found to audit. Run /paul:plan first."
   - Exit workflow
3. If loop is not at PLAN complete:
   - Warn: "Loop not at PLAN stage. Current state: [state]"
   - Exit workflow
4. Read config.md and check for `enterprise_plan_audit: enabled: true`
   - If enabled: proceed normally
   - If not enabled or config missing: display warning but allow manual invocation:
     ```
     Enterprise plan audit is not enabled in config.
     Running audit manually. To auto-suggest after /paul:plan, add to config.md:

     enterprise_plan_audit:
       enabled: true
     ```
   - Proceed regardless (manual invocation is always allowed)
</step>

<step name="load_plan">
1. Read the PLAN.md file at the resolved path
2. Derive paths:
   - Phase directory: parent directory of PLAN.md
   - Audit report path: replace `-PLAN.md` with `-AUDIT.md` in filename
     Example: `20-01-PLAN.md` → `20-01-AUDIT.md`
3. Parse plan structure:
   - Extract objective, acceptance criteria, tasks, boundaries, verification
   - Note task count, checkpoint types, files modified
   - Identify the plan's scope and architectural decisions
4. Store full plan content for audit analysis
</step>

<step name="execute_audit" priority="critical">
**Assume the following role and perform this audit against the loaded PLAN.md content.**

You are acting as a **senior principal engineer + compliance reviewer** responsible for approving whether this architectural plan is **enterprise-grade, audit-defensible, and production-safe**.

Perform a **hard, honest audit** of the plan.
Do **not** validate or encourage.
Assume this system will be:

* Used in a regulated environment
* Reviewed by auditors (SOC 2 / ISO / legal)
* Operated by humans who make mistakes
* Maintained for multiple years

**Tone requirements:**

* Direct, critical, and specific
* No praise unless it directly supports a risk decision
* Call out missing controls, underspecified behavior, and latent risk
* Do NOT optimize for politeness

---

Produce the following structured output internally (this feeds into the next steps):

**1. Executive Verdict**
Answer clearly:
* Is this plan **enterprise-ready**, **conditionally acceptable**, or **not acceptable**?
* Would you approve this plan for production if you were accountable?

**2. What Is Solid (Do Not Change)**
Identify only elements that are:
* Correctly layered
* Appropriately constrained
* Aligned with enterprise expectations
Be specific about *why* they are solid.

**3. Enterprise Gaps / Latent Risks**
Identify **non-obvious risks**, including but not limited to:
* Missing authorization boundaries
* State ambiguity or invalid transitions
* Audit trail weaknesses
* Idempotency gaps
* Error handling omissions
* Side-effect risks (email, payments, AI calls, external APIs)
* Long-term maintenance hazards
Treat anything underspecified as a risk.

**4. Concrete Upgrades Required**
For each major gap:
* Explain **why it matters**
* Specify **what must be added or changed**
* Classify it as:
  * **Must-have** (release-blocking)
  * **Strongly recommended**
  * **Can safely defer**
Avoid abstract advice — give implementation-level guidance.

**5. Audit & Compliance Readiness**
Evaluate whether the plan:
* Produces defensible audit evidence
* Prevents silent failures
* Supports post-incident reconstruction
* Has clear ownership and accountability
Call out any area that would fail a real audit.

**6. Final Release Bar**
State explicitly:
* What must be true before this plan ships
* What risks remain if shipped as-is
* Whether you would sign your name to this system

**Important Constraints:**
* Do NOT invent requirements not implied by the plan
* Do NOT assume "future phases" will fix gaps
* Do NOT say "this is fine for v1" unless justified
* Treat this as the *last review before production*
</step>

<step name="classify_findings">
From the audit output, categorize all findings:

**Must-Have (Release-Blocking):**
- List each finding with: description, affected plan section, required change
- These WILL be applied to the plan automatically

**Strongly Recommended:**
- List each finding with: description, affected plan section, required change
- These WILL be applied to the plan automatically

**Can Safely Defer:**
- List each finding with: description, rationale for deferral
- These will NOT be applied but will be noted in the audit report

Count totals: N must-have, M strongly-recommended, P can-safely-defer
</step>

<step name="apply_findings_to_plan" priority="critical">
**Automatically apply must-have and strongly-recommended findings to the PLAN.md.**

For each finding that requires plan modification:

1. **Acceptance Criteria gaps:** Add new Given/When/Then criteria or strengthen existing ones
2. **Task gaps:** Add new tasks, add verification steps, or strengthen action descriptions
3. **Boundary gaps:** Add new boundary constraints to the `<boundaries>` section
4. **Verification gaps:** Add new checks to the `<verification>` section
5. **Authorization/security gaps:** Add constraints, validation steps, or audit trail requirements to relevant tasks
6. **Error handling gaps:** Add error scenarios to acceptance criteria and recovery steps to tasks

**Rules for applying findings:**
- Preserve the existing plan structure and formatting
- Add new content clearly (do not silently rewrite existing content)
- Mark audit-added content with `<!-- audit-added -->` comment where practical
- If a finding requires a new task, add it in the appropriate sequence position
- If a finding strengthens an existing task, append to its `<action>` or `<verify>` section
- Update `files_modified` in frontmatter if new files are introduced
- Update `autonomous` flag if new checkpoints are required

Track all changes made for the audit report:
- Section modified
- What was added/changed
- Which finding it addresses
</step>

<step name="create_audit_report">
Write the audit report to `{NN}-{PP}-AUDIT.md` in the same phase directory as the PLAN.

**Report structure:**

```markdown
# Enterprise Plan Audit Report

**Plan:** [plan-path]
**Audited:** [timestamp]
**Verdict:** [enterprise-ready / conditionally acceptable / not acceptable]

---

## 1. Executive Verdict

[From audit step - clear yes/no/conditional with reasoning]

## 2. What Is Solid

[From audit step - elements that should not change and why]

## 3. Enterprise Gaps Identified

[From audit step - full list of non-obvious risks found]

## 4. Upgrades Applied to Plan

### Must-Have (Release-Blocking)

| # | Finding | Plan Section Modified | Change Applied |
|---|---------|----------------------|----------------|
| 1 | [description] | [section] | [what was changed] |

### Strongly Recommended

| # | Finding | Plan Section Modified | Change Applied |
|---|---------|----------------------|----------------|
| 1 | [description] | [section] | [what was changed] |

### Deferred (Can Safely Defer)

| # | Finding | Rationale for Deferral |
|---|---------|----------------------|
| 1 | [description] | [why safe to defer] |

## 5. Audit & Compliance Readiness

[From audit step - evidence, failure prevention, reconstruction, ownership]

## 6. Final Release Bar

[From audit step - what must be true, remaining risks, sign-off statement]

---

**Summary:** Applied [X] must-have + [Y] strongly-recommended upgrades. Deferred [Z] items.
**Plan status:** [Updated and ready for APPLY / Requires manual review before APPLY]

---
*Audit performed by PAUL Enterprise Audit Workflow*
*Audit template version: 1.0*
```
</step>

<step name="update_state" priority="required">
**This step is REQUIRED. Do not skip.**

1. **Update STATE.md:**
   - Change plan status line from "created, awaiting approval" to "created + audited, awaiting approval"
   - Update Last activity with audit timestamp
   - Add to `### Decisions` section:
     `| [timestamp]: Enterprise audit performed on [plan-path]. Applied [X] must-have, [Y] strongly-recommended upgrades. Deferred [Z]. Verdict: [verdict] | Phase [N] | Plan strengthened for enterprise standards |`

2. **Do NOT change loop position** — PLAN is still checked, APPLY still unchecked.
   The audit is a sub-step of PLAN, not a separate loop position.
</step>

<step name="report_and_route">
Display audit summary with routing:

```
════════════════════════════════════════
AUDIT COMPLETE
════════════════════════════════════════

Verdict: [enterprise-ready / conditionally acceptable / not acceptable]

Applied to plan:
  [X] must-have (release-blocking) upgrades
  [Y] strongly-recommended upgrades
Deferred:
  [Z] can-safely-defer items

Report: [audit-report-path]

---
Continue to APPLY?

[1] Approved, run APPLY | [2] Review audit report | [3] Questions | [4] Pause
```

**Accept quick inputs:**
- "1", "approved", "yes", "go" → run `/paul:apply [plan-path]`
- "2", "review" → Read and display the AUDIT.md report contents

**If verdict is "not acceptable":**
Replace routing with:
```
⚠️  Plan did NOT pass enterprise audit.

The plan requires significant revision before execution.
Review the audit report and address critical findings.

[1] Review audit report | [2] Re-plan this phase | [3] Questions
```
Do NOT offer direct APPLY routing when verdict is "not acceptable".
</step>

</process>

<output>
- Updated PLAN.md with must-have and strongly-recommended fixes applied
- AUDIT.md report at `{phase-dir}/{NN}-{PP}-AUDIT.md`
- STATE.md updated with audit status
</output>

<error_handling>
**Plan not found:**
- Check STATE.md for correct path
- Ask user to confirm plan location or run /paul:plan first

**Config missing enterprise_plan_audit:**
- Warn but proceed (manual invocation is always valid)
- Suggest adding config for automatic suggestion flow

**Plan too vague to audit meaningfully:**
- Note in audit report that plan lacks sufficient detail
- Classify as "not acceptable" with concrete requirements for what must be specified
- Do NOT fabricate an audit of vague content

**Audit produces no findings:**
- This is valid (plan may already be enterprise-grade)
- Report "enterprise-ready" verdict with reasoning
- Proceed to APPLY routing normally
</error_handling>

<anti_patterns>
**Rubber-stamping:**
Do NOT produce a positive audit without substantive analysis. Every plan has areas that can be strengthened.

**Scope creep in fixes:**
Applied fixes should address the specific gap, not redesign the plan. Stay within the plan's existing architecture.

**Inventing phantom requirements:**
Only audit against what the plan implies. Do not introduce requirements from outside the project scope.

**Skipping auto-apply:**
The entire value of this workflow is automated remediation. If findings are identified, they MUST be applied (except can-safely-defer).
</anti_patterns>
