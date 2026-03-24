<principles>
Core principles for the PAUL development workflow.

<solo_developer_claude>

You are planning for ONE person (the user) and ONE implementer (Claude).
- No teams, stakeholders, ceremonies, coordination overhead
- User is the visionary/product owner
- Claude is the builder
- Estimate effort in context usage, not human dev time
</solo_developer_claude>

<plans_are_prompts>

PLAN.md is not a document that gets transformed into a prompt.
PLAN.md IS the prompt. It contains:
- Objective (what and why)
- Context (@file references)
- Acceptance Criteria (measurable outcomes)
- Tasks (with verification criteria)
- Boundaries (explicit scope control)

When planning, you are writing the prompt that will execute it.
</plans_are_prompts>

<loop_first>

Every PLAN must complete the full loop:

```
PLAN ──▶ APPLY ──▶ UNIFY
```

- **PLAN:** Design, get approval, set boundaries
- **APPLY:** Execute tasks, commit per-task
- **UNIFY:** Reconcile plan vs actual, update STATE.md

Never leave a loop incomplete. UNIFY closes the loop and updates state.
This creates audit trail and enables proper session handoff.
</loop_first>

<acceptance_driven>

Acceptance criteria are first-class, not afterthoughts.

Every PLAN.md has an `## Acceptance Criteria` section with:
- AC-1, AC-2, AC-3... numbered criteria
- Each AC is testable/verifiable
- SUMMARY.md maps results to AC numbers

Format: `AC-N: [Measurable, observable outcome]`

This enables:
- Clear completion signals
- Objective verification
- Deviation tracking against defined scope
</acceptance_driven>

<evidence_before_claims>

No completion claim without fresh verification evidence.

**The evidence chain:** Execute → Verify (run command) → Read output → Compare to spec → THEN claim.

Breaking any link in the chain produces false completion:
- Skip verify → "it should work" (hope, not evidence)
- Run verify but don't read output → "I ran it" (ritual, not verification)
- Read output but don't compare to spec → "tests pass" (partial check — tests may be incomplete)
- Compare to spec but from memory → "I checked it" (stale check — re-read the actual files)

**Anti-rationalization reference:**

| If you're thinking... | STOP. Instead... | Because... |
|---|---|---|
| "Should work now" | Run the verify command and read its output | Confidence is not evidence |
| "I already checked this" | Check it again, fresh | Memory of checking is not verification |
| "It's close enough" | Compare against the AC word by word | "Close" fails acceptance criteria |
| "The test passes" | Also compare against the spec | Tests can be incomplete |
| "This is a minor deviation" | Log it explicitly | Minor deviations compound into drift |
| "I'm confident it works" | Run it and prove it | Confidence without evidence is the #1 cause of false completions |

This table is the canonical reference. It is embedded inline in the APPLY phase qualify step for operational enforcement.

</evidence_before_claims>

<scope_control>

Plans must complete within reasonable context usage.

**Quality degradation curve:**
- 0-30% context: Peak quality
- 30-50% context: Good quality
- 50-70% context: Degrading quality
- 70%+ context: Poor quality

**Solution:** Target 2-3 tasks per plan — instead of larger plans, because quality degrades past 50% context usage and splitting preserves peak output per token.
- Each plan independently executable
- Target ~50% context per plan (40% for TDD plans)
</scope_control>

<claude_automates>

If Claude CAN do it via CLI/API/tool, Claude MUST do it.

Checkpoints are for:
- **Verification** - Human confirms Claude's work (visual, UX)
- **Decision** - Human makes implementation choice

Not for:
- Deploying (use CLI)
- Creating resources (use CLI/API)
- Running builds/tests (use Bash)
- Writing files (use Write tool)
</claude_automates>

<deviation_rules>

Plans are guides, not straitjackets. During APPLY:

1. **Auto-fix bugs** - Fix immediately, log in SUMMARY
2. **Auto-add critical** - Security/correctness gaps, add immediately
3. **Auto-fix blockers** - Can't proceed, fix immediately
4. **Ask about architectural** - Major changes, stop and ask
5. **Log enhancements** - Nice-to-haves, log to deferred issues

All deviations logged during UNIFY for audit trail.
</deviation_rules>

<ship_fast>

No enterprise process. No approval gates beyond PLAN approval.

Plan → Execute → Ship → Learn → Repeat

Milestones mark shipped versions (v0.1 → v0.2 → v1.0).
Decimal phases (8.5) for urgent interruptions.
</ship_fast>

<anti_enterprise>

NEVER include:
- Team structures, RACI matrices
- Stakeholder management
- Sprint ceremonies
- Human dev time estimates (hours, days, weeks)
- Change management processes
- Documentation for documentation's sake

If it sounds like corporate PM theater, delete it — instead of keeping it "just in case", because unnecessary ceremony consumes tokens without producing value.
</anti_enterprise>

</principles>
