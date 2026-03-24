<purpose>
Guide manual user acceptance testing of recently built features. Extract deliverables from SUMMARY.md, generate test checklist, guide user through each test, log issues to phase-scoped file.

The USER performs all testing — Claude generates the checklist, guides the process, and captures issues.
</purpose>

<template>
@src/templates/UAT-ISSUES.md
</template>

<process>

<step name="identify">
**Determine what to test:**

If $ARGUMENTS provided:
- Parse as phase number (e.g., "4") or plan number (e.g., "04-02")
- Find corresponding SUMMARY.md file(s)

If no arguments:
- Find most recently modified SUMMARY.md

```bash
find .paul/phases -name "*SUMMARY.md" -type f -exec ls -lt {} + | head -5
```

Read the SUMMARY.md to understand what was built.

Key extraction points:
- Acceptance Criteria results
- Files created/modified
- Deviations (if any)
</step>

<step name="extract">
**Extract testable deliverables from SUMMARY.md:**

Parse for:
1. **Acceptance Criteria** - Each AC becomes a test item
2. **Files Created/Modified** - What changed
3. **User-facing changes** - UI, workflows, interactions

Focus on USER-OBSERVABLE outcomes, not implementation details.

Map AC to tests:
- AC-1: "Feature X exists" → User can see/use Feature X
- AC-2: "Behavior Y works" → User can trigger and verify Behavior Y
</step>

<step name="generate">
**Generate manual test checklist:**

Create structured test plan:

```
# User Acceptance Test: [Plan Name]

**Scope:** [What was built - from SUMMARY.md]
**Source:** [path to SUMMARY.md]
**Testing:** Manual user validation

## Pre-flight
- [ ] Application builds and runs without errors
- [ ] Application launches to expected state

## Acceptance Criteria Tests

### AC-1: [Criteria from plan]
**What to test:** [User-observable behavior]
**Steps:**
1. [Specific action to take]
2. [What to look for]
3. [Expected result]

### AC-2: [Criteria from plan]
...

## Edge Cases
- [ ] [Relevant edge case based on feature]
- [ ] [Another edge case]

## Visual/UX Check
- [ ] UI matches expected design
- [ ] No visual glitches or layout issues
```

Present this checklist to user.
</step>

<step name="guide">
**Guide user through each test:**

For each test item, use AskUserQuestion:
- header: "[AC-N or Feature name]"
- question: "[Test description] - Did this work as expected?"
- options:
  - "Pass" — Works correctly
  - "Fail" — Doesn't work as expected
  - "Partial" — Works but with issues
  - "Skip" — Can't test right now

**If Pass:** Move to next test

**If Fail or Partial:**
Follow up with AskUserQuestion:
- header: "Issue details"
- question: "What went wrong?"
- options:
  - "Crashes/errors" — Application error or exception
  - "Wrong behavior" — Does something unexpected
  - "Missing feature" — Expected functionality not present
  - "UI/visual issue" — Looks wrong but functions
  - "Let me describe" — Free-form description needed
</step>

<step name="collect">
**Collect and categorize issues:**

For each failed/partial test, gather:
- Feature/AC affected
- What went wrong (from user input)
- Severity:
  - **Blocker** — Can't use the feature at all
  - **Major** — Feature works but significant problem
  - **Minor** — Small issue, feature still usable
  - **Cosmetic** — Visual only, no functional impact
</step>

<step name="log">
**Log issues to phase-scoped file:**

If any issues found:

1. Create `.paul/phases/XX-name/{phase}-{plan}-UAT.md` if doesn't exist
2. Use template from `@src/templates/UAT-ISSUES.md`
3. Add each issue with UAT-NNN format:

```markdown
### UAT-001: [Brief description]

**Discovered:** [date] during user acceptance testing
**Phase/Plan:** [phase]-[plan] that was tested
**Severity:** [Blocker/Major/Minor/Cosmetic]
**AC:** [Which acceptance criteria this relates to]
**Description:** [User's description of the problem]
**Expected:** [What should have happened]
**Actual:** [What actually happened]
```

**Note:** Issues go to phase-scoped UAT file, NOT global `.paul/ISSUES.md`.
</step>

<step name="summarize">
**Present test summary:**

```
# Test Results: [Plan Name]

**Tests run:** [N]
**Passed:** [N]
**Failed:** [N]
**Partial:** [N]
**Skipped:** [N]

## Issues Found
[List any issues with severity]

## Verdict
[Based on results:]
- ALL PASS: "All tests passed. Feature validated."
- MINOR ISSUES: "Feature works with minor issues logged."
- MAJOR ISSUES: "Significant issues found - review before proceeding."
- BLOCKERS: "Blocking issues found - must fix before continuing."

## Next Steps
[Based on verdict:]
- If clean: Suggest proceeding to next phase/plan
- If issues: Suggest creating FIX plan to address
```
</step>

<step name="offer">
**Offer next actions based on results:**

Use AskUserQuestion:
- header: "Next"
- question: "What would you like to do?"
- options (based on results):

If all passed:
- "Continue" — Proceed with confidence
- "Test more" — Run additional manual tests
- "Done" — Finish testing session

If issues found:

**Diagnostic classification — classify before fixing, instead of jumping to code patches, because fixing the wrong layer wastes loops and produces fragile patches:**

Use AskUserQuestion:
- header: "Classify Issues"
- question: "Before planning fixes, what went wrong?"
- options:
  - "Intent issue" — The feature needs to work differently than planned
  - "Spec issue" — The plan missed a requirement or got something wrong
  - "Code issue" — The plan was right, the code doesn't match
  - "Log and continue" — Issues logged, proceed without fixing now
  - "Review issues" — Look at logged issues in detail

**Routing per classification:**

**Intent (1):** "Let's re-plan with updated intent."
- Route to `/paul:plan` for affected phase with updated intent
- Previous plan's issues inform the re-plan
- Do NOT create a fix plan — the spec itself needs rethinking

**Spec (2):** "The plan needs updating before we fix code."
- Route to `/paul:plan-fix` with spec-level scope
- Identify which ACs or tasks need revision
- Update the plan FIRST, then generate code fixes from the corrected spec
- This prevents patching code against a wrong spec

**Code (3):** "Standard fix — plan was right, code needs patching."
- Route to `/paul:plan-fix` with code-level scope (existing behavior)
- Generate targeted fix plan from UAT issues

**Log and continue (4):** Issues logged, proceed anyway (existing behavior)

**Review issues (5):** Show logged issues in detail (existing behavior)
</step>

</process>

<success_criteria>
- [ ] Test scope identified from SUMMARY.md
- [ ] Checklist generated based on acceptance criteria
- [ ] User guided through each test via AskUserQuestion
- [ ] All test results captured (pass/fail/partial/skip)
- [ ] Any issues logged to phase-scoped UAT file
- [ ] Summary presented with verdict
- [ ] User knows next steps based on results
</success_criteria>
