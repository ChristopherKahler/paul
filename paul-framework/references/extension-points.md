<extension_points>

## Purpose

Canonical catalog of all PAUL extension points. Plugin authors building PAUL integrations reference this document to understand where their `@` references will fire, what context is available, and what use cases each point serves.

**Spec reference:** `projects/extension-architecture/SPEC.md` Section 3 (Extension Point Format)

## Extension Points Overview

| # | Workflow File | Loop Phase | Fires After | Primary Use Case |
|---|--------------|------------|-------------|------------------|
| 1 | `workflows/plan-phase.md` | PLAN | Plan created, validated, coherence-checked | Pre-execution analysis, plan metadata capture |
| 2 | `workflows/apply-phase.md` | APPLY | All tasks executed, verified, qualified | Post-execution hooks, build artifact processing |
| 3 | `workflows/unify-phase.md` | UNIFY | Reconciliation, SUMMARY, STATE update complete | Build log capture, content pipeline, metrics |
| 4 | `workflows/verify-work.md` | VERIFY (post-APPLY) | UAT checklist completed, verdict rendered | Quality gate integrations, test result capture |
| 5 | `workflows/transition-phase.md` | TRANSITION (phase close) | Phase marked complete, git committed, state verified | Phase-level reporting, milestone tracking |

## Detailed Extension Points

### 1. plan-phase.md

**Loop phase:** PLAN
**Fires after:** Plan is created, validated, coherence-checked against PROJECT.md and STATE.md decisions. STATE.md updated with plan position.
**Available context at this point:**
- `.paul/phases/{NN}-{name}/{NN}-{plan}-PLAN.md` — the just-created plan
- `.paul/STATE.md` — updated with plan reference
- `.paul/PROJECT.md` — project requirements and constraints
- `.paul/ROADMAP.md` — phase structure and progress

**Example use cases:**
- **Planning analytics plugin:** Capture plan metadata (task count, estimated scope, checkpoint count) for project health dashboards
- **Dependency checker plugin:** Validate that referenced files in the plan actually exist before APPLY begins

---

### 2. apply-phase.md

**Loop phase:** APPLY
**Fires after:** All tasks in the plan have been executed, each passing the Execute/Qualify loop (verify + spec comparison). All checkpoints resolved.
**Available context at this point:**
- All files listed in `files_modified` — created or updated
- Execution log — task statuses, qualify results (PASS/GAP/DRIFT), deviations
- `.paul/STATE.md` — about to be updated with APPLY complete
- The PLAN.md — for cross-reference against what was built

**Example use cases:**
- **Build artifact plugin:** Package or snapshot what was built for deployment tracking
- **Code quality plugin:** Run linting/analysis on modified files before declaring APPLY complete

---

### 3. unify-phase.md

**Loop phase:** UNIFY
**Fires after:** Plan vs actual reconciliation complete. SUMMARY.md created with what was built, decisions made, deferred issues. STATE.md updated. ROADMAP.md updated if phase complete.
**Available context at this point:**
- `.paul/phases/{NN}-{name}/{NN}-{plan}-SUMMARY.md` — what was actually built
- `.paul/STATE.md` — fully updated with loop closure
- `.paul/ROADMAP.md` — phase progress updated
- All modified source files — in their final state

**Example use cases:**
- **Content-pipeline plugin:** Read SUMMARY.md, extract build metadata (what was built, why, teachable insights), write structured build log to `.paul/build-logs/` for blog/course content
- **Metrics plugin:** Calculate plan accuracy (planned vs actual tasks, deviations), track velocity

---

### 4. verify-work.md

**Loop phase:** VERIFY (optional, post-APPLY)
**Fires after:** UAT checklist generated from SUMMARY.md acceptance criteria. User walked through each test. Results captured (pass/fail/partial/skip). Verdict rendered.
**Available context at this point:**
- UAT results — per-criterion pass/fail with user feedback
- `.paul/phases/{NN}-{name}/uat-{plan}.md` — logged issues (if any)
- SUMMARY.md — what was built (for cross-reference)
- Diagnostic classification — intent/spec/code (if issues found)

**Example use cases:**
- **QA reporting plugin:** Capture UAT results into a structured test report for audit trails
- **Issue tracker plugin:** Auto-create issues from failed UAT items in an external system

---

### 5. transition-phase.md

**Loop phase:** TRANSITION (phase close)
**Fires after:** All plans in phase verified complete. PROJECT.md evolved with validated requirements. STATE.md updated for next phase. ROADMAP.md marked complete. Git commit created. State consistency verified across all three files.
**Available context at this point:**
- All SUMMARY.md files for the completed phase
- `.paul/PROJECT.md` — evolved with phase learnings
- `.paul/STATE.md` — pointing to next phase
- `.paul/ROADMAP.md` — phase marked complete with timestamp
- Git commit hash for the phase

**Example use cases:**
- **Phase report plugin:** Generate a comprehensive phase completion report combining all plan summaries, decisions, and deferred issues
- **Notification plugin:** Send phase completion notification to external systems (Slack, email, project management tools)

## How Plugins Use Extension Points

Per SPEC.md, plugins declare their extension point targets in `manifest.json`:

```json
{
  "extensions": [
    {
      "target": "{paul_framework}/workflows/unify-phase.md",
      "section": "extensions",
      "inject": "@content-build-log.md — Capture build log at unify"
    }
  ]
}
```

The installer injects the `@` reference into the `## Extensions` section using comment-block isolation:

```markdown
## Extensions
<!-- Extensions are managed by integration installers. Do not edit manually. -->
<!-- CONTENT-PIPELINE --> @content-build-log.md — Capture build log at unify
<!-- /CONTENT-PIPELINE -->
```

## Rules

1. Extensions fire AFTER all core workflow steps — they never interrupt core behavior
2. Extension sections are always the LAST section in workflow files
3. Comment-block isolation (`<!-- NAME -->` / `<!-- /NAME -->`) required per SPEC.md
4. Plugins never modify core workflow content — they only add via extension points
5. This document is the canonical list — if an extension point isn't listed here, it doesn't exist in PAUL

</extension_points>
