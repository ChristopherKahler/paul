<checkpoints>

## Purpose

Checkpoints formalize interaction points where human verification or decisions are needed during plan execution. Plans execute autonomously except at checkpoints.

**Core principle:** Claude automates everything with CLI/API. Checkpoints are for verification and decisions, not manual work.

**Golden rule:** If Claude CAN automate it, Claude MUST automate it.

## Checkpoint Types

### checkpoint:human-verify (90% of checkpoints)

**When:** Claude completed automated work, human confirms it works correctly.

**Use for:** Visual UI checks, interactive flows, functional verification, audio/video quality, animation smoothness, accessibility testing.

**Structure:**
```xml
<task type="checkpoint:human-verify" gate="blocking">
  <what-built>[What Claude automated]</what-built>
  <how-to-verify>
    1. [First verification step]
    2. [Second verification step]
    3. [Expected behavior to confirm]
  </how-to-verify>
  <resume-signal>Type "approved" or describe issues</resume-signal>
</task>
```

**Example:**
```xml
<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Responsive dashboard with sidebar navigation</what-built>
  <how-to-verify>
    1. Run: npm run dev
    2. Visit: http://localhost:3000/dashboard
    3. Desktop (>1024px): Sidebar visible on left
    4. Mobile (375px): Sidebar collapses to hamburger menu
    5. Check: No layout shift, smooth transitions
  </how-to-verify>
  <resume-signal>Type "approved" or describe issues</resume-signal>
</task>
```

### checkpoint:decision (9% of checkpoints)

**When:** Human must make choice that affects implementation direction.

**Use for:** Technology selection, architecture decisions, design choices, feature prioritization.

**Structure:**
```xml
<task type="checkpoint:decision" gate="blocking">
  <decision>[What's being decided]</decision>
  <context>[Why this matters]</context>
  <options>
    <option id="option-a">
      <name>[Name]</name>
      <pros>[Benefits]</pros>
      <cons>[Tradeoffs]</cons>
    </option>
    <option id="option-b">
      <name>[Name]</name>
      <pros>[Benefits]</pros>
      <cons>[Tradeoffs]</cons>
    </option>
  </options>
  <resume-signal>Select: option-a or option-b</resume-signal>
</task>
```

**Example:**
```xml
<task type="checkpoint:decision" gate="blocking">
  <decision>Select state management approach</decision>
  <context>Dashboard needs client-side state. Two viable approaches:</context>
  <options>
    <option id="zustand">
      <name>Zustand</name>
      <pros>Lightweight, simple API, no boilerplate</pros>
      <cons>Less structure for large apps</cons>
    </option>
    <option id="context">
      <name>React Context + useReducer</name>
      <pros>No dependencies, built-in</pros>
      <cons>More boilerplate, potential re-render issues</cons>
    </option>
  </options>
  <resume-signal>Select: zustand or context</resume-signal>
</task>
```

### checkpoint:human-action (1% - rare)

**When:** Action has NO CLI/API and requires human-only interaction.

**Use ONLY for:**
- Email verification links
- SMS 2FA codes
- Manual account approvals
- 3D Secure payment flows
- OAuth app approvals

**Do NOT use for:**
- Deployments (use CLI)
- Creating resources (use CLI/API)
- Builds/tests (use Bash)
- File operations (use Write/Edit)

**Structure:**
```xml
<task type="checkpoint:human-action" gate="blocking">
  <action>[Unavoidable manual step]</action>
  <instructions>
    [What Claude already automated]
    [The ONE thing requiring human action]
  </instructions>
  <verification>[What Claude checks afterward]</verification>
  <resume-signal>Type "done" when complete</resume-signal>
</task>
```

## Execution Protocol

When executing a plan encounters `type="checkpoint:*"`:

1. **Stop immediately** — do not proceed to next task
2. **Display checkpoint clearly** with visual separator
3. **Wait for user response** — instead of proceeding on assumptions, because unverified checkpoints accumulate into larger failures that are harder to diagnose
4. **Verify if possible** — check files, run tests after human action
5. **Resume execution** — continue only after confirmation

## Diagnostic Failure Routing

When a checkpoint:human-verify receives failure reports OR when `/paul:verify` finds issues, classify the root cause BEFORE attempting fixes — instead of patching immediately, because wrong-layer fixes produce fragile patches that break again.

**Classification:**

| Type | Signal | Routing |
|---|---|---|
| **Intent** | "I need something different than what was planned" | Archive plan, re-plan the phase with updated intent |
| **Spec** | "The plan missed something or got it wrong" | Update ACs/tasks at the spec level before generating code fixes |
| **Code** | "The plan was right, implementation doesn't match" | Standard fix-in-place — patch code, re-verify |

**Where this applies:**
- **During APPLY:** checkpoint:human-verify failures (see apply-phase.md)
- **After APPLY:** /paul:verify UAT failures (see verify-work.md)

**Why classification matters:**
- Intent wrong + code patch = fix that contradicts what the user actually wants
- Spec wrong + code patch = fix that contradicts the plan, making UNIFY reconciliation unreliable
- Code wrong + code patch = correct response — this is the only case where patching is the right move

**Anti-pattern:** Jumping straight to code patches without classifying. Claude's default under pressure is to patch code because it's the fastest visible action — but speed at the wrong layer creates more work than pausing to classify.

## Authentication Gates

When Claude tries CLI/API and gets auth error, this is NOT a failure - it's a gate requiring human input to unblock automation.

**Pattern:** Claude tries automation → auth error → creates dynamic checkpoint → human authenticates → Claude retries → continues

**Key distinction:**
- Pre-planned checkpoint: "I need you to deploy" (WRONG - Claude should automate)
- Auth gate: "I tried to deploy but need credentials" (CORRECT - unblocks automation)

## Guidelines

**DO:**
- Automate everything with CLI/API before checkpoint
- Be specific: "Visit https://myapp.vercel.app" not "check deployment"
- Number verification steps
- State expected outcomes
- Make verification executable

**DON'T:**
- Ask human to do work Claude can automate
- Assume knowledge: "Configure the usual settings"
- Mix multiple verifications in one checkpoint
- Use checkpoints too frequently (verification fatigue)

**Placement:**
- After automation completes (not before)
- After UI buildout
- Before dependent work (decisions)
- At integration points

## Anti-Patterns

**BAD: Asking human to automate**
```xml
<task type="checkpoint:human-action">
  <action>Deploy to Vercel</action>
  <instructions>Visit vercel.com/new, import repo, click Deploy</instructions>
</task>
```
Why bad: Vercel has CLI. Use `vercel --yes`.

**BAD: Too many checkpoints**
```xml
<task type="auto">Create schema</task>
<task type="checkpoint:human-verify">Check schema</task>
<task type="auto">Create API</task>
<task type="checkpoint:human-verify">Check API</task>
```
Why bad: Verification fatigue. Combine into one checkpoint at end.

**GOOD: Claude automates, human verifies once**
```xml
<task type="auto">Create schema</task>
<task type="auto">Create API</task>
<task type="auto">Create UI</task>

<task type="checkpoint:human-verify">
  <what-built>Complete auth flow</what-built>
  <how-to-verify>Test full flow: register, login, access protected page</how-to-verify>
</task>
```

## Summary

| Type | % Used | Purpose |
|------|--------|---------|
| checkpoint:human-verify | 90% | Claude automated, human confirms visual/functional |
| checkpoint:decision | 9% | Human makes architectural/technology choice |
| checkpoint:human-action | 1% | Truly unavoidable manual step (no API/CLI) |

**When NOT to use checkpoints:**
- Things Claude can verify programmatically (tests, builds)
- File operations (Claude can read/write)
- Anything with CLI/API available

</checkpoints>
