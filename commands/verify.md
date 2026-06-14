---
name: verify
description: Guide manual user acceptance testing of recently built features
argument-hint: "[optional: phase or plan number, e.g., '4' or '04-02']"
allowed-tools: [Read, Bash, Glob, Grep, Edit, Write, AskUserQuestion]
---

<objective>
Guide the user through manual acceptance testing of recently built features.

**When to use:** After completing a plan, validate that what Claude built actually works from the user's perspective.

**Who tests:** The USER performs all testing. Claude generates the test checklist, guides the process, and captures issues.
</objective>

<execution_context>
@${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/verify-work.md
@${CLAUDE_PLUGIN_ROOT}/paul-framework/templates/UAT-ISSUES.md
</execution_context>

<context>
Scope: $ARGUMENTS (optional)
- If provided: Test specific phase or plan (e.g., "4" or "04-02")
- If not provided: Test most recently completed plan

@.paul/STATE.md
@.paul/ROADMAP.md
</context>

<process>
**Follow workflow: @${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/verify-work.md**

The workflow implements:
1. Identify test scope (specified or most recent SUMMARY)
2. Extract testable deliverables from SUMMARY.md
3. Generate test checklist based on acceptance criteria
4. Guide user through each test via AskUserQuestion
5. Collect and categorize any issues found
6. Log issues to phase-scoped UAT file
7. Present summary with verdict
8. Offer next steps based on results
</process>

<success_criteria>
- [ ] Test scope identified from SUMMARY.md
- [ ] Checklist generated based on deliverables
- [ ] User guided through each test
- [ ] All test results captured (pass/fail/partial/skip)
- [ ] Any issues logged to `.paul/phases/XX-name/{plan}-UAT.md`
- [ ] Summary presented with verdict
- [ ] User knows next steps based on results
</success_criteria>

<anti_patterns>
- Don't run automated tests (that's for CI/test suites)
- Don't make assumptions about test results — USER reports outcomes
- Don't skip the guidance — walk through each test
- Don't dismiss minor issues — log everything user reports
- Don't fix issues during testing — capture for later
</anti_patterns>
