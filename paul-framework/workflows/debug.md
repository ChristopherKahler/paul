<purpose>
Systematic debugging with persistent state that survives context resets. The debug file IS the debugging brain - create it immediately and update it continuously.

You are the debugger. The user knows what's wrong (behavior), not why (root cause). Gather symptoms, then investigate autonomously.
</purpose>

<philosophy>
**User = reporter. Claude = investigator.**

The user knows:
- What they expected to happen
- What actually happened
- Any error messages they saw
- When it started / if it ever worked

The user does NOT know (and shouldn't be asked):
- What's causing the bug
- Which file has the problem
- What the fix should be

Ask about experience. Investigate the cause yourself.
</philosophy>

<template>
@src/templates/DEBUG.md
</template>

<process>

<step name="check_active_session">
**First: Check for active debug sessions**

```bash
ls .paul/debug/*.md 2>/dev/null | grep -v resolved
```

**If active sessions exist AND no $ARGUMENTS provided:**

Read each file's frontmatter (status, trigger) and Current Focus (hypothesis, next_action).

Display inline:

```
## Active Debug Sessions

| # | Slug | Status | Hypothesis | Next Action |
|---|------|--------|------------|-------------|
| 1 | auth-logout | investigating | Token refresh not called | Check console output |
| 2 | api-timeout | gathering | - | Gather symptoms |

Reply with a number to resume, or describe a new issue to start fresh.
```

Wait for user response.

- If user replies with number → Load that file, go to `resume_from_file`
- If user replies with text → Treat as new issue trigger, go to `create_debug_file`

**If no active sessions:**

```
No active debug sessions.

Describe the issue to start debugging.
```

Wait for user to describe the issue.
</step>

<step name="create_debug_file">
**Create debug file IMMEDIATELY**

Generate slug from user input (lowercase, hyphens, max 30 chars).

```bash
mkdir -p .paul/debug
```

Create file using DEBUG.md template with initial state:
- status: gathering
- trigger: [verbatim user input]
- Current Focus: next_action = "gather symptoms from user"

Write to `.paul/debug/[slug].md`

Proceed to `symptom_gathering`.
</step>

<step name="symptom_gathering">
**Gather symptoms through questioning - update file after EACH answer**

CRITICAL: Update the debug file after each piece of information gathered.

**1. Expected behavior:**
Use AskUserQuestion: "What should happen?"
After answer → Update Symptoms.expected

**2. Actual behavior:**
Use AskUserQuestion: "What actually happens instead?"
After answer → Update Symptoms.actual

**3. Error messages:**
Use AskUserQuestion: "Any error messages?"
After answer → Update Symptoms.errors

**4. When it started:**
Use AskUserQuestion: "When did this start?"
After answer → Update Symptoms.started

**5. Reproduction:**
Use AskUserQuestion: "How do you trigger this?"
After answer → Update Symptoms.reproduction

**6. Ready check:**
Use AskUserQuestion: "Enough context to investigate?"
- If "Start investigating" → Update status to "investigating", proceed to `investigation_loop`
- If "I have more context" → receive it, update relevant field, ask again
</step>

<step name="investigation_loop">
**Autonomous investigation - update file continuously**

CRITICAL: Before EVERY action, update Current Focus. After EVERY finding, append to Evidence.

**Phase 1: Initial evidence gathering**

Update Current Focus:
```
hypothesis: gathering initial evidence
test: examining error context and relevant code
expecting: clues about failure point
next_action: [specific next action]
```

1. If errors exist in Symptoms → search codebase for error text
2. Identify relevant code area from symptoms
3. Read relevant files COMPLETELY
4. Run app/tests to observe behavior firsthand

After EACH finding → Append to Evidence

**Phase 2: Form hypothesis**

Based on evidence, form SPECIFIC, FALSIFIABLE hypothesis.

Update Current Focus with hypothesis, test, expecting, next_action.

**Phase 3: Test hypothesis**

Execute the test. ONE hypothesis at a time.

Append result to Evidence.

**Phase 4: Evaluate**

If CONFIRMED:
- Update Resolution.root_cause with evidence
- Update status to "fixing"
- Proceed to `fix_and_verify`

If ELIMINATED:
- Append to Eliminated section with evidence
- Form new hypothesis
- Return to Phase 2

**Context management:**

After significant investigation (5+ evidence entries), check if context is filling.
If so, ensure Current Focus is fully updated and suggest:
"Context filling up. Safe to start fresh session - debug file preserves state."
</step>

<step name="resume_from_file">
**Resume investigation from debug file**

Read the full debug file.

Announce:
```
Resuming: [slug]
Status: [status]
Current hypothesis: [from Current Focus]
Evidence gathered: [count]
Eliminated: [count] hypotheses

Continuing from: [next_action]
```

Based on status:
- "gathering" → Continue `symptom_gathering` from where left off
- "investigating" → Continue `investigation_loop` from Current Focus
- "fixing" → Continue `fix_and_verify`
- "verifying" → Continue verification

The file tells you exactly where you were.
</step>

<step name="fix_and_verify">
**Apply fix and verify**

Update status to "fixing".

**1. Implement minimal fix**

Make the SMALLEST change that addresses root cause.

Update Resolution.fix with what was changed and why.
Update Resolution.files_changed with modified files.

**Complex fixes:** If fix requires significant code changes:
- Create a dedicated PLAN.md for the fix
- Reference debug file in plan context
- Debug file stays in "fixing" until plan completes

**2. Verify**

Update status to "verifying".

Test against original Symptoms:
- Does expected behavior now occur?
- Are errors gone?
- Does reproduction no longer trigger issue?

If verification FAILS:
- Append finding to Evidence
- Update status back to "investigating"
- Return to `investigation_loop`

If verification PASSES:
- Update Resolution.verification
- Proceed to `archive_session`
</step>

<step name="archive_session">
**Archive resolved debug session**

Update status to "resolved".

```bash
mkdir -p .paul/debug/resolved
mv .paul/debug/[slug].md .paul/debug/resolved/
```

Commit:
```bash
git add -A
git commit -m "fix: [brief description]

Root cause: [from Resolution.root_cause]
Debug session: .paul/debug/resolved/[slug].md"
```

Report:
```
Debug complete.

Root cause: [root_cause]
Fix: [fix]
Files: [files_changed]

Session archived: .paul/debug/resolved/[slug].md
```
</step>

</process>

<update_rules>
**Section update rules (from template):**

| Section | Rule | When |
|---------|------|------|
| Frontmatter.status | OVERWRITE | Each phase transition |
| Frontmatter.updated | OVERWRITE | Every file update |
| Current Focus | OVERWRITE | Before every action |
| Symptoms | IMMUTABLE | After gathering complete |
| Eliminated | APPEND | When hypothesis disproved |
| Evidence | APPEND | After each finding |
| Resolution | OVERWRITE | As understanding evolves |

**CRITICAL:** Update the file BEFORE taking action, not after.
</update_rules>

<success_criteria>
- [ ] Debug file created IMMEDIATELY on command
- [ ] File updated after EACH piece of information
- [ ] Current Focus always reflects NOW
- [ ] Evidence appended for every finding
- [ ] Eliminated prevents re-investigation
- [ ] Can resume perfectly from any context reset
- [ ] Root cause confirmed with evidence before fixing
- [ ] Fix verified against original symptoms
</success_criteria>
