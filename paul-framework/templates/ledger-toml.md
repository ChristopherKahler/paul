# ledger.toml Template

Template for `.paul/ledger.toml` — append-only session history for cost and time attribution.

**Purpose:** Records a timestamped entry for every PAUL action (plan, apply, unify, etc.) so BASE-v2 can attribute Claude Code token usage and cost to specific projects, phases, and workflow stages by timestamp-matching against session JSONL data.

---

## File Template

```toml
# .paul/ledger.toml — Session history for cost/time attribution
# Append-only. BASE extracts for usage analytics cross-reference.
# Entries are NEVER modified or deleted.

[[entry]]
action = "plan"
phase = 1
plan = "01-01"
at = "2026-06-03T10:30:00-05:00"

[[entry]]
action = "apply"
phase = 1
plan = "01-01"
at = "2026-06-03T10:45:00-05:00"

[[entry]]
action = "unify"
phase = 1
plan = "01-01"
at = "2026-06-03T11:20:00-05:00"
```

---

## Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `action` | string | Yes | The PAUL workflow action that occurred. See Action Types table. |
| `phase` | integer | Yes | Phase number when the action occurred. |
| `plan` | string | Conditional | Plan ID (e.g., `"02-04"`). Present for plan/apply/unify/iteration/verify. Absent for milestone-level and status-change actions. |
| `at` | string | Yes | ISO 8601 timestamp with timezone of when the action completed. |
| `note` | string | No | Context for iterations or notable events. Captures why an iteration happened (gap found, AC failed, scope change). |

---

## Action Types

| PAUL Action | `action` value | Trigger | `plan` field |
|-------------|----------------|---------|--------------|
| `/paul:plan` | `"plan"` | Plan created and approved | Yes |
| `/paul:apply` | `"apply"` | Apply begins execution | Yes |
| `/paul:unify` | `"unify"` | Unify completes and loop closes | Yes |
| Back-and-forth fixes | `"iteration"` | Any work between apply→unify or plan→apply revisions | Yes |
| `/paul:verify` | `"verify"` | UAT checklist run | Yes |
| Phase transition | `"transition"` | Phase marked complete, next phase activated | No |
| `/paul:milestone` | `"milestone_create"` | New milestone created | No |
| `/paul:complete-milestone` | `"milestone_complete"` | Milestone archived and closed | No |

---

## Example

A realistic lifecycle showing a full plan cycle with an iteration:

```toml
# Phase 2, Plan 01 — full lifecycle
[[entry]]
action = "plan"
phase = 2
plan = "02-01"
at = "2026-06-03T09:00:00-05:00"

[[entry]]
action = "apply"
phase = 2
plan = "02-01"
at = "2026-06-03T09:15:00-05:00"

[[entry]]
action = "iteration"
phase = 2
plan = "02-01"
at = "2026-06-03T09:45:00-05:00"
note = "AC-3 gap: missing error handling for 404 responses"

[[entry]]
action = "verify"
phase = 2
plan = "02-01"
at = "2026-06-03T10:00:00-05:00"

[[entry]]
action = "unify"
phase = 2
plan = "02-01"
at = "2026-06-03T10:15:00-05:00"

# Phase 2, Plan 02 — next plan in same phase
[[entry]]
action = "plan"
phase = 2
plan = "02-02"
at = "2026-06-03T10:30:00-05:00"

[[entry]]
action = "apply"
phase = 2
plan = "02-02"
at = "2026-06-03T10:40:00-05:00"

[[entry]]
action = "unify"
phase = 2
plan = "02-02"
at = "2026-06-03T11:00:00-05:00"

# Phase 2 complete — transition
[[entry]]
action = "transition"
phase = 2
at = "2026-06-03T11:05:00-05:00"
```

### What BASE Derives From This

**Per-phase cost** (timestamp-matched against Claude Code session JSONL):
```
Phase 2: 3 sessions · 1 day · $4.82 total
  plan:       2 entries · $1.20
  apply:      2 entries · $1.85
  iteration:  1 entry   · $0.92
  verify:     1 entry   · $0.45
  unify:      2 entries · $0.40
```

**Per-milestone cost** (aggregated across phases):
```
v0.2 API Layer: 14 sessions · 8 days · $12.40
  Phase 1: 3 sessions · 1 day  · $2.10
  Phase 2: 5 sessions · 3 days · $4.82
  Phase 3: 6 sessions · 4 days · $5.48
```

---

## Design Notes

- **Append-only.** Entries are never modified or deleted. The ledger is a write-once audit trail. Each PAUL workflow appends one `[[entry]]` block to the end of the file.
- **No session IDs.** PAUL has no reliable way to query the current Claude Code session ID at runtime. Session attribution is a BASE-side concern — BASE's extractor handles it by timestamp-matching each entry's `at` value against Claude Code session JSONL time ranges (using the existing `UsageEvent` pipeline and `collect_all_events()` from BASE Plan 08-06).
- **Timestamp-match attribution.** If a ledger entry's `at` timestamp falls within a session's first-to-last event window, that session's token cost is attributed to the ledger entry's project and phase. Multiple entries in the same session share that session's cost.
- **File growth.** The ledger grows linearly with PAUL actions. At ~100 bytes per entry, a 200-plan project produces ~20KB. A 1000-plan mega-project hits ~100KB. Both are well within acceptable limits for a text file that delivers per-project cost attribution.
- **Separate from paul.toml.** paul.toml is a state snapshot (overwritten on every change). ledger.toml is history (append-only). Different write semantics, different files. BASE extracts both.
- **Iteration entries.** The `"iteration"` action captures work that happens between formal PAUL stages — fix cycles after apply, revisions after verify, back-and-forth before unify. The `note` field documents why the iteration happened, creating an audit trail of rework.

---

*Template added: v1.4 Agentic OS Integration*
