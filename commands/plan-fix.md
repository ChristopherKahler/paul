---
name: plan-fix
description: Plan fixes for UAT issues from verify
argument-hint: "<plan, e.g., '04-02'>"
allowed-tools: [Read, Bash, Write, Glob, Grep, AskUserQuestion]
---

<objective>
Create FIX.md plan from UAT issues found during verify.

**When to use:** After `/paul:verify` logs issues to phase-scoped UAT file.

**Output:** `{plan}-FIX.md` in the phase directory, ready for execution.
</objective>

<execution_context>
@${CLAUDE_PLUGIN_ROOT}/paul-framework/references/plan-format.md
@${CLAUDE_PLUGIN_ROOT}/paul-framework/references/checkpoints.md
</execution_context>

<context>
Plan number: $ARGUMENTS (required - e.g., "04-02" or "10-01")

@.paul/STATE.md
@.paul/ROADMAP.md
</context>

<process>

<step name="parse">
**Parse plan argument:**

$ARGUMENTS should be a plan number like "04-02" or "10-01".
Extract phase number (XX) and plan number (NN).

If no argument provided:
```
Error: Plan number required.

Usage: /paul:plan-fix 04-02

This creates a fix plan from .paul/phases/XX-name/{plan}-UAT.md
```
Exit.
</step>

<step name="find">
**Find UAT.md file:**

Search for matching UAT file:
```bash
ls .paul/phases/*/{plan}-UAT.md 2>/dev/null
```

If not found:
```
No UAT.md found for plan {plan}.

UAT.md files are created by /paul:verify when testing finds issues.
If no issues were found during testing, no fix plan is needed.
```
Exit.
</step>

<step name="read">
**Read issues:**

Read the UAT.md file.
Parse each issue:
- ID (UAT-NNN)
- Title
- Severity (Blocker/Major/Minor/Cosmetic)
- Description/steps to reproduce
- AC reference

Count total issues by severity.
</step>

<step name="plan">
**Create fix tasks:**

For each issue (or logical group):
- Create one task per issue OR
- Group related minor issues into single task

Task structure:
```xml
<task type="auto">
  <name>Fix UAT-001: [issue title]</name>
  <files>[affected files from issue]</files>
  <action>
[What to fix based on issue description]
[Reference original acceptance criteria]
  </action>
  <verify>[Test that issue is resolved]</verify>
  <done>[Issue acceptance criteria met]</done>
</task>
```

Prioritize: Blocker → Major → Minor → Cosmetic
</step>

<step name="write">
**Write FIX.md:**

Create `.paul/phases/XX-name/{plan}-FIX.md`:

```markdown
---
phase: XX-name
plan: {plan}-FIX
type: fix
wave: 1
depends_on: []
files_modified: [files from issues]
autonomous: true
---

<objective>
## Goal
Fix {N} UAT issues from plan {plan}.

## Purpose
Address issues discovered during user acceptance testing.

## Output
All issues resolved, ready for re-verification.

Source: {plan}-UAT.md
Priority: {blocker count} blocker, {major count} major, {minor count} minor, {cosmetic count} cosmetic
</objective>

<context>
@.paul/STATE.md
@.paul/ROADMAP.md

**Issues being fixed:**
@.paul/phases/XX-name/{plan}-UAT.md

**Original plan for reference:**
@.paul/phases/XX-name/{plan}-PLAN.md
</context>

<acceptance_criteria>
[Generate AC from issues - each issue becomes an AC]
</acceptance_criteria>

<tasks>
[Generated fix tasks]
</tasks>

<boundaries>
## DO NOT CHANGE
- Files not related to the issues
- Core functionality that passed testing

## SCOPE LIMITS
- Only fix issues from {plan}-UAT.md
- No scope creep or additional improvements
</boundaries>

<verification>
Before declaring plan complete:
- [ ] All blocker issues fixed
- [ ] All major issues fixed
- [ ] Minor/cosmetic issues fixed or documented as deferred
- [ ] Original acceptance criteria from issues met
</verification>

<success_criteria>
- All UAT issues from {plan}-UAT.md addressed
- Ready for re-verification with /paul:verify
</success_criteria>

<output>
After completion, create `.paul/phases/XX-name/{plan}-FIX-SUMMARY.md`
</output>
```
</step>

<step name="offer">
**Offer execution:**

```
════════════════════════════════════════
FIX PLAN CREATED
════════════════════════════════════════

{plan}-FIX.md — {N} issues to fix

| Severity | Count |
|----------|-------|
| Blocker  | {n}   |
| Major    | {n}   |
| Minor    | {n}   |
| Cosmetic | {n}   |

────────────────────────────────────────
Continue to APPLY?

[1] Approved, run APPLY | [2] Review first | [3] Pause here
────────────────────────────────────────
```

Use AskUserQuestion to get response.
If approved: `/paul:apply .paul/phases/XX-name/{plan}-FIX.md`
</step>

</process>

<success_criteria>
- [ ] UAT.md found and parsed
- [ ] Fix tasks created for each issue (or grouped)
- [ ] FIX.md written with proper PAUL structure
- [ ] User offered to execute or review
</success_criteria>
