---
name: consider-issues
description: Review deferred issues with codebase context, triage and route
allowed-tools: [Read, Bash, Grep, Glob, Edit, AskUserQuestion]
---

<objective>
Review all open issues from ISSUES.md and phase-scoped UAT files with current codebase context. Identify resolved, urgent, and waiting issues. Prevents issue pile-up.

**When to use:** Periodically or before milestone completion.
</objective>

<execution_context>
@${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/consider-issues.md
</execution_context>

<context>
@.paul/ISSUES.md (if exists)
@.paul/STATE.md
@.paul/ROADMAP.md
</context>

<process>
**Follow workflow: @${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/consider-issues.md**

The workflow implements:
1. Find all issue files (ISSUES.md, phase-scoped UAT files)
2. Parse open issues (ISS-NNN, UAT-NNN format)
3. Analyze each against codebase (resolved? urgent? natural-fit?)
4. Present categorized report
5. Offer actions (close resolved, insert urgent, note for planning)
6. Update files as needed
</process>

<success_criteria>
- [ ] All open issues analyzed against current codebase
- [ ] Each issue categorized (resolved/urgent/natural-fit/can-wait)
- [ ] Clear reasoning provided for each categorization
- [ ] Actions offered based on findings
- [ ] Files updated if user takes action
</success_criteria>
